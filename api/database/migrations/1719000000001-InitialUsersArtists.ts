import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialUsersArtists1719000000001 implements MigrationInterface {
  name = 'InitialUsersArtists1719000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'LISTENER' CHECK (role IN ('LISTENER', 'ARTIST', 'ADMIN')),
        country VARCHAR(50),
        avatar_url TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMPTZ
      )
    `);

    await queryRunner.query(`
      CREATE TABLE artists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        artist_name VARCHAR(100) NOT NULL,
        bio TEXT,
        genres TEXT[] DEFAULT '{}',
        social_links JSONB,
        cover_image_url TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        subscription_tier VARCHAR(20) DEFAULT 'STARTER',
        total_plays BIGINT DEFAULT 0,
        total_downloads BIGINT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email)`);
    await queryRunner.query(`CREATE INDEX idx_users_phone ON users(phone)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS artists`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
