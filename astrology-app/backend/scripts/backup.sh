#!/bin/bash

# Database Backup Script
# Run this script daily via cron: 0 2 * * * /path/to/backup.sh

set -e

# Configuration
BACKUP_DIR=${BACKUP_DIR:-"./backups"}
RETENTION_DAYS=${RETENTION_DAYS:-30}
S3_BUCKET=${S3_BACKUP_BUCKET:-""}

# Load environment variables if .env exists
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "💾 Starting database backup..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
BACKUP_FILE_GZ="$BACKUP_FILE.gz"

# Perform backup
echo "Backing up database: $DB_DATABASE"

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD not set"
    exit 1
fi

PGPASSWORD=$DB_PASSWORD pg_dump \
    -h $DB_HOST \
    -p ${DB_PORT:-5432} \
    -U $DB_USERNAME \
    -d $DB_DATABASE \
    --no-owner \
    --no-acl \
    -F p \
    > "$BACKUP_FILE"

# Compress backup
echo "Compressing backup..."
gzip "$BACKUP_FILE"

BACKUP_SIZE=$(du -h "$BACKUP_FILE_GZ" | cut -f1)
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE_GZ ($BACKUP_SIZE)${NC}"

# Upload to S3 (if configured)
if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
    echo "Uploading to S3: s3://$S3_BUCKET/database/"
    aws s3 cp "$BACKUP_FILE_GZ" "s3://$S3_BUCKET/database/"
    echo -e "${GREEN}✅ Backup uploaded to S3${NC}"
fi

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

REMAINING_BACKUPS=$(ls -1 "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Backup completed. $REMAINING_BACKUPS backups remaining.${NC}"

# Verify backup integrity
echo "Verifying backup integrity..."
if gzip -t "$BACKUP_FILE_GZ" 2>/dev/null; then
    echo -e "${GREEN}✅ Backup integrity verified${NC}"
else
    echo -e "${YELLOW}⚠️  Backup integrity check failed${NC}"
    exit 1
fi

echo "✅ Backup process completed successfully!"
