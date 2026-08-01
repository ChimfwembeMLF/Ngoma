import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMarketingIntegrationTables1722470000000 implements MigrationInterface {
  name = 'CreateMarketingIntegrationTables1722470000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tekrem_account_links (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        tekrem_sub VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        mako_workspace_id VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE mako_promotion_campaigns (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        release_id UUID NOT NULL,
        mako_campaign_id VARCHAR(255) UNIQUE,
        release_title VARCHAR(255) NOT NULL,
        artwork_url TEXT NOT NULL,
        target_genre VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'ENDED')),
        total_spend DECIMAL(10,2) DEFAULT '0.00',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE smart_link_attributions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug VARCHAR(100) NOT NULL,
        campaign_id UUID NOT NULL REFERENCES mako_promotion_campaigns(id) ON DELETE CASCADE,
        release_id UUID NOT NULL,
        referral_channel VARCHAR(50),
        visitor_token VARCHAR(255) NOT NULL,
        converted BOOLEAN DEFAULT FALSE,
        conversion_amount DECIMAL(10,2),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE fan_segments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        fan_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        contact_email VARCHAR(255),
        phone_contact VARCHAR(50),
        preferred_genre VARCHAR(100) NOT NULL,
        total_spent DECIMAL(10,2) DEFAULT '0.00',
        interactions_count INT DEFAULT 0,
        supporter_tier VARCHAR(20) DEFAULT 'CASUAL' CHECK (supporter_tier IN ('CASUAL', 'FAN', 'VIP')),
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_tekrem_links_sub ON tekrem_account_links(tekrem_sub)`);
    await queryRunner.query(`CREATE INDEX idx_mako_campaigns_artist ON mako_promotion_campaigns(artist_id)`);
    await queryRunner.query(`CREATE INDEX idx_smart_links_slug ON smart_link_attributions(slug)`);
    await queryRunner.query(`CREATE INDEX idx_smart_links_token ON smart_link_attributions(visitor_token)`);
    await queryRunner.query(`CREATE INDEX idx_fan_segments_artist ON fan_segments(artist_id)`);
    await queryRunner.query(`CREATE INDEX idx_fan_segments_genre ON fan_segments(preferred_genre)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS fan_segments`);
    await queryRunner.query(`DROP TABLE IF EXISTS smart_link_attributions`);
    await queryRunner.query(`DROP TABLE IF EXISTS mako_promotion_campaigns`);
    await queryRunner.query(`DROP TABLE IF EXISTS tekrem_account_links`);
  }
}
