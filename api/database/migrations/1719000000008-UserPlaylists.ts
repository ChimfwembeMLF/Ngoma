import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPlaylists1719000000008 implements MigrationInterface {
  name = 'UserPlaylists1719000000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE playlists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        cover_art_url TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        is_curated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_playlists_user_id ON playlists(user_id)`,
    );

    await queryRunner.query(`
      CREATE TABLE playlist_tracks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
        track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
        position INTEGER,
        added_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (playlist_id, track_id)
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS playlist_tracks`);
    await queryRunner.query(`DROP TABLE IF EXISTS playlists`);
  }
}
