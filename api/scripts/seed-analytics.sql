-- Sample earnings for analytics dashboard validation.
-- Usage:
--   psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-analytics.sql
--
-- Requires: seed-demo-data.sql (tracks + listener@ngoma.test)

BEGIN;

DELETE FROM earnings WHERE payment_id IN (
  'c1000000-0000-4000-8000-000000000001',
  'c1000000-0000-4000-8000-000000000002',
  'c1000000-0000-4000-8000-000000000003'
);
DELETE FROM payments WHERE deposit_id LIKE 'seed-analytics-%';

INSERT INTO payments (
  id, user_id, deposit_id, amount, currency, provider, status, purpose, item_id, completed_at, created_at
)
SELECT
  v.payment_id::uuid,
  'a1000000-0000-4000-8000-000000000001',
  v.deposit_id,
  v.gross,
  'ZMW',
  'MTN_MOMO_ZMB',
  'COMPLETED',
  'TRACK_DOWNLOAD',
  t.id,
  v.earned_at,
  v.earned_at
FROM (VALUES
  ('c1000000-0000-4000-8000-000000000001', 'seed-analytics-001', 'b1000000-0000-4000-8000-000000000001', 15.00, NOW() - INTERVAL '2 days'),
  ('c1000000-0000-4000-8000-000000000002', 'seed-analytics-002', 'b1000000-0000-4000-8000-000000000001', 15.00, NOW() - INTERVAL '5 days'),
  ('c1000000-0000-4000-8000-000000000003', 'seed-analytics-003', 'b1000000-0000-4000-8000-000000000003', 10.00, NOW() - INTERVAL '1 day')
) AS v(payment_id, deposit_id, track_id, gross, earned_at)
JOIN tracks t ON t.id = v.track_id::uuid
JOIN artists a ON a.id = t.artist_id AND a.artist_name = 'Demo Artist';

INSERT INTO earnings (artist_id, user_id, track_id, amount, platform_fee, source, payment_id, created_at)
SELECT
  t.artist_id,
  p.user_id,
  t.id,
  ROUND(p.amount * 0.9, 2),
  ROUND(p.amount * 0.1, 2),
  'DOWNLOAD',
  p.id,
  p.created_at
FROM payments p
JOIN tracks t ON t.id = p.item_id
WHERE p.deposit_id LIKE 'seed-analytics-%';

COMMIT;

SELECT 'earnings (seed-analytics)' AS entity, count(*)::text AS count
FROM earnings e
JOIN payments p ON p.id = e.payment_id
WHERE p.deposit_id LIKE 'seed-analytics-%';
