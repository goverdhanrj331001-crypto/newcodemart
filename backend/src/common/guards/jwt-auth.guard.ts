import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Global JWT auth guard.
 *
 * Routes annotated with @Public() are skipped. Every other route requires a
 * valid `Authorization: Bearer <access-token>` header. The decoded payload is
 * attached to `request.user`.
 *
 * Auth-related routes (login/register) use @Public() since the user is not
 * authenticated yet.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Missing authentication token');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });
      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        permissions: payload.permissions,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private extractToken(request: any): string | null {
    const header = request.headers?.authorization || request.headers?.Authorization;
    if (!header) return null;
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token.trim();
  }
}
