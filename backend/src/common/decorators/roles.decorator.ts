import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles. Combine with the RolesGuard
 * (applied at controller or method level) — `@UseGuards(RolesGuard)`.
 *
 * Usage:
 *   @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 *   @UseGuards(RolesGuard)
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
