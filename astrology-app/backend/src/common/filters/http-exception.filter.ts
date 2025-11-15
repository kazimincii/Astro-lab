/**
 * Global HTTP Exception Filter
 *
 * Handles all HTTP exceptions and formats error responses consistently
 * Provides detailed error logging for debugging
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

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract message from exception response
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error: exception.name,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = exception.stack;
    }

    // Log error details
    this.logError(request, exception, status);

    response.status(status).json(errorResponse);
  }

  private logError(request: Request, exception: HttpException, status: number) {
    const { method, url, body, query, params, headers } = request;

    const errorLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode: status,
      error: exception.name,
      message: exception.message,
      body: this.sanitizeBody(body),
      query,
      params,
      userAgent: headers['user-agent'],
      ip: request.ip,
    };

    // Log based on severity
    if (status >= 500) {
      this.logger.error(JSON.stringify(errorLog), exception.stack);
    } else if (status >= 400) {
      this.logger.warn(JSON.stringify(errorLog));
    } else {
      this.logger.log(JSON.stringify(errorLog));
    }
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'refreshToken'];
    const sanitized = { ...body };

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
