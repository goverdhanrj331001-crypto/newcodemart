import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: any;
}

/**
 * Wraps every successful response in a consistent JSON envelope:
 *   { success: true, data: ... }
 *
 * If a controller returns `{ data, meta }`, both keys are preserved.
 * Exceptions are handled by AllExceptionsFilter.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessEnvelope<T>> {
  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<SuccessEnvelope<T>> {
    return next.handle().pipe(
      map((payload) => {
        if (payload && typeof payload === 'object' && 'data' in payload && 'meta' in payload) {
          return {
            success: true,
            data: payload.data,
            meta: payload.meta,
          };
        }
        // Already wrapped? skip
        if (payload && typeof payload === 'object' && 'success' in payload) {
          return payload;
        }
        return { success: true, data: payload };
      }),
    );
  }
}
