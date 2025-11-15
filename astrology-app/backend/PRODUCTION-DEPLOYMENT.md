# Production Deployment Guide

## Prerequisites

- Ubuntu 20.04+ or similar Linux server
- Docker & Docker Compose installed
- Domain name configured (DNS A record pointing to server IP)
- SSL certificate (Let's Encrypt recommended)
- PostgreSQL 15+ database (RDS, managed, or self-hosted)
- Redis instance (ElastiCache, managed, or self-hosted)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/astrology-app.git
cd astrology-app/astrology-app/backend
```

### 2. Configure Environment

```bash
# Copy production environment template
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production
```

**IMPORTANT**: Update these critical values:
- `JWT_SECRET` - Generate a strong 32+ character secret
- `DB_*` - Your PostgreSQL connection details
- `REDIS_*` - Your Redis connection details
- `STRIPE_*` - Your LIVE Stripe API keys
- `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` - Production AI API keys
- `FRONTEND_URL`, `BACKEND_URL` - Your actual domain URLs
- `CORS_ORIGINS` - Whitelist only your production domains

### 3. Build Docker Image

```bash
# Build production image
docker build -t astrology-backend:latest .

# Verify build
docker images | grep astrology-backend
```

### 4. Run with Docker Compose

```bash
# Start application
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Check health
curl http://localhost:3000/api/v1/health
```

## SSL/HTTPS Setup

### Option 1: Nginx Reverse Proxy with Let's Encrypt

1. **Install Nginx and Certbot**:
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx
```

2. **Configure Nginx** (see `nginx.conf` in this directory):
```bash
sudo cp nginx.conf /etc/nginx/sites-available/astrology-backend
sudo ln -s /etc/nginx/sites-available/astrology-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Obtain SSL Certificate**:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

4. **Auto-renewal** (certbot creates a systemd timer automatically):
```bash
sudo systemctl status certbot.timer
```

### Option 2: Cloudflare Proxy

1. Add your domain to Cloudflare
2. Enable "Full (strict)" SSL/TLS encryption
3. Enable "Always Use HTTPS"
4. Use origin certificates for backend

## Database Migrations

```bash
# Run pending migrations
docker-compose exec backend npm run migration:run

# Verify database state
docker-compose exec backend npm run typeorm migration:show
```

## Environment Variables Checklist

Essential production variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | ✅ | Set to `production` |
| `PORT` | ✅ | Application port (default: 3000) |
| `DB_HOST` | ✅ | PostgreSQL host |
| `DB_PASSWORD` | ✅ | Strong database password |
| `REDIS_HOST` | ✅ | Redis cache host |
| `JWT_SECRET` | ✅ | Strong 32+ char secret |
| `STRIPE_SECRET_KEY` | ✅ | Live Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `FRONTEND_URL` | ✅ | Your frontend domain |
| `CORS_ORIGINS` | ✅ | Comma-separated allowed origins |

Optional but recommended:

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | Error tracking |
| `OPENAI_API_KEY` | AI assistant |
| `AWS_ACCESS_KEY_ID` | S3 file uploads |
| `SMTP_*` | Email notifications |

## Security Checklist

- [ ] Strong `JWT_SECRET` (32+ characters, random)
- [ ] Database uses SSL/TLS (`DB_SSL=true`)
- [ ] Redis uses TLS (`REDIS_TLS=true`)
- [ ] CORS restricted to production domains only
- [ ] Stripe LIVE keys (not test keys)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] Rate limiting enabled (default: 100 req/min)
- [ ] Helmet security headers enabled
- [ ] Non-root Docker user (already configured)
- [ ] Health check endpoint accessible

## Monitoring & Logging

### Application Logs

```bash
# View real-time logs
docker-compose logs -f backend

# Export logs
docker-compose logs backend > backend.log
```

### Health Endpoints

- **Liveness**: `GET /api/v1/health/live` - Is app running?
- **Readiness**: `GET /api/v1/health/ready` - Can app serve traffic?
- **Swagger Docs**: `https://api.yourdomain.com/api` (disabled in production by default)

### Metrics (Optional)

Configure Prometheus + Grafana:

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Access Grafana: `http://your-server:3001`

## Scaling

### Horizontal Scaling

Run multiple instances behind a load balancer:

```bash
# docker-compose.prod.yml
services:
  backend:
    image: astrology-backend:latest
    deploy:
      replicas: 3
```

### Database Optimization

- Enable read replicas for heavy read loads
- Configure connection pooling (default: 10 connections)
- Add database indexes (see performance optimization guide)

## Backup Strategy

### Database Backups

```bash
# Daily automated backups
0 2 * * * docker exec postgres pg_dump -U astrology_user astrology_production > /backups/db-$(date +\%Y\%m\%d).sql
```

### Application State

- Redis cache is ephemeral (no backup needed)
- S3 uploads are automatically backed up by AWS

## Troubleshooting

### App won't start

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep NODE_ENV

# Test database connection
docker-compose exec backend npm run typeorm migration:show
```

### High memory usage

- Check for memory leaks with `node --inspect`
- Increase Docker memory limit in `docker-compose.prod.yml`
- Enable Redis caching to reduce database queries

### Stripe webhooks failing

1. Verify `STRIPE_WEBHOOK_SECRET` matches dashboard
2. Check webhook endpoint: `https://api.yourdomain.com/api/v1/webhooks/stripe`
3. Ensure webhook is receiving events (Stripe Dashboard → Webhooks)

## Rollback Procedure

```bash
# Stop current version
docker-compose down

# Revert to previous image
docker tag astrology-backend:previous astrology-backend:latest

# Start
docker-compose up -d

# Verify
curl https://api.yourdomain.com/api/v1/health
```

## Performance Tuning

### Node.js Optimization

```bash
# Increase Node.js memory (if needed)
docker-compose exec backend node --max-old-space-size=2048 dist/main.js
```

### Database Connection Pool

Edit `.env.production`:
```env
DB_POOL_SIZE=20
DB_POOL_TIMEOUT=30000
```

### Redis Caching

Ensure Redis is enabled and accessible:
```env
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_TLS=true
```

## Support

- **Documentation**: [docs/README.md](../docs/README.md)
- **API Docs**: `https://api.yourdomain.com/api` (development only)
- **Issues**: Create issue on GitHub
- **Security**: security@yourdomain.com

## License

MIT
