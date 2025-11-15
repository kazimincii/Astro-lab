# Performance Optimization Guide

## Overview

This guide covers performance optimizations implemented in the Astrology Backend API and best practices for maintaining optimal performance in production.

## Database Performance

### 1. Indexes

Comprehensive database indexes have been added for all frequently queried tables:

**Users & Profiles**:
- `IDX_users_email` - Fast user lookup by email
- `IDX_person_profiles_owner_id` - Owner's profiles
- `IDX_person_profiles_owner_main` - Composite index for main profile queries

**Subscriptions & Billing**:
- `IDX_subscriptions_user_status` - Active subscription lookup
- `IDX_subscriptions_stripe_sub_id` - Stripe webhook processing
- `IDX_subscriptions_end_date` - Expiration checks

**Action Logs** (Heavy read/write):
- `IDX_action_logs_user_date` - Daily action count queries
- `IDX_action_logs_type` - Filter by action type

**Forecasts & Charts**:
- `IDX_daily_forecasts_profile_date` - Today's forecast lookup
- `IDX_birth_charts_profile_id` - Profile chart retrieval

**Run Migration**:
```bash
npm run migration:run
```

### 2. Query Optimization

**Use Specific Selects**:
```typescript
// ❌ Bad - Loads all columns
await this.userRepository.find();

// ✅ Good - Only needed columns
await this.userRepository.find({
  select: ['id', 'email', 'firstName'],
});
```

**Use Relations Wisely**:
```typescript
// ❌ Bad - N+1 query problem
const users = await this.userRepository.find();
for (const user of users) {
  user.subscription = await this.subscriptionRepository.findOne({
    where: { userId: user.id },
  });
}

// ✅ Good - Single query with join
const users = await this.userRepository.find({
  relations: ['subscription'],
});
```

**Pagination**:
```typescript
// Always paginate large datasets
const [results, total] = await this.repository.findAndCount({
  skip: (page - 1) * limit,
  take: limit,
});
```

### 3. Connection Pooling

Default configuration (`.env`):
```env
DB_POOL_SIZE=10
DB_POOL_TIMEOUT=30000
DB_MAX_QUERY_EXECUTION_TIME=10000
```

Production recommendations:
- **Small app** (<1000 users): 10 connections
- **Medium app** (1000-10000 users): 20-30 connections
- **Large app** (>10000 users): 50-100 connections

**Monitor pool usage**:
```sql
SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'astrology_production';
```

## Redis Caching

### CacheService API

The `CacheService` provides a simple API for caching:

```typescript
import { CacheService } from '@/services/cache.service';

@Injectable()
export class MyService {
  constructor(private cacheService: CacheService) {}

  async getExpensiveData(id: string) {
    return this.cacheService.getOrSet(
      `expensive-data:${id}`,
      async () => {
        // This expensive operation only runs on cache miss
        return await this.repository.complexQuery(id);
      },
      300, // TTL: 5 minutes
    );
  }
}
```

### Caching Strategies

**1. Cache-Aside (Lazy Loading)**
```typescript
// Check cache first, load on miss
const cached = await this.cacheService.get<User>(`user:${id}`);
if (cached) return cached;

const user = await this.userRepository.findOne({ where: { id } });
await this.cacheService.set(`user:${id}`, user, 600); // 10 min
return user;
```

**2. Write-Through Cache**
```typescript
// Update cache immediately after write
async updateUser(id: string, data: Partial<User>) {
  const user = await this.userRepository.save({ id, ...data });

  // Invalidate or update cache
  await this.cacheService.set(`user:${id}`, user, 600);

  return user;
}
```

**3. Time-Based Invalidation**
```typescript
// Cache subscription plans (changes rarely)
await this.cacheService.set('subscription-plans', plans, 3600); // 1 hour
```

### What to Cache

**✅ Good candidates**:
- Subscription plans (rarely change)
- Daily forecasts (same for all users with same profile)
- User profiles (update infrequently)
- Computed astrology charts
- Feature flags
- Configuration data

**❌ Poor candidates**:
- Real-time action counts
- Stripe webhook data
- Authentication tokens
- Personal user data (privacy)

### Cache Keys Convention

Use hierarchical naming:
```
<entity>:<id>:<attribute>

Examples:
user:123:profile
forecast:456:2024-01-15
chart:789:natal
subscription:123:usage
```

## Response Optimization

### 1. Compression

Gzip compression is enabled in Nginx (see `nginx.conf`):
```nginx
gzip on;
gzip_types application/json application/javascript text/css;
gzip_min_length 1024;
```

### 2. Pagination

Always paginate large datasets:
```typescript
@Get()
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
async findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  const [results, total] = await this.service.findAndCount({
    skip: (page - 1) * limit,
    take: Math.min(limit, 100), // Max 100 per page
  });

  return {
    data: results,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

### 3. Selective Field Loading

Use DTOs to control response size:
```typescript
@ApiResponse({
  type: UserSummaryDto, // Only id, name, email
})
async getUserSummary() {
  return this.userRepository.find({
    select: ['id', 'name', 'email'],
  });
}
```

## Application Performance

### 1. Async Processing

For long-running tasks, use queues (BullMQ):
```typescript
// Instead of waiting for email send
await this.emailService.sendWelcome(user.email); // ❌ Slow

// Queue it
await this.emailQueue.add('welcome', { email: user.email }); // ✅ Fast
```

### 2. Batch Operations

Batch database operations:
```typescript
// ❌ Slow - N queries
for (const item of items) {
  await this.repository.save(item);
}

// ✅ Fast - 1 query
await this.repository.save(items);
```

### 3. Parallel Requests

Use `Promise.all()` for independent queries:
```typescript
// ❌ Sequential - 3 seconds total
const user = await this.userService.find(id); // 1s
const subscription = await this.subscriptionService.find(userId); // 1s
const actions = await this.actionsService.count(userId); // 1s

// ✅ Parallel - 1 second total
const [user, subscription, actions] = await Promise.all([
  this.userService.find(id),
  this.subscriptionService.find(userId),
  this.actionsService.count(userId),
]);
```

## Monitoring Performance

### 1. Query Logging

Enable slow query logging in `.env`:
```env
TYPEORM_LOGGING=true
TYPEORM_MAX_QUERY_EXECUTION_TIME=1000 # Log queries >1s
```

### 2. Application Metrics

Health endpoint provides basic metrics:
```bash
curl https://api.yourdomain.com/api/v1/health
```

### 3. Database Query Analysis

Find slow queries:
```sql
-- PostgreSQL slow query log
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 4. Redis Stats

```typescript
const stats = await this.cacheService.getStats();
console.log(stats);
// { connected: true, dbSize: 1234, hitRate: 0.85 }
```

## Performance Benchmarks

Target metrics for production:

| Metric | Target | Critical |
|--------|--------|----------|
| API Response Time (p95) | <200ms | <500ms |
| Database Query Time (p95) | <50ms | <200ms |
| Cache Hit Rate | >80% | >60% |
| Memory Usage | <1GB | <2GB |
| CPU Usage (avg) | <50% | <80% |

## Optimization Checklist

### Database
- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently filtered columns
- [ ] Connection pool configured
- [ ] Slow query logging enabled
- [ ] Regular VACUUM and ANALYZE

### Caching
- [ ] Redis configured and connected
- [ ] Cache keys follow naming convention
- [ ] TTL set appropriately
- [ ] Cache invalidation strategy defined
- [ ] Monitor cache hit rate

### Application
- [ ] Pagination on all list endpoints
- [ ] Async processing for long tasks
- [ ] Parallel queries where possible
- [ ] Response compression enabled
- [ ] N+1 queries eliminated

### Infrastructure
- [ ] CDN for static assets
- [ ] Load balancer configured
- [ ] Auto-scaling enabled
- [ ] Database read replicas (if needed)
- [ ] Monitoring and alerting

## Common Performance Issues

### Issue: Slow API responses
**Diagnosis**:
- Check slow query log
- Profile endpoint with `console.time()`
- Check database connection pool

**Solution**:
- Add missing indexes
- Implement caching
- Optimize queries (select specific fields)

### Issue: High memory usage
**Diagnosis**:
- Check for memory leaks with heap snapshots
- Monitor cache size

**Solution**:
- Limit cache size in Redis
- Implement pagination
- Use streaming for large datasets

### Issue: Database connection errors
**Diagnosis**:
- Check connection pool size
- Monitor active connections

**Solution**:
- Increase pool size
- Close connections properly
- Implement connection retry logic

## Further Optimizations

For extreme scale (100k+ users):

1. **Database Sharding** - Distribute data across multiple databases
2. **Read Replicas** - Separate read/write databases
3. **Message Queue** - RabbitMQ/Redis for async processing
4. **CDN** - CloudFlare/CloudFront for static assets
5. **GraphQL** - More efficient data fetching
6. **ElasticSearch** - Fast full-text search

## Resources

- [TypeORM Performance Tips](https://typeorm.io/performance)
- [Redis Best Practices](https://redis.io/topics/optimization)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [NestJS Performance](https://docs.nestjs.com/techniques/performance)

## License

MIT
