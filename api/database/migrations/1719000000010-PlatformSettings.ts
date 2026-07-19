import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlatformSettings1719000000010 implements MigrationInterface {
  name = 'PlatformSettings1719000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE platform_settings (
        id INT PRIMARY KEY DEFAULT 1,
        theme JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT platform_settings_singleton CHECK (id = 1)
      )
    `);

    await queryRunner.query(`
      INSERT INTO platform_settings (id, theme) VALUES (1, '{}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE platform_settings`);
  }
}
