import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * Global exception handler. Normalises every thrown error into a consistent
 * JSON envelope so the frontend never has to guess the response shape.
 *
 * Envelope:
 *   {
 *     success: false,
 *     statusCode: number,
 *     message: string | string[],
 *     error: string,
 *     path: string,
 *     timestamp: ISO-string,
 *   }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse() as any;
      message = typeof resp === 'string' ? resp : resp.message || resp.error || exception.message;
      error = resp.error || exception.name;
    } else if (exception instanceof QueryFailedError) {
      const driverErr = exception as any;
      status = this.mapPostgresError(driverErr.code);
      message = this.humanisePostgresError(driverErr.code, driverErr.detail || driverErr.message);
      error = 'Database Error';
      this.logger.error(`DB error [${driverErr.code}] ${driverErr.message}`);
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Never leak 500 internals in production
    if (status >= 500 && process.env.NODE_ENV === 'production') {
      message = 'Internal server error. Please try again later.';
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else if (status >= 400) {
      this.logger.warn(`${request.method} ${request.url} → ${status} : ${JSON.stringify(message)}`);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapPostgresError(code: string): number {
    switch (code) {
      case '23505': // unique_violation
        return HttpStatus.CONFLICT;
      case '23503': // foreign_key_violation
        return HttpStatus.BAD_REQUEST;
      case '23502': // not_null_violation
        return HttpStatus.BAD_REQUEST;
      case '22P02': // invalid_text_representation
        return HttpStatus.BAD_REQUEST;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private humanisePostgresError(code: string, detail: string): string {
    switch (code) {
      case '23505': {
        const m = detail?.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
        return m ? `${m[1]} "${m[2]}" already exists` : 'Resource already exists';
      }
      case '23503':
        return 'Referenced resource not found';
      case '23502':
        return 'Missing required field';
      default:
        return 'Database operation failed';
    }
  }
}
