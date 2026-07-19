import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayouts1719000000013 implements MigrationInterface {
  name = 'CreatePayouts1719000000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE payouts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'ZMW',
        status VARCHAR(20) DEFAULT 'PENDING',
        payment_method VARCHAR(50),
        phone VARCHAR(20),
        pawapay_payout_id VARCHAR(255),
        error_message TEXT,
        requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMPTZ,
        processed_by UUID REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      ALTER TABLE payouts ADD CONSTRAINT payouts_status_check
      CHECK (status IN ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED'))
    `);

    await queryRunner.query(
      `CREATE INDEX idx_payouts_artist_status ON payouts(artist_id, status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payouts`);
  }
}
