import { MigrationInterface, QueryRunner } from 'typeorm';

export class TracksAlbums1719000000002 implements MigrationInterface {
  name = 'TracksAlbums1719000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE albums (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cover_art_url TEXT,
        release_date DATE,
        type VARCHAR(20) DEFAULT 'SINGLE' CHECK (type IN ('SINGLE', 'EP', 'ALBUM')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE TABLE tracks (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        genre VARCHAR(100) NOT NULL,
        pricing_type VARCHAR(20) DEFAULT 'SET_PRICE' CHECK (pricing_type IN ('SET_PRICE', 'FREE')),
        price DECIMAL(10, 2),
        audio_file_url TEXT,
        cover_art_url TEXT,
        duration INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT FALSE,
        is_draft BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        plays BIGINT DEFAULT 0,
        downloads BIGINT DEFAULT 0,
        release_date DATE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_tracks_artist_published ON tracks(artist_id, is_published)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tracks`);
    await queryRunner.query(`DROP TABLE IF EXISTS albums`);
  }
}
