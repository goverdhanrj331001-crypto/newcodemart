import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Optional JWT guard — attaches `request.user` if a valid token is present,
 * but does NOT reject the request if the token is missing or invalid.
 *
 * Useful for public product detail pages where logged-in users get extra info
 * (e.g. "you already own this", "review submitted by you").
 */
@Injectable()
export class OptionalJwtGuard implements CanActivate {
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
    if (token) {
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
      } catch {
        // Ignore — proceed anonymously
      }
    }
    return true;
  }

  private extractToken(request: any): string | null {
    const header = request.headers?.authorization || request.headers?.Authorization;
    if (!header) return null;
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token.trim();
  }
}
