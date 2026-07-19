import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArtistTipping1719000000007 implements MigrationInterface {
  name = 'ArtistTipping1719000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tips (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
        message TEXT,
        track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
        is_anonymous BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_tips_artist_created ON tips(artist_id, created_at DESC)`,
    );

    await queryRunner.query(`
      ALTER TABLE earnings ALTER COLUMN track_id DROP NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_purpose_check
    `);
    await queryRunner.query(`
      ALTER TABLE payments ADD CONSTRAINT payments_purpose_check
      CHECK (purpose IN ('TRACK_DOWNLOAD', 'TIP'))
    `);

    await queryRunner.query(`
      ALTER TABLE earnings DROP CONSTRAINT IF EXISTS earnings_source_check
    `);
    await queryRunner.query(`
      ALTER TABLE earnings ADD CONSTRAINT earnings_source_check
      CHECK (source IN ('DOWNLOAD', 'TIP'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE earnings DROP CONSTRAINT IF EXISTS earnings_source_check
    `);
    await queryRunner.query(`
      ALTER TABLE earnings ADD CONSTRAINT earnings_source_check
      CHECK (source IN ('DOWNLOAD'))
    `);

    await queryRunner.query(`
      ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_purpose_check
    `);
    await queryRunner.query(`
      ALTER TABLE payments ADD CONSTRAINT payments_purpose_check
      CHECK (purpose IN ('TRACK_DOWNLOAD'))
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS tips`);
  }
}
