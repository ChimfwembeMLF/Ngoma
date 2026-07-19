-- Promote an existing user to ADMIN for local development.
-- Usage: edit the email below, then run:
--   psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-admin.sql

UPDATE users
SET role = 'ADMIN'
WHERE email = 'admin@ngoma.test';
