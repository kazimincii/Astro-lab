/**
 * Metrics Module
 *
 * Configures Prometheus metrics and provides metrics service
 * Sets up custom business metrics and HTTP metrics
 */

import { Global, Module } from '@nestjs/common';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
  makeGaugeProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
        config: {
          prefix: 'astrology_',
        },
      },
    }),
  ],
  providers: [
    // HTTP Request Duration
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),

    // HTTP Requests Total
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    }),

    // HTTP Errors Total
    makeCounterProvider({
      name: 'http_errors_total',
      help: 'Total number of HTTP errors',
      labelNames: ['method', 'path', 'status'],
    }),

    // Cache Operations
    makeCounterProvider({
      name: 'cache_operations_total',
      help: 'Total number of cache operations',
      labelNames: ['operation', 'key_prefix'],
    }),

    // Cache Hit Ratio
    makeGaugeProvider({
      name: 'cache_hit_ratio',
      help: 'Cache hit ratio (0-1)',
      labelNames: ['cache'],
    }),

    // Database Query Duration
    makeHistogramProvider({
      name: 'db_query_duration_seconds',
      help: 'Duration of database queries in seconds',
      labelNames: ['operation', 'table'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),

    // Active Subscriptions
    makeGaugeProvider({
      name: 'active_subscriptions',
      help: 'Number of active subscriptions by plan',
      labelNames: ['plan'],
    }),

    // API Calls Total
    makeCounterProvider({
      name: 'api_calls_total',
      help: 'Total number of external API calls',
      labelNames: ['provider', 'endpoint', 'status'],
    }),

    MetricsService,
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
