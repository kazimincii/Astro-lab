import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1700000000003 implements MigrationInterface {
  name = 'AddPerformanceIndexes1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_created_at" ON "users" ("createdAt");
    `);

    // Person Profiles indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_person_profiles_owner_id" ON "person_profiles" ("ownerId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_person_profiles_is_main" ON "person_profiles" ("isMainProfile");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_person_profiles_owner_main" ON "person_profiles" ("ownerId", "isMainProfile");
    `);

    // Subscriptions indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_user_id" ON "subscriptions" ("userId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_status" ON "subscriptions" ("status");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_user_status" ON "subscriptions" ("userId", "status");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_stripe_sub_id" ON "subscriptions" ("stripeSubscriptionId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_stripe_customer" ON "subscriptions" ("stripeCustomerId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_subscriptions_end_date" ON "subscriptions" ("endDate");
    `);

    // Action Logs indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_action_logs_user_id" ON "action_logs" ("userId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_action_logs_type" ON "action_logs" ("actionType");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_action_logs_created_at" ON "action_logs" ("createdAt");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_action_logs_user_date" ON "action_logs" ("userId", "createdAt");
    `);

    // Trials indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_trials_user_id" ON "trials" ("userId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_trials_status" ON "trials" ("status");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_trials_end_date" ON "trials" ("endDate");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_trials_user_status" ON "trials" ("userId", "status");
    `);

    // Daily Forecasts indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_daily_forecasts_profile_id" ON "daily_forecasts" ("profileId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_daily_forecasts_date" ON "daily_forecasts" ("date");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_daily_forecasts_profile_date" ON "daily_forecasts" ("profileId", "date");
    `);

    // Birth Charts indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_birth_charts_profile_id" ON "birth_charts" ("profileId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_birth_charts_person_id" ON "birth_charts" ("personId");
    `);

    // Tarot Readings indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_tarot_readings_user_id" ON "tarot_readings" ("userId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_tarot_readings_created_at" ON "tarot_readings" ("createdAt");
    `);

    // Numerology Reports indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_numerology_reports_user_id" ON "numerology_reports" ("userId");
    `);

    // Relationship Profiles indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_relationship_profiles_user_id" ON "relationship_profiles" ("userId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_relationship_profiles_person1" ON "relationship_profiles" ("person1Id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_relationship_profiles_person2" ON "relationship_profiles" ("person2Id");
    `);

    // Composite index for common queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_relationship_profiles_user_persons"
      ON "relationship_profiles" ("userId", "person1Id", "person2Id");
    `);

    // Star Messages indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_star_messages_person_id" ON "star_messages" ("personId");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_star_messages_date" ON "star_messages" ("date");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_star_messages_person_date" ON "star_messages" ("personId", "date");
    `);

    // Astro Events indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_astro_events_start_date" ON "astro_events" ("startDate");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_astro_events_is_active" ON "astro_events" ("isActive");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_astro_events_type" ON "astro_events" ("type");
    `);

    // Calendar Entries indexes
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_calendar_entries_date" ON "calendar_entries" ("date");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_calendar_entries_category" ON "calendar_entries" ("category");
    `);

    console.log('✅ Performance indexes created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes (reverse order)
    const indexes = [
      'IDX_calendar_entries_category',
      'IDX_calendar_entries_date',
      'IDX_astro_events_type',
      'IDX_astro_events_is_active',
      'IDX_astro_events_start_date',
      'IDX_star_messages_person_date',
      'IDX_star_messages_date',
      'IDX_star_messages_person_id',
      'IDX_relationship_profiles_user_persons',
      'IDX_relationship_profiles_person2',
      'IDX_relationship_profiles_person1',
      'IDX_relationship_profiles_user_id',
      'IDX_numerology_reports_user_id',
      'IDX_tarot_readings_created_at',
      'IDX_tarot_readings_user_id',
      'IDX_birth_charts_person_id',
      'IDX_birth_charts_profile_id',
      'IDX_daily_forecasts_profile_date',
      'IDX_daily_forecasts_date',
      'IDX_daily_forecasts_profile_id',
      'IDX_trials_user_status',
      'IDX_trials_end_date',
      'IDX_trials_status',
      'IDX_trials_user_id',
      'IDX_action_logs_user_date',
      'IDX_action_logs_created_at',
      'IDX_action_logs_type',
      'IDX_action_logs_user_id',
      'IDX_subscriptions_end_date',
      'IDX_subscriptions_stripe_customer',
      'IDX_subscriptions_stripe_sub_id',
      'IDX_subscriptions_user_status',
      'IDX_subscriptions_status',
      'IDX_subscriptions_user_id',
      'IDX_person_profiles_owner_main',
      'IDX_person_profiles_is_main',
      'IDX_person_profiles_owner_id',
      'IDX_users_created_at',
      'IDX_users_email',
    ];

    for (const index of indexes) {
      await queryRunner.query(`DROP INDEX IF EXISTS "${index}";`);
    }

    console.log('✅ Performance indexes dropped successfully');
  }
}
