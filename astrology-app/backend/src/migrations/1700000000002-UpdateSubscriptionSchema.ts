import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateSubscriptionSchema1700000000002 implements MigrationInterface {
  name = 'UpdateSubscriptionSchema1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if userId column exists, if not add it
    const table = await queryRunner.getTable('subscriptions');
    const userIdColumn = table?.findColumnByName('userId');
    
    if (!userIdColumn) {
      await queryRunner.addColumn(
        'subscriptions',
        new TableColumn({
          name: 'userId',
          type: 'varchar',
          isNullable: true, // Temporarily nullable for migration
        }),
      );

      // Populate userId from user relation
      await queryRunner.query(`
        UPDATE subscriptions 
        SET "userId" = u.id 
        FROM users u 
        WHERE subscriptions."userIdUserId" = u.id;
      `);

      // Make it non-nullable after populating
      await queryRunner.changeColumn(
        'subscriptions',
        'userId',
        new TableColumn({
          name: 'userId',
          type: 'varchar',
          isNullable: false,
        }),
      );
    }

    // Check if planType column exists, if not add it
    const planTypeColumn = table?.findColumnByName('planType');
    
    if (!planTypeColumn) {
      await queryRunner.addColumn(
        'subscriptions',
        new TableColumn({
          name: 'planType',
          type: 'enum',
          enum: ['basic', 'standard', 'premium'],
          default: "'basic'",
        }),
      );

      // Sync planType with plan column
      await queryRunner.query(`
        UPDATE subscriptions 
        SET "planType" = plan;
      `);
    }

    // Ensure billingPeriod column exists (replacing old billingCycle if needed)
    const billingPeriodColumn = table?.findColumnByName('billingPeriod');
    
    if (!billingPeriodColumn) {
      await queryRunner.addColumn(
        'subscriptions',
        new TableColumn({
          name: 'billingPeriod',
          type: 'enum',
          enum: ['monthly', 'yearly'],
          default: "'monthly'",
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove added columns
    await queryRunner.dropColumn('subscriptions', 'billingPeriod');
    await queryRunner.dropColumn('subscriptions', 'planType');
    await queryRunner.dropColumn('subscriptions', 'userId');
  }
}
