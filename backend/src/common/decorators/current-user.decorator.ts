import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

/**
 * Injects the authenticated user payload (from JWT) into a route handler.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: AuthUser) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): AuthUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser | undefined;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
