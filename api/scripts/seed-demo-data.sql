-- Demo catalog for local development (Discover, search, trending).
-- Usage:
--   psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-demo-data.sql
--
-- Demo listener: listener@ngoma.test / demo1234

BEGIN;

-- Remove previous demo seed (idempotent re-run)
DELETE FROM tracks WHERE description = 'seed:demo-catalog';

-- Demo listener account
INSERT INTO users (id, email, password_hash, phone, full_name, role, country, is_active, is_verified)
VALUES (
  'a1000000-0000-4000-8000-000000000001',
  'listener@ngoma.test',
  '$2b$10$NRljsruUK8P2ZRXKFO6Q1eb749HgzBEEkVYxZ8LNK7e8QeAQZYzLu',
  '+260971000001',
  'Demo Listener',
  'LISTENER',
  'ZM',
  TRUE,
  TRUE
)
ON CONFLICT (email) DO NOTHING;

-- Tracks for Demo Artist
INSERT INTO tracks (
  id, artist_id, title, description, genre, pricing_type, price,
  cover_art_url, duration, is_published, is_draft, is_active, plays, downloads, release_date
)
SELECT
  v.id::uuid,
  a.id,
  v.title,
  'seed:demo-catalog',
  v.genre,
  v.pricing_type,
  v.price,
  v.cover_art_url,
  v.duration,
  TRUE,
  FALSE,
  TRUE,
  v.plays,
  v.downloads,
  v.release_date::date
FROM artists a
CROSS JOIN (VALUES
  ('b1000000-0000-4000-8000-000000000001', 'Sunset over Lusaka', 'Afrobeats', 'SET_PRICE', 15.00, 'https://picsum.photos/seed/ngoma1/600/600', 214, 1280, 42, '2026-06-01'),
  ('b1000000-0000-4000-8000-000000000002', 'Sunrise Amapiano', 'Amapiano', 'FREE', NULL, 'https://picsum.photos/seed/ngoma2/600/600', 198, 960, 88, '2026-06-15'),
  ('b1000000-0000-4000-8000-000000000003', 'Copperbelt Groove', 'Afrobeat', 'SET_PRICE', 10.00, 'https://picsum.photos/seed/ngoma3/600/600', 245, 720, 31, '2026-07-01'),
  ('b1000000-0000-4000-8000-000000000004', 'Midnight in Ndola', 'Afrobeats', 'SET_PRICE', 12.00, 'https://picsum.photos/seed/ngoma4/600/600', 187, 540, 19, '2026-07-10')
) AS v(id, title, genre, pricing_type, price, cover_art_url, duration, plays, downloads, release_date)
WHERE a.artist_name = 'Demo Artist';

-- Tracks for Samantha Benson
INSERT INTO tracks (
  id, artist_id, title, description, genre, pricing_type, price,
  cover_art_url, duration, is_published, is_draft, is_active, plays, downloads, release_date
)
SELECT
  v.id::uuid,
  a.id,
  v.title,
  'seed:demo-catalog',
  v.genre,
  v.pricing_type,
  v.price,
  v.cover_art_url,
  v.duration,
  TRUE,
  FALSE,
  TRUE,
  v.plays,
  v.downloads,
  v.release_date::date
FROM artists a
CROSS JOIN (VALUES
  ('b1000000-0000-4000-8000-000000000005', 'Golden Hour', 'R&B', 'SET_PRICE', 20.00, 'https://picsum.photos/seed/ngoma5/600/600', 223, 890, 55, '2026-05-20'),
  ('b1000000-0000-4000-8000-000000000006', 'Afro Fusion Nights', 'Afrobeats', 'FREE', NULL, 'https://picsum.photos/seed/ngoma6/600/600', 201, 1100, 102, '2026-06-28'),
  ('b1000000-0000-4000-8000-000000000007', 'Victoria Falls Echo', 'Amapiano', 'SET_PRICE', 8.00, 'https://picsum.photos/seed/ngoma7/600/600', 176, 650, 27, '2026-07-05'),
  ('b1000000-0000-4000-8000-000000000008', 'Zed Summer Anthem', 'Dancehall', 'SET_PRICE', 5.00, 'https://picsum.photos/seed/ngoma8/600/600', 192, 420, 14, '2026-07-12')
) AS v(id, title, genre, pricing_type, price, cover_art_url, duration, plays, downloads, release_date)
WHERE a.artist_name = 'Samantha Benson';

-- Backfill full-text search vectors
UPDATE tracks t
SET search_vector = to_tsvector(
  'english',
  coalesce(t.title, '') || ' ' || coalesce(t.genre, '') || ' ' || coalesce(a.artist_name, '')
)
FROM artists a
WHERE t.artist_id = a.id
  AND t.description = 'seed:demo-catalog';

COMMIT;

-- Summary
SELECT 'tracks' AS entity, count(*)::text AS count FROM tracks WHERE description = 'seed:demo-catalog'
UNION ALL
SELECT 'published', count(*)::text FROM tracks WHERE is_published = TRUE AND is_active = TRUE;
