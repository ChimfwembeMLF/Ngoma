import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlaylistShareCurated1719000000009 implements MigrationInterface {
  name = 'PlaylistShareCurated1719000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE playlists ADD COLUMN share_slug VARCHAR(80) UNIQUE
    `);

    await queryRunner.query(`
      CREATE INDEX idx_playlists_share_slug ON playlists(share_slug) WHERE share_slug IS NOT NULL
    `);

    await queryRunner.query(`
      DO $$
      DECLARE
        admin_user_id UUID;
        pl_afro UUID := 'c1000000-0000-4000-8000-000000000001';
        pl_zed UUID := 'c1000000-0000-4000-8000-000000000002';
      BEGIN
        SELECT id INTO admin_user_id FROM users WHERE role = 'ADMIN' LIMIT 1;
        IF admin_user_id IS NULL THEN
          RETURN;
        END IF;

        INSERT INTO playlists (id, user_id, name, description, is_public, is_curated, share_slug)
        VALUES
          (
            pl_afro,
            admin_user_id,
            'Afrobeats Hits',
            'Editorial pick — Afrobeats essentials',
            TRUE,
            TRUE,
            'afrobeats-hits-x7k2m9'
          ),
          (
            pl_zed,
            admin_user_id,
            'Zambian Gold',
            'Editorial pick — Zambian artists',
            TRUE,
            TRUE,
            'zambian-gold-p3n8q1'
          )
        ON CONFLICT (id) DO NOTHING;

        INSERT INTO playlist_tracks (playlist_id, track_id, position)
        SELECT pl_afro, t.id, row_number() OVER (ORDER BY t.id) - 1
        FROM tracks t
        WHERE t.id IN (
          'b1000000-0000-4000-8000-000000000001'::uuid,
          'b1000000-0000-4000-8000-000000000004'::uuid,
          'b1000000-0000-4000-8000-000000000006'::uuid
        )
        AND NOT EXISTS (
          SELECT 1 FROM playlist_tracks pt
          WHERE pt.playlist_id = pl_afro AND pt.track_id = t.id
        );

        INSERT INTO playlist_tracks (playlist_id, track_id, position)
        SELECT pl_zed, t.id, row_number() OVER (ORDER BY t.id) - 1
        FROM tracks t
        WHERE t.id IN (
          'b1000000-0000-4000-8000-000000000005'::uuid,
          'b1000000-0000-4000-8000-000000000008'::uuid
        )
        AND NOT EXISTS (
          SELECT 1 FROM playlist_tracks pt
          WHERE pt.playlist_id = pl_zed AND pt.track_id = t.id
        );
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM playlist_tracks
      WHERE playlist_id IN (
        'c1000000-0000-4000-8000-000000000001'::uuid,
        'c1000000-0000-4000-8000-000000000002'::uuid
      )
    `);
    await queryRunner.query(`
      DELETE FROM playlists
      WHERE id IN (
        'c1000000-0000-4000-8000-000000000001'::uuid,
        'c1000000-0000-4000-8000-000000000002'::uuid
      )
    `);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_playlists_share_slug`);
    await queryRunner.query(`ALTER TABLE playlists DROP COLUMN IF EXISTS share_slug`);
  }
}
