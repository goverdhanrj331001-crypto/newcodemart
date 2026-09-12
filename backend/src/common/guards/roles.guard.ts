import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLE_HIERARCHY, UserRole } from '../decorators/role.enum';

/**
 * Role-based authorization guard. Apply at method or controller level:
 *
 *   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 *   @UseGuards(RolesGuard)
 *
 * The guard reads the authenticated user (set by JwtAuthGuard) and verifies
 * the user's role grants access to at least one of the allowed roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new ForbiddenException('Authentication required');

    const userRole = user.role as UserRole;
    const allowedRoles = ROLE_HIERARCHY[userRole] || [];

    const hasAccess = requiredRoles.some((r) => allowedRoles.includes(r));
    if (!hasAccess) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles.join(' or ')}.`,
      );
    }
    return true;
  }
}
