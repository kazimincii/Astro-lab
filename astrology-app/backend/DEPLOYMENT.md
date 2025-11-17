# Production Deployment Guide

This document covers deploying the Astrology Super-App backend to production.

## Pre-Deployment Checklist

### Security

- [ ] Change all default secrets and passwords
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS/TLS for all connections
- [ ] Configure CORS to allow only trusted domains
- [ ] Set up rate limiting (already configured)
- [ ] Enable Stripe webhook signature verification
- [ ] Use environment variables for all secrets
- [ ] Review and update .gitignore to prevent secret leaks
- [ ] Enable database SSL connections
- [ ] Set up API key rotation policy

### Database

- [ ] Run all migrations
- [ ] Set up database backups (daily recommended)
- [ ] Configure connection pooling
- [ ] Disable synchronize in TypeORM (use migrations only)
- [ ] Set up read replicas (if needed)
- [ ] Configure database monitoring
- [ ] Set up point-in-time recovery
- [ ] Review and optimize indexes

### Environment

- [ ] Set NODE_ENV=production
- [ ] Configure production database credentials
- [ ] Set up production Redis instance
- [ ] Configure AWS S3 or alternative storage
- [ ] Set up production Stripe keys
- [ ] Configure OpenAI/Anthropic API keys
- [ ] Set up SMTP for production emails
- [ ] Configure frontend and admin URLs
- [ ] Set up SSL certificates

### Monitoring

- [ ] Set up application logging
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up alerts for critical errors
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor memory and CPU usage

### Performance

- [ ] Enable response compression
- [ ] Set up CDN for static assets
- [ ] Configure caching (Redis)
- [ ] Optimize database queries
- [ ] Set up load balancing (if needed)
- [ ] Enable HTTP/2
- [ ] Configure worker processes

## Environment Variables

### Required Production Variables

Create a `.env.production` file with these variables:

```env
# Application
NODE_ENV=production
PORT=3000
APP_NAME=Astrology Super App

## Anthropic — Enabling Claude Haiku 4.5 (Admin Steps)

If you want the backend to use Claude Haiku 4.5 (Claude Haiku) for all clients, follow these steps.

1. Anthropic account access
   - Log in to https://console.anthropic.com/ with an account that has admin or billing access.
   - Verify your organization/project has API access and a valid billing method.

2. Request or enable model access
   - Some newer models (like Haiku 4.5) may require explicit access approval. In the Anthropic Console:
     - Open the API keys / Models section and check if `claude-haiku-4.5` appears in the available models list.
     - If not visible, open a support request via the Anthropic console or contact Anthropic sales/support to request access to `claude-haiku-4.5` for your org.

3. Create an API key
   - In Anthropic Console > API Keys, create a production API key and copy it securely. This will be used as `ANTHROPIC_API_KEY`.

4. Configure environment variables (production)
   - Add the following variables to your production environment (or `.env.production`):

```
ANTHROPIC_API_KEY=sk-ant-your-production-anthropic-key
ANTHROPIC_MODEL=claude-haiku-4.5
AI_PROVIDER=anthropic
```

5. Add secrets to GitHub (recommended for CI/CD)
   - In your GitHub repository, go to Settings > Secrets and variables > Actions > New repository secret.
   - Add at least these secrets:
     - `ANTHROPIC_API_KEY` — your Anthropic API key (keep this secret)
     - `ANTHROPIC_MODEL` — `claude-haiku-4.5` (optional; you can set this directly in workflow env)
     - `AI_PROVIDER` — `anthropic` (optional)

6. Rollout strategy
   - Start in staging: configure staging environment with `ANTHROPIC_MODEL=claude-haiku-4.5` and validate key flows.
   - Monitor error tracking and usage quotas (Anthropic dashboard) to avoid unexpected billing.

7. Fallback & rollback
   - If you need to rollback, change `ANTHROPIC_MODEL` to a previously working model (e.g., `claude-3-opus-20240229`) or set `AI_PROVIDER=openai`.

8. Quota & Cost controls
   - Consider setting token limits and usage alerts in Anthropic Console. Update `ANTHROPIC_MAX_TOKENS` in env to limit individual requests if needed.

If you want, I can create a short PR that adds these instructions to the repo and wire up a deploy workflow to use the new secrets.
# Database
DB_HOST=your-production-db.region.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=astrology_prod_user
DB_PASSWORD=<strong-secure-password>
DB_DATABASE=astrology_production
DB_SSL=true

# Redis
REDIS_HOST=your-redis.region.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
REDIS_TLS=true

# JWT
JWT_SECRET=<generate-strong-32-char-secret>
JWT_EXPIRATION=7d
REFRESH_TOKEN_EXPIRATION=30d

# AI Services
OPENAI_API_KEY=sk-proj-your-production-openai-key
ANTHROPIC_API_KEY=sk-ant-your-production-anthropic-key

# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Stripe Products
STRIPE_STANDARD_PRODUCT_ID=prod_your_standard_id
STRIPE_PREMIUM_PRODUCT_ID=prod_your_premium_id

# Stripe Prices
STRIPE_STANDARD_MONTHLY_PRICE_ID=price_your_standard_monthly
STRIPE_STANDARD_YEARLY_PRICE_ID=price_your_standard_yearly
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_your_premium_monthly
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_your_premium_yearly

# AWS S3
AWS_ACCESS_KEY_ID=your-production-access-key
AWS_SECRET_ACCESS_KEY=your-production-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=astrology-production-uploads

# App URLs
FRONTEND_URL=https://app.yourdomain.com
ADMIN_URL=https://admin.yourdomain.com
API_URL=https://api.yourdomain.com

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com

# Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

## Database Migrations

### Running Migrations

1. **Generate migration from entity changes:**
```bash
npm run migration:generate -- src/migrations/YourMigrationName
```

2. **Run pending migrations:**
```bash
npm run migration:run
```

3. **Revert last migration (if needed):**
```bash
npm run migration:revert
```

### Production Migration Strategy

```bash
# Before deployment
1. Backup database
2. Test migrations on staging
3. Run migrations during maintenance window
4. Verify migration success
5. Deploy new application version
6. Run smoke tests
```

## Deployment Options

### Option 1: AWS Elastic Beanstalk

#### Setup

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize EB:
```bash
eb init astrology-backend --platform node.js --region us-east-1
```

3. Create environment:
```bash
eb create production --database.engine postgres
```

4. Configure environment variables:
```bash
eb setenv NODE_ENV=production DB_HOST=... (all production vars)
```

5. Deploy:
```bash
npm run build
eb deploy
```

#### Elastic Beanstalk Configuration

Create `.ebextensions/01-app.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    NPM_CONFIG_PRODUCTION: false
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node dist/main"
    NodeVersion: 18.x
  aws:elasticbeanstalk:environment:proxy:
    ProxyServer: nginx
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /public: public

files:
  "/opt/elasticbeanstalk/tasks/taillogs.d/app.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      /var/log/nodejs/nodejs.log
```

### Option 2: Docker + AWS ECS

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

#### Docker Compose (for local testing)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: astrology_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Build and Push to ECR

```bash
# Build image
docker build -t astrology-backend .

# Tag for ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
docker tag astrology-backend:latest YOUR_ECR_URL/astrology-backend:latest

# Push to ECR
docker push YOUR_ECR_URL/astrology-backend:latest
```

### Option 3: Heroku

1. Install Heroku CLI
2. Create Heroku app:
```bash
heroku create astrology-backend
```

3. Add PostgreSQL:
```bash
heroku addons:create heroku-postgresql:standard-0
```

4. Add Redis:
```bash
heroku addons:create heroku-redis:premium-0
```

5. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# ... all other vars
```

6. Create `Procfile`:
```
web: npm run start:prod
release: npm run migration:run
```

7. Deploy:
```bash
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build command: `npm run build`
3. Configure run command: `node dist/main`
4. Add PostgreSQL database
5. Add Redis database
6. Configure environment variables
7. Deploy

## Health Checks

Add health check endpoint to `src/health/health.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  @Get()
  async check() {
    try {
      await this.connection.query('SELECT 1');
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
```

## Logging

### Configure Winston Logger

Install Winston:
```bash
npm install winston nest-winston
```

Create `src/config/logger.config.ts`:

```typescript
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

## Monitoring

### Error Tracking with Sentry

1. Install Sentry:
```bash
npm install @sentry/node @sentry/profiling-node
```

2. Configure in `main.ts`:
```typescript
import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    tracesSampleRate: 0.1,
  });
}
```

### Performance Monitoring

Consider using:
- **New Relic** - Application performance monitoring
- **DataDog** - Infrastructure and application monitoring
- **Prometheus + Grafana** - Custom metrics and dashboards

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Generate certificate:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

3. Auto-renewal (cron):
```bash
0 0 * * * certbot renew --quiet
```

### Nginx Configuration

Create `/etc/nginx/sites-available/astrology-api`:

```nginx
upstream api {
    server localhost:3000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 10M;
}
```

## Backup Strategy

### Database Backups

#### Automated PostgreSQL Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="astrology_production"

pg_dump -U postgres -h localhost $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-backup-bucket/database/
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Zero-Downtime Deployment

### Blue-Green Deployment

1. Deploy new version (green)
2. Run health checks on green
3. Switch load balancer to green
4. Keep blue running for rollback
5. After verification, terminate blue

### Rolling Deployment

1. Deploy to one instance
2. Wait for health checks
3. Deploy to next instance
4. Repeat until all instances updated

## Rollback Strategy

### Quick Rollback Steps

1. **Application Rollback:**
```bash
# Elastic Beanstalk
eb deploy --version previous-version

# Docker
docker service update --rollback service-name

# Heroku
heroku releases:rollback
```

2. **Database Rollback:**
```bash
npm run migration:revert
```

3. **Verify rollback:**
- Check health endpoints
- Monitor error rates
- Test critical flows

## Post-Deployment

### Smoke Tests

```bash
# Health check
curl https://api.yourdomain.com/api/v1/health

# Authentication
curl -X POST https://api.yourdomain.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Stripe webhook (test event)
stripe trigger checkout.session.completed
```

### Monitoring Checklist

- [ ] Verify all services are running
- [ ] Check error rates in monitoring dashboard
- [ ] Verify database connections
- [ ] Test API endpoints
- [ ] Verify Stripe webhooks
- [ ] Check scheduled jobs (forecasts, etc.)
- [ ] Monitor memory and CPU usage
- [ ] Verify SSL certificates
- [ ] Test mobile app integration

## Troubleshooting

### Common Issues

**Database Connection Errors:**
- Check database credentials
- Verify security group/firewall rules
- Check SSL configuration
- Verify connection pool settings

**High Memory Usage:**
- Check for memory leaks
- Review connection pool size
- Monitor long-running queries
- Restart application if needed

**Slow API Responses:**
- Check database query performance
- Review Redis cache hit rate
- Monitor external API calls (OpenAI, Stripe)
- Check network latency

**Webhook Failures:**
- Verify webhook signature
- Check endpoint accessibility
- Review Stripe dashboard for errors
- Ensure raw body parsing is enabled

## Support

For deployment issues:
- Check application logs
- Review monitoring dashboards
- Consult cloud provider documentation
- Contact support if needed
