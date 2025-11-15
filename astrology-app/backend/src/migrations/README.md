# Database Migrations

This directory contains TypeORM database migrations for schema changes.

## Available Migrations

### 1. AddTrialActionTracking (1700000000001)
**Created**: Initial trial action tracking
**Changes**:
- Adds `premiumActionsTotal` column to trials table
- Adds `premiumActionsRemaining` column to trials table
- Sets default values for existing trials (10 actions)

### 2. UpdateSubscriptionSchema (1700000000002)
**Created**: Subscription schema updates for consistency
**Changes**:
- Adds `userId` column for direct user reference
- Adds `planType` column (synced with plan)
- Adds `billingPeriod` enum column (monthly/yearly)

## Running Migrations

### Development

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Generate a new migration (based on entity changes)
npm run migration:generate -- src/migrations/YourMigrationName
```

### Production

```bash
# Build the project first
npm run build

# Run migrations
npm run migration:run

# Check migration status
npm run typeorm -- migration:show
```

## Creating New Migrations

### Method 1: Auto-generate from entity changes

```bash
npm run migration:generate -- src/migrations/DescriptiveName
```

This will compare your entities with the database schema and generate a migration.

### Method 2: Create empty migration manually

```bash
npm run typeorm -- migration:create src/migrations/DescriptiveName
```

Then implement the `up()` and `down()` methods manually.

## Migration Best Practices

1. **Always test migrations locally first**
   - Run migration up
   - Test application
   - Run migration down
   - Run migration up again

2. **Make migrations reversible**
   - Always implement both `up()` and `down()` methods
   - Test the down migration works correctly

3. **Handle data carefully**
   - For destructive changes, back up data first
   - Use transactions when modifying data
   - Consider data migration separately from schema changes

4. **Naming conventions**
   - Use descriptive names: `AddUserEmailIndex`, `CreateNotificationsTable`
   - Include what changed: `Add`, `Remove`, `Update`, `Create`, `Drop`

5. **Production deployments**
   - Run migrations before deploying new code
   - Have a rollback plan
   - Monitor migration execution time
   - For large tables, consider zero-downtime migrations

## Migration Order

Migrations run in chronological order based on their timestamp prefix:
- 1700000000001 - Trial action tracking
- 1700000000002 - Subscription schema updates

## Troubleshooting

### Migration fails midway
```bash
# Check which migrations have run
npm run typeorm -- migration:show

# Manually fix the database
# Then update the migrations table if needed
```

### Migration already run but not in migrations table
```bash
# Manually insert into migrations table
# INSERT INTO migrations (timestamp, name) VALUES (1700000000001, 'AddTrialActionTracking1700000000001');
```

### Need to skip a migration
```bash
# Manually add to migrations table without running
# Only do this if you're sure the changes are already applied
```

## Schema Synchronization (Development Only)

TypeORM can auto-sync schema in development:

```typescript
// In TypeORM config
{
  synchronize: process.env.NODE_ENV === 'development', // NEVER in production!
}
```

⚠️ **WARNING**: Never use `synchronize: true` in production! Always use migrations.

## Resources

- [TypeORM Migrations Documentation](https://typeorm.io/migrations)
- [Migration API](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)
