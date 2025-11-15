import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTrialActionTracking1700000000001 implements MigrationInterface {
  name = 'AddTrialActionTracking1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add premiumActionsTotal column to trials table
    await queryRunner.addColumn(
      'trials',
      new TableColumn({
        name: 'premiumActionsTotal',
        type: 'integer',
        default: 10,
      }),
    );

    // Add premiumActionsRemaining column to trials table
    await queryRunner.addColumn(
      'trials',
      new TableColumn({
        name: 'premiumActionsRemaining',
        type: 'integer',
        default: 10,
      }),
    );

    // Set initial values for existing trials
    await queryRunner.query(`
      UPDATE trials 
      SET "premiumActionsTotal" = 10, 
          "premiumActionsRemaining" = 10 
      WHERE "premiumActionsTotal" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove premiumActionsRemaining column
    await queryRunner.dropColumn('trials', 'premiumActionsRemaining');

    // Remove premiumActionsTotal column
    await queryRunner.dropColumn('trials', 'premiumActionsTotal');
  }
}
