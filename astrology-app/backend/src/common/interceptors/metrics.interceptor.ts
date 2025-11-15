/**
 * Metrics Interceptor
 *
 * Automatically tracks HTTP request metrics for all endpoints
 * Records request duration, method, path, and status code
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetricsService } from '../../services/metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(private readonly metricsService: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const startTime = Date.now();
    const method = request.method;
    const path = this.normalizePath(request.route?.path || request.url);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          this.metricsService.recordHttpRequest(method, path, statusCode, duration);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.metricsService.recordHttpRequest(method, path, statusCode, duration);
        },
      }),
    );
  }

  /**
   * Normalize path to avoid high cardinality (e.g., /users/:id instead of /users/123)
   */
  private normalizePath(path: string): string {
    // Replace UUIDs and numeric IDs with :id
    return path
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id');
  }
}
