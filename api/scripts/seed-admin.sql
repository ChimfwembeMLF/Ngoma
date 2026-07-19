-- Promote an existing user to ADMIN and set password for local development.
-- Login: lufegoh@mailinator.com / password
-- Usage: edit the email below, then run:
--   psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-admin.sql

UPDATE users
SET role = 'ADMIN',
    password_hash = '$2b$10$MkmUlTnLOgrQRCqYdKpl.uRW/qO0qCpC1vlRt9cXFtSWs0GvAHiEW'
WHERE email = 'lufegoh@mailinator.com';
