import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideos1719000000014 implements MigrationInterface {
  name = 'CreateVideos1719000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE videos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        video_file_url VARCHAR(500),
        thumbnail_url VARCHAR(500),
        duration INTEGER DEFAULT 0,
        is_published BOOLEAN DEFAULT FALSE,
        is_draft BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        views BIGINT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(
      `CREATE INDEX idx_videos_artist_published ON videos(artist_id, is_published, created_at DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_videos_published_recent ON videos(is_published, created_at DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS videos`);
  }
}
