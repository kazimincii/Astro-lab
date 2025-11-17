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
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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
      message = typeof exceptionResponse === 'string'
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

    const errorLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode: status,
      error: exception instanceof Error ? exception.name : 'Unknown',
      message: exception instanceof Error ? exception.message : 'Unknown error',
      body: this.sanitizeBody(body),
      query,
      params,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    // Critical errors (500+) should be logged with full stack trace
    if (status >= 500) {
      this.logger.error(
        JSON.stringify(errorLog),
        exception instanceof Error ? exception.stack : 'No stack trace available'
      );
    } else if (status >= 400) {
      this.logger.warn(JSON.stringify(errorLog));
    } else {
      this.logger.log(JSON.stringify(errorLog));
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'refreshToken', 'accessToken'];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
