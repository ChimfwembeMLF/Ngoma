import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlatformBranding1719000000012 implements MigrationInterface {
  name = 'PlatformBranding1719000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE platform_settings
        ADD COLUMN branding JSONB NOT NULL DEFAULT '{}',
        ADD COLUMN saved_branding_templates JSONB NOT NULL DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE platform_settings
        DROP COLUMN saved_branding_templates,
        DROP COLUMN branding
    `);
  }
}
