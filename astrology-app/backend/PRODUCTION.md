# Production Deployment Guide

Bu dokümantasyon Astrology Backend API'yi production ortamına deploy etmek için gerekli adımları içerir.

## Ön Gereksinimler

### Gerekli Servisler

- **PostgreSQL 15+**: Ana veritabanı
- **Redis 7+**: Caching ve session yönetimi
- **Node.js 18+**: Runtime
- **PM2 veya Docker**: Process management

### Gerekli API Keys

- OpenAI API Key (AI features)
- Anthropic API Key (Claude AI)
- Stripe Secret Key (Payments)
- AWS Credentials (S3 storage)

## Environment Variables

Production `.env` dosyası örneği:

```env
# Environment
NODE_ENV=production
PORT=3000

# Database
DB_HOST=your-db-host.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_DATABASE=astrology_production
DB_SSL=true

# JWT
JWT_SECRET=your-very-secure-jwt-secret-min-32-characters
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=your-redis-host.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TLS=true

# AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=astrology-production
AWS_REGION=us-east-1

# CORS
CORS_ORIGIN=https://your-app.com,https://www.your-app.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info
```

## Database Setup

### 1. Create Production Database

```sql
CREATE DATABASE astrology_production;
CREATE USER astrology_user WITH ENCRYPTED PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE astrology_production TO astrology_user;
```

### 2. Run Migrations

```bash
npm run migration:run
```

### 3. Seed Initial Data (Optional)

```bash
npm run seed:prod
```

## Build & Deploy

### Option 1: PM2 (Node.js Process Manager)

#### Install PM2

```bash
npm install -g pm2
```

#### Build Application

```bash
npm run build
```

#### Start with PM2

```bash
pm2 start dist/main.js --name astrology-api -i max
pm2 save
pm2 startup
```

#### PM2 Commands

```bash
# View logs
pm2 logs astrology-api

# Monitor
pm2 monit

# Restart
pm2 restart astrology-api

# Stop
pm2 stop astrology-api

# View status
pm2 status
```

### Option 2: Docker

#### Build Image

```bash
docker build -t astrology-backend:latest .
```

#### Run Container

```bash
docker run -d \
  --name astrology-api \
  -p 3000:3000 \
  --env-file .env.production \
  --restart unless-stopped \
  astrology-backend:latest
```

#### Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: astrology_production
      POSTGRES_USER: astrology_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

## Security Checklist

- [ ] Environment variables are set securely
- [ ] Database uses SSL/TLS
- [ ] Redis requires authentication
- [ ] JWT secrets are strong (min 32 characters)
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled
- [ ] HTTPS/TLS is configured
- [ ] Security headers are set
- [ ] Input validation is enabled
- [ ] SQL injection prevention (using TypeORM)
- [ ] XSS protection enabled
- [ ] CSRF protection for state-changing operations

## Monitoring & Logging

### Application Logs

Logs are structured JSON for easy parsing:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Request completed",
  "context": "HTTP",
  "method": "GET",
  "url": "/api/v1/profiles",
  "statusCode": 200,
  "duration": "45ms"
}
```

### Health Checks

- **Liveness**: `GET /health/live` - Basic service availability
- **Readiness**: `GET /health/ready` - Service ready to accept traffic
- **Detailed**: `GET /health` - Full health check with dependencies

### Metrics to Monitor

- **Response Times**: P50, P95, P99
- **Error Rates**: 4xx, 5xx responses
- **Database Connections**: Active, idle
- **Memory Usage**: Heap, RSS
- **CPU Usage**: Process, system
- **Request Rate**: Requests per second
- **Cache Hit Rate**: Redis hit/miss ratio

### Recommended Tools

- **APM**: New Relic, Datadog, or Sentry
- **Logging**: ELK Stack, CloudWatch, or Papertrail
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Error Tracking**: Sentry

## Backup Strategy

### Database Backups

```bash
# Daily automated backup
pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE > backup_$(date +%Y%m%d).sql

# Restore
psql -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE < backup_20240115.sql
```

### Redis Backups

Redis AOF (Append Only File) or RDB snapshots based on configuration.

## Performance Optimization

### 1. Enable Compression

```typescript
// main.ts
app.use(compression());
```

### 2. Database Connection Pooling

Already configured in TypeORM with:
- Min connections: 5
- Max connections: 20

### 3. Redis Caching

Cache frequently accessed data:
- User profiles
- Birth charts
- Horoscopes (daily)
- Configuration

### 4. CDN for Static Assets

Use CloudFront or similar for:
- Profile images
- Chart images
- Static content

## Scaling

### Horizontal Scaling

Run multiple instances behind a load balancer:

```bash
pm2 start dist/main.js -i max  # Uses all CPU cores
```

### Database Scaling

- **Read Replicas**: For heavy read workloads
- **Connection Pooling**: PgBouncer
- **Partitioning**: For large tables (action_logs, etc.)

### Caching Strategy

- **L1 Cache**: In-memory (Redis)
- **L2 Cache**: CDN for static content
- **Cache Invalidation**: On data updates

## Troubleshooting

### High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart astrology-api
```

### Database Connection Issues

```bash
# Check connection pool
psql -h $DB_HOST -U $DB_USERNAME -c "SELECT count(*) FROM pg_stat_activity;"
```

### High Response Times

1. Check database query performance
2. Review slow query logs
3. Check Redis connectivity
4. Review external API calls

## Rollback Procedure

### 1. Stop New Version

```bash
pm2 stop astrology-api
```

### 2. Revert Code

```bash
git checkout previous-stable-tag
npm ci
npm run build
```

### 3. Rollback Database (if needed)

```bash
npm run migration:revert
```

### 4. Start Previous Version

```bash
pm2 restart astrology-api
```

## Support & Maintenance

### Regular Tasks

- **Daily**: Check error logs
- **Weekly**: Review performance metrics
- **Monthly**: Database maintenance, backup verification
- **Quarterly**: Security audit, dependency updates

### Emergency Contacts

- **DevOps**: [contact]
- **Database Admin**: [contact]
- **On-call**: [rotation]

## Useful Commands

```bash
# View application logs
pm2 logs astrology-api --lines 100

# Check application status
pm2 status

# Monitor resources
pm2 monit

# Restart gracefully
pm2 reload astrology-api

# Database migration status
npm run migration:show

# Run specific migration
npm run migration:run -- --transaction=all

# Check TypeScript compilation
npm run build
```

## Additional Resources

- [NestJS Production Best Practices](https://docs.nestjs.com/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/)
- [Security Best Practices](https://cheatsheetseries.owasp.org/)
