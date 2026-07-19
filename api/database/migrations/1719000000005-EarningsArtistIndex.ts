import { MigrationInterface, QueryRunner } from 'typeorm';

export class EarningsArtistIndex1719000000005 implements MigrationInterface {
  name = 'EarningsArtistIndex1719000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_earnings_artist_created ON earnings(artist_id, created_at DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_earnings_artist_created`);
  }
}
