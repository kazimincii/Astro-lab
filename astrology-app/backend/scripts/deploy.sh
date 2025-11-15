#!/bin/bash

# Production Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
SKIP_TESTS=${SKIP_TESTS:-false}
SKIP_BUILD=${SKIP_BUILD:-false}
SKIP_MIGRATIONS=${SKIP_MIGRATIONS:-false}

echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env.$ENVIRONMENT" ]; then
    echo -e "${RED}❌ .env.$ENVIRONMENT file not found!${NC}"
    echo "Please create .env.$ENVIRONMENT from .env.production.example"
    exit 1
fi

# Load environment variables
export $(cat .env.$ENVIRONMENT | xargs)

echo "📋 Pre-deployment checklist..."

# 1. Run tests (unless skipped)
if [ "$SKIP_TESTS" != "true" ]; then
    echo "🧪 Running tests..."
    npm test
    echo -e "${GREEN}✅ Tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping tests${NC}"
fi

# 2. Build application (unless skipped)
if [ "$SKIP_BUILD" != "true" ]; then
    echo "🔨 Building application..."
    npm run build
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping build${NC}"
fi

# 3. Backup database
echo "💾 Creating database backup..."
BACKUP_FILE="backups/backup_$(date +%Y%m%d_%H%M%S).sql"
mkdir -p backups

if command -v pg_dump &> /dev/null; then
    pg_dump -h $DB_HOST -U $DB_USERNAME -d $DB_DATABASE > $BACKUP_FILE
    echo -e "${GREEN}✅ Database backup created: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  pg_dump not found, skipping database backup${NC}"
fi

# 4. Run migrations (unless skipped)
if [ "$SKIP_MIGRATIONS" != "true" ]; then
    echo "📦 Running database migrations..."
    npm run migration:run
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping migrations${NC}"
fi

# 5. Health check before deployment
echo "🏥 Checking current application health..."
if curl -f http://localhost:$PORT/api/v1/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Application is not responding (might be first deployment)${NC}"
fi

# 6. Deploy based on platform
echo "🚢 Deploying to $ENVIRONMENT..."

# AWS Elastic Beanstalk
if command -v eb &> /dev/null && [ -f ".elasticbeanstalk/config.yml" ]; then
    echo "Deploying to Elastic Beanstalk..."
    eb deploy $ENVIRONMENT
    echo -e "${GREEN}✅ Deployed to Elastic Beanstalk${NC}"

# Heroku
elif command -v heroku &> /dev/null && git remote | grep -q heroku; then
    echo "Deploying to Heroku..."
    git push heroku main
    echo -e "${GREEN}✅ Deployed to Heroku${NC}"

# Docker
elif [ -f "docker-compose.yml" ]; then
    echo "Deploying with Docker..."
    docker-compose down
    docker-compose build
    docker-compose up -d
    echo -e "${GREEN}✅ Deployed with Docker${NC}"

else
    echo -e "${YELLOW}⚠️  No deployment platform detected${NC}"
    echo "Please deploy manually or configure your deployment platform"
fi

# 7. Post-deployment health check
echo "🏥 Running post-deployment health checks..."
sleep 10  # Wait for app to start

MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:$PORT/api/v1/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is healthy after deployment${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT+1))
        echo "Retry $RETRY_COUNT/$MAX_RETRIES..."
        sleep 5
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Health check failed after deployment${NC}"
    echo "Please check application logs"
    exit 1
fi

# 8. Run smoke tests
echo "🧪 Running smoke tests..."
./scripts/smoke-test.sh || echo -e "${YELLOW}⚠️  Smoke tests failed or not found${NC}"

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Monitor application logs"
echo "2. Check error tracking dashboard"
echo "3. Verify critical endpoints"
echo "4. Monitor performance metrics"
