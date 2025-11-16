# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis (optional)
- Docker (recommended)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

2. Configure environment variables:
- Database credentials
- JWT secrets
- Stripe keys
- OpenAI API key
- Mail SMTP settings

## Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Manual Deployment

### Backend

```bash
cd backend

# Install dependencies
npm ci

# Run migrations
npm run migration:run

# Build
npm run build

# Start production server
npm run start:prod
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Production Checklist

- [ ] Configure production database
- [ ] Set strong JWT secrets
- [ ] Configure SMTP for emails
- [ ] Set up Stripe webhooks
- [ ] Configure CORS origins
- [ ] Set up monitoring (Sentry)
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategy
- [ ] Configure CDN for assets
- [ ] Set up CI/CD pipeline

## Monitoring

Recommended tools:
- **Sentry** - Error tracking
- **PM2** - Process management
- **Nginx** - Reverse proxy
- **Let's Encrypt** - SSL certificates

## Scaling

For high traffic:
- Use Redis for caching
- Enable database connection pooling
- Implement rate limiting
- Use CDN for static assets
- Consider microservices architecture
