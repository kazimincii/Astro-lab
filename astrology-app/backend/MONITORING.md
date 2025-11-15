# Monitoring & Observability Guide

## Overview

This guide covers the monitoring and observability infrastructure for the Astrology Backend API.

## Architecture

### Components

1. **Prometheus Metrics** - Application and system metrics
2. **Winston Logging** - Structured logging with file rotation
3. **Sentry** - Error tracking and performance monitoring
4. **Health Checks** - Kubernetes-style liveness and readiness probes

## Prometheus Metrics

### Endpoints

**Metrics Endpoint**: `GET /metrics`
- Prometheus-format metrics
- Default metrics (CPU, memory, event loop, etc.)
- Custom business metrics

**Health Endpoints**:
- `GET /api/v1/health` - General health check
- `GET /api/v1/health/ready` - Readiness probe (includes memory stats)
- `GET /api/v1/health/live` - Liveness probe (minimal check)

### Available Metrics

#### HTTP Metrics

**`astrology_http_request_duration_seconds`** (Histogram)
- Duration of HTTP requests in seconds
- Labels: `method`, `path`, `status`
- Buckets: 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10

**`astrology_http_requests_total`** (Counter)
- Total number of HTTP requests
- Labels: `method`, `path`, `status`

**`astrology_http_errors_total`** (Counter)
- Total number of HTTP errors (4xx, 5xx)
- Labels: `method`, `path`, `status`

#### Cache Metrics

**`astrology_cache_operations_total`** (Counter)
- Total number of cache operations
- Labels: `operation` (hit/miss/set), `key_prefix`

**`astrology_cache_hit_ratio`** (Gauge)
- Cache hit ratio (0-1)
- Labels: `cache` (redis)

#### Database Metrics

**`astrology_db_query_duration_seconds`** (Histogram)
- Duration of database queries in seconds
- Labels: `operation`, `table`
- Buckets: 0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5

#### Business Metrics

**`astrology_active_subscriptions`** (Gauge)
- Number of active subscriptions by plan
- Labels: `plan` (basic/standard/premium/unlimited)

**`astrology_api_calls_total`** (Counter)
- Total number of external API calls
- Labels: `provider` (openai/stripe), `endpoint`, `status` (success/failure)

#### Default Node.js Metrics

All metrics are prefixed with `astrology_`:

- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_external_memory_bytes` - External memory
- `nodejs_heap_space_size_total_bytes` - Heap space sizes
- `nodejs_eventloop_lag_seconds` - Event loop lag
- `nodejs_version_info` - Node.js version
- `process_cpu_user_seconds_total` - CPU time
- `process_resident_memory_bytes` - Resident memory
- And many more...

### Using Metrics

#### Query Examples

**Average request duration (p95)**:
```promql
histogram_quantile(0.95,
  sum(rate(astrology_http_request_duration_seconds_bucket[5m])) by (le, path)
)
```

**Request rate**:
```promql
sum(rate(astrology_http_requests_total[5m])) by (path)
```

**Error rate**:
```promql
sum(rate(astrology_http_errors_total[5m])) by (status)
```

**Cache hit ratio**:
```promql
astrology_cache_hit_ratio
```

**Top slow endpoints**:
```promql
topk(10,
  histogram_quantile(0.95,
    sum(rate(astrology_http_request_duration_seconds_bucket[5m])) by (le, path)
  )
)
```

## Setting Up Prometheus

### 1. Install Prometheus

**Docker Compose** (`docker-compose.monitoring.yml`):
```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - '3001:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SERVER_ROOT_URL=http://localhost:3001
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
```

### 2. Configure Prometheus

**`prometheus.yml`**:
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'astrology-backend'
    static_configs:
      - targets: ['backend:3000']  # Docker service name
        labels:
          environment: 'production'
          service: 'astrology-backend'
    metrics_path: '/metrics'
    scrape_interval: 10s
    scrape_timeout: 5s
```

### 3. Start Monitoring Stack

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## Grafana Dashboards

### 1. Add Prometheus Data Source

1. Login to Grafana (http://localhost:3001)
2. Go to Configuration → Data Sources
3. Add Prometheus: `http://prometheus:9090`
4. Save & Test

### 2. Import Dashboard

Create `grafana/dashboards/astrology-backend.json`:

```json
{
  "dashboard": {
    "title": "Astrology Backend Overview",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "sum(rate(astrology_http_requests_total[5m]))",
            "legendFormat": "Requests/sec"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "sum(rate(astrology_http_errors_total[5m]))",
            "legendFormat": "Errors/sec"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(astrology_http_request_duration_seconds_bucket[5m])) by (le))",
            "legendFormat": "p95 latency"
          }
        ]
      },
      {
        "title": "Cache Hit Ratio",
        "targets": [
          {
            "expr": "astrology_cache_hit_ratio",
            "legendFormat": "Hit Ratio"
          }
        ]
      }
    ]
  }
}
```

### 3. Recommended Panels

**API Performance**:
- Request rate
- Error rate
- Response time percentiles (p50, p95, p99)
- Requests by endpoint
- Errors by status code

**System Resources**:
- CPU usage
- Memory usage (heap, RSS)
- Event loop lag
- Active connections

**Business Metrics**:
- Active subscriptions by plan
- API calls by provider
- Cache hit ratio
- Database query performance

**Errors & Logging**:
- Error rate over time
- Errors by endpoint
- Sentry integration

## Alerting

### Prometheus Alert Rules

**`alert.rules.yml`**:
```yaml
groups:
  - name: astrology_backend_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: sum(rate(astrology_http_errors_total[5m])) / sum(rate(astrology_http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} (threshold: 5%)"

      # Slow response time
      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, sum(rate(astrology_http_request_duration_seconds_bucket[5m])) by (le)) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Slow response time detected"
          description: "P95 response time is {{ $value }}s (threshold: 1s)"

      # Low cache hit ratio
      - alert: LowCacheHitRatio
        expr: astrology_cache_hit_ratio < 0.6
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "Cache hit ratio is low"
          description: "Cache hit ratio is {{ $value | humanizePercentage }} (threshold: 60%)"

      # High memory usage
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 2000000000  # 2GB
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanize1024 }} (threshold: 2GB)"

      # Service down
      - alert: ServiceDown
        expr: up{job="astrology-backend"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Astrology Backend is down"
          description: "Service has been down for more than 1 minute"
```

### Alertmanager Configuration

**`alertmanager.yml`**:
```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'

receivers:
  - name: 'default'
    email_configs:
      - to: 'ops@yourdomain.com'
        from: 'alertmanager@yourdomain.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'your-email@gmail.com'
        auth_password: 'your-app-password'
```

### Slack Integration

```yaml
receivers:
  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

## Health Checks

### Kubernetes Probes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: astrology-backend
spec:
  containers:
  - name: backend
    image: astrology-backend:latest
    ports:
    - containerPort: 3000
    livenessProbe:
      httpGet:
        path: /api/v1/health/live
        port: 3000
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /api/v1/health/ready
        port: 3000
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
```

### Docker Healthcheck

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health/live', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"
```

## Monitoring Best Practices

### 1. Set Up Alerts

**Critical Alerts** (immediate action required):
- Service down
- Database connection failures
- Very high error rate (>20%)

**Warning Alerts** (investigate soon):
- High error rate (>5%)
- Slow response times
- High memory/CPU usage
- Low cache hit ratio

**Info Alerts** (good to know):
- Unusual traffic patterns
- External API failures
- Cache evictions

### 2. Dashboard Organization

Create separate dashboards for:
- **Overview**: High-level service health
- **API Performance**: Request rates, latency, errors
- **Infrastructure**: CPU, memory, disk, network
- **Business Metrics**: Subscriptions, API calls, user activity
- **Database**: Query performance, connection pool

### 3. Retention and Storage

**Prometheus**:
```yaml
storage:
  tsdb:
    retention.time: 30d  # Keep metrics for 30 days
    retention.size: 50GB  # Or until 50GB
```

**Log Files** (already configured):
- Error logs: 30 days
- Combined logs: 14 days
- HTTP logs: 7 days

### 4. Performance Considerations

- Use recording rules for expensive queries
- Set appropriate scrape intervals (10-30s)
- Use label cardinality wisely (avoid user IDs in labels)
- Archive old metrics to long-term storage

### 5. Security

- Restrict metrics endpoint to internal network
- Use authentication for Grafana
- Enable HTTPS for Prometheus/Grafana
- Sanitize sensitive data from metrics

## Troubleshooting

### Issue: Metrics not appearing

**Check**:
1. `/metrics` endpoint is accessible
2. Prometheus is scraping (check Targets page)
3. No firewall blocking metrics endpoint

**Solution**:
```bash
# Test metrics endpoint
curl http://localhost:3000/metrics

# Check Prometheus targets
# Go to http://localhost:9090/targets
```

### Issue: High cardinality warnings

**Symptom**: Prometheus using excessive memory

**Solution**:
- Normalize paths (remove IDs from labels)
- Use `path` pattern instead of actual URLs
- MetricsInterceptor already normalizes paths

### Issue: Missing data points

**Check**:
- Scrape interval vs query range
- Metrics retention period
- Application restarts

## Advanced Topics

### 1. Distributed Tracing

Add OpenTelemetry for distributed tracing:

```bash
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
```

### 2. Log Aggregation

Use ELK/Loki for centralized logging:

```yaml
# docker-compose.monitoring.yml
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
```

### 3. Custom Exporters

Create custom exporters for:
- Stripe metrics (subscription stats)
- OpenAI usage and costs
- Database query stats

### 4. SLO/SLI Tracking

Define Service Level Objectives:

```yaml
# SLO: 99.9% uptime
- record: slo:uptime:ratio
  expr: avg_over_time(up{job="astrology-backend"}[30d])

# SLO: 95% of requests < 500ms
- record: slo:latency:ratio
  expr: histogram_quantile(0.95, rate(astrology_http_request_duration_seconds_bucket[30d])) < 0.5
```

## Monitoring Checklist

### Daily
- [ ] Check error rate dashboard
- [ ] Review critical alerts
- [ ] Check service health status

### Weekly
- [ ] Review performance trends
- [ ] Check cache hit ratio
- [ ] Review slow query log
- [ ] Check disk space (metrics, logs)

### Monthly
- [ ] Review alert rules
- [ ] Update dashboard panels
- [ ] Check retention policies
- [ ] Analyze cost trends (API calls)

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [PromQL Cheat Sheet](https://promlabs.com/promql-cheat-sheet/)
- [Node.js Prometheus Client](https://github.com/siimon/prom-client)

## License

MIT
