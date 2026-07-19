import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrackPwywPricing1719000000006 implements MigrationInterface {
  name = 'TrackPwywPricing1719000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE tracks ADD COLUMN IF NOT EXISTS min_price DECIMAL(10, 2)`,
    );

    await queryRunner.query(`
      ALTER TABLE tracks DROP CONSTRAINT IF EXISTS tracks_pricing_type_check
    `);

    await queryRunner.query(`
      ALTER TABLE tracks ADD CONSTRAINT tracks_pricing_type_check
      CHECK (pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tracks DROP CONSTRAINT IF EXISTS tracks_pricing_type_check
    `);

    await queryRunner.query(`
      ALTER TABLE tracks ADD CONSTRAINT tracks_pricing_type_check
      CHECK (pricing_type IN ('SET_PRICE', 'FREE'))
    `);

    await queryRunner.query(`ALTER TABLE tracks DROP COLUMN IF EXISTS min_price`);
  }
}
