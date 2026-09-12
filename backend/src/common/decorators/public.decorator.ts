import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or controller) as publicly accessible — bypasses the global
 * JwtAuthGuard. Use sparingly; most routes should require authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
