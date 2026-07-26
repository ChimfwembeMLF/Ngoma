import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdSupportedDownloads1719000000015 implements MigrationInterface {
  name = 'AdSupportedDownloads1719000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE platform_settings
      ADD COLUMN IF NOT EXISTS ads_config JSONB DEFAULT '{"adsEnabled":true,"gateSeconds":5}'::jsonb
    `);

    await queryRunner.query(`
      CREATE TABLE ad_creatives (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(200) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        click_url VARCHAR(500),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE ad_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        creative_id UUID REFERENCES ad_creatives(id) ON DELETE SET NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
        expires_at TIMESTAMPTZ NOT NULL,
        completed_at TIMESTAMPTZ,
        consumed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_ad_sessions_user_track_status ON ad_sessions(user_id, track_id, status)
    `);
    await queryRunner.query(`
      CREATE INDEX idx_ad_sessions_expires_at ON ad_sessions(expires_at)
    `);

    await queryRunner.query(`
      CREATE TABLE ad_impressions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_id UUID NOT NULL UNIQUE REFERENCES ad_sessions(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        creative_id UUID REFERENCES ad_creatives(id) ON DELETE SET NULL,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE INDEX idx_ad_impressions_completed_at ON ad_impressions(completed_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS ad_impressions`);
    await queryRunner.query(`DROP TABLE IF EXISTS ad_sessions`);
    await queryRunner.query(`DROP TABLE IF EXISTS ad_creatives`);
    await queryRunner.query(`ALTER TABLE platform_settings DROP COLUMN IF EXISTS ads_config`);
  }
}
