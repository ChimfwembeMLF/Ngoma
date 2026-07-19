import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrackSearchFts1719000000004 implements MigrationInterface {
  name = 'TrackSearchFts1719000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE tracks ADD COLUMN search_vector tsvector`);

    await queryRunner.query(`
      UPDATE tracks t
      SET search_vector = to_tsvector(
        'english',
        coalesce(t.title, '') || ' ' || coalesce(t.genre, '') || ' ' || coalesce(a.artist_name, '')
      )
      FROM artists a
      WHERE t.artist_id = a.id
    `);

    await queryRunner.query(
      `CREATE INDEX idx_tracks_search ON tracks USING GIN(search_vector)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_tracks_search`);
    await queryRunner.query(`ALTER TABLE tracks DROP COLUMN IF EXISTS search_vector`);
  }
}
