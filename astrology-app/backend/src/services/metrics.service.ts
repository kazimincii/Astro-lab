/**
 * Metrics Service
 *
 * Provides custom business metrics for Prometheus monitoring
 * Tracks application-specific metrics like subscriptions, API calls, cache performance
 */

import { Injectable } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram<string>,

    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter<string>,

    @InjectMetric('http_errors_total')
    private readonly httpErrorsTotal: Counter<string>,

    @InjectMetric('cache_operations_total')
    private readonly cacheOperationsTotal: Counter<string>,

    @InjectMetric('cache_hit_ratio')
    private readonly cacheHitRatio: Gauge<string>,

    @InjectMetric('db_query_duration_seconds')
    private readonly dbQueryDuration: Histogram<string>,

    @InjectMetric('active_subscriptions')
    private readonly activeSubscriptions: Gauge<string>,

    @InjectMetric('api_calls_total')
    private readonly apiCallsTotal: Counter<string>,
  ) {}

  /**
   * Record HTTP request metrics
   */
  recordHttpRequest(method: string, path: string, statusCode: number, duration: number) {
    const labels = {
      method,
      path,
      status: statusCode.toString(),
    };

    this.httpRequestDuration.observe(labels, duration / 1000); // Convert to seconds
    this.httpRequestsTotal.inc(labels);

    if (statusCode >= 400) {
      this.httpErrorsTotal.inc(labels);
    }
  }

  /**
   * Record cache operation
   */
  recordCacheOperation(operation: 'hit' | 'miss' | 'set', key: string) {
    this.cacheOperationsTotal.inc({ operation, key_prefix: this.getKeyPrefix(key) });
  }

  /**
   * Update cache hit ratio
   */
  updateCacheHitRatio(ratio: number) {
    this.cacheHitRatio.set({ cache: 'redis' }, ratio);
  }

  /**
   * Record database query duration
   */
  recordDbQuery(operation: string, table: string, duration: number) {
    this.dbQueryDuration.observe(
      { operation, table },
      duration / 1000, // Convert to seconds
    );
  }

  /**
   * Update active subscriptions count
   */
  updateActiveSubscriptions(count: number, plan: string) {
    this.activeSubscriptions.set({ plan }, count);
  }

  /**
   * Record API call (OpenAI, Stripe, etc.)
   */
  recordApiCall(provider: string, endpoint: string, success: boolean) {
    this.apiCallsTotal.inc({
      provider,
      endpoint,
      status: success ? 'success' : 'failure',
    });
  }

  /**
   * Extract key prefix from cache key
   */
  private getKeyPrefix(key: string): string {
    const parts = key.split(':');
    return parts[0] || 'unknown';
  }
}
