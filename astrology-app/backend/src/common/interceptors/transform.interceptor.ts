/**
 * Transform Interceptor
 *
 * Transforms all responses into a consistent format
 * Adds metadata like timestamp and request ID
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export interface Response<T> {
  success: boolean;
  data: T;
  metadata: {
    timestamp: string;
    requestId: string;
    path: string;
    method: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const requestId = request.headers['x-request-id'] || uuidv4();

    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          requestId,
          path: request.url,
          method: request.method,
        },
      })),
    );
  }
}
