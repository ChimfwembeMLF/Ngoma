import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentsAccess1719000000003 implements MigrationInterface {
  name = 'PaymentsAccess1719000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE payments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        deposit_id VARCHAR(255) UNIQUE NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'ZMW',
        provider VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'PENDING', 'COMPLETED', 'FAILED')),
        purpose VARCHAR(30) DEFAULT 'TRACK_DOWNLOAD' CHECK (purpose IN ('TRACK_DOWNLOAD')),
        item_id UUID NOT NULL,
        transaction_id VARCHAR(255),
        error_code VARCHAR(50),
        error_message TEXT,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE download_access (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
        expires_at TIMESTAMPTZ,
        download_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, track_id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE earnings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        platform_fee DECIMAL(10, 2) NOT NULL,
        source VARCHAR(20) DEFAULT 'DOWNLOAD' CHECK (source IN ('DOWNLOAD')),
        payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_payments_deposit_id ON payments(deposit_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_payments_user_created ON payments(user_id, created_at)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS earnings`);
    await queryRunner.query(`DROP TABLE IF EXISTS download_access`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments`);
  }
}
