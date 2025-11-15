/**
 * Global All Exceptions Filter
 *
 * Catches all unhandled exceptions (including non-HTTP exceptions)
 * Ensures all errors are properly logged and formatted
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../services/logger.service';
import { SentryService } from '../../services/sentry.service';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly sentry: SentryService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
      error = exception.name;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    // Log the error
    this.logError(request, exception, status);

    response.status(status).json(errorResponse);
  }

  private logError(request: Request, exception: unknown, status: number) {
    const { method, url, body, query, params } = request;

    const errorContext = {
      method,
      url,
      statusCode: status,
      body: this.sanitizeBody(body),
      query,
      params,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    const errorMessage =
      exception instanceof Error ? exception.message : 'Unknown error';

    // Critical errors (500+) should be logged with full stack trace and sent to Sentry
    if (status >= 500) {
      this.logger.error(
        errorMessage,
        exception instanceof Error ? exception.stack : undefined,
        'AllExceptionsFilter',
      );

      // Report to Sentry for critical errors
      if (exception instanceof Error) {
        this.sentry.captureException(exception, errorContext);
      }
    } else if (status >= 400) {
      this.logger.warn(errorMessage, 'AllExceptionsFilter');
    } else {
      this.logger.log(errorMessage, 'AllExceptionsFilter');
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'apiKey',
      'refreshToken',
      'accessToken',
    ];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
