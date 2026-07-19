import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlatformThemePreset1719000000011 implements MigrationInterface {
  name = 'PlatformThemePreset1719000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE platform_settings
        ADD COLUMN theme_preset_id VARCHAR(50) NOT NULL DEFAULT 'spotify'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE platform_settings DROP COLUMN theme_preset_id
    `);
  }
}
