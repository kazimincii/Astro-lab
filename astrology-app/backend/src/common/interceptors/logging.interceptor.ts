/**
 * Logging Interceptor
 *
 * Logs all incoming requests and outgoing responses
 * Tracks request duration and response status
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    const { method, url, body, query, params, headers } = request;

    // Log request
    const requestLog = {
      type: 'REQUEST',
      timestamp: new Date().toISOString(),
      method,
      url,
      body: this.sanitizeBody(body),
      query,
      params,
      userAgent: headers['user-agent'],
      ip: request.ip,
    };

    this.logger.log(JSON.stringify(requestLog));

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const duration = Date.now() - startTime;

          // Log successful response
          const responseLog = {
            type: 'RESPONSE',
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            responseSize: JSON.stringify(data).length,
          };

          this.logger.log(JSON.stringify(responseLog));
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;

          // Log error response
          const errorLog = {
            type: 'ERROR_RESPONSE',
            timestamp: new Date().toISOString(),
            method,
            url,
            duration: `${duration}ms`,
            error: error.name,
            message: error.message,
          };

          this.logger.error(JSON.stringify(errorLog));
        },
      }),
    );
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
      'creditCard',
      'ssn',
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
