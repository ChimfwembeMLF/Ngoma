# Quickstart: 002-mvp-hardening

**Purpose**: Validate MVP hardening after implementing 002 tasks.

**Prerequisites**: `001-platform-mvp` stack running (see updated port notes below).

## Port configuration (updated)

| Service | Default | If conflict |
|---------|---------|-------------|
| Docker Postgres | host **5433** | Set `DB_PORT=5433` in `api/.env` when local Postgres uses 5432 |
| Ngoma API | **4000** | Set `PORT=4001` in `api/.env` if another app uses 4000 |
| Vite client | **5173** | Update `client/vite.config.ts` proxy to match API port |

## Bootstrap admin user (one-time)

Edit the email in `api/scripts/seed-admin.sql`, then after registering that user via `/auth`:

```bash
psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-admin.sql
```

See `api/scripts/seed-admin.sql` for the `UPDATE users SET role = 'ADMIN' WHERE email = ...` statement.

## Validation Scenarios

### VS-101: Admin user management

1. Sign in as ADMIN.
2. Open http://localhost:5173/admin/users.
3. Confirm paginated user list loads.
4. Deactivate a test LISTENER account.
5. **Expected**: User shows inactive; deactivated user cannot log in.

### VS-102: Track duration

1. Sign in as ARTIST; upload MP3 via artist dashboard.
2. Publish track.
3. Open track detail and discovery card.
4. **Expected**: `duration` > 0; UI shows mm:ss.

### VS-103: Full-text search

1. Publish tracks with titles containing "Sunset" and "Sunrise".
2. Search `GET /api/v1/discovery/search?q=sunset` (or UI search box).
3. **Expected**: Relevant track returned; ILIKE-only misses ranked less relevant matches.

### VS-104: Quickstart regression

1. Re-run VS-1–VS-5 from `specs/001-platform-mvp/quickstart.md`.
2. **Expected**: All pass with updated port documentation.

## Validation results (2026-07-19, re-verified)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-101 Admin UI | Manual | `/admin/users` + `AdminRoute`; self-deactivate guard; login rejects `isActive=false` |
| VS-102 Duration | Manual | `parseAudioDuration` on upload; `formatDuration` on Discover + Track pages |
| VS-103 FTS | Pass (API) | Migration 004 applied (no pending); empty `q` → 400; `plainto_tsquery` + `ts_rank` |
| VS-104 Regression | Pass (build) | API + client build and lint clean; 001 quickstart port docs aligned |

Automated checks (this run): migrations up-to-date, `yarn build` + `yarn lint` (api + client), `GET /discovery/search?q=` → 400.

Manual follow-up: promote admin via `seed-admin.sql`, walk VS-101–VS-102 in browser, re-run VS-1–VS-5 from 001 quickstart.

## Troubleshooting

| Issue | Check |
|-------|-------|
| Admin page 403 | User role ADMIN in DB |
| Duration still 0 | `music-metadata` installed; valid audio MIME |
| Search empty | Run migration 004; backfill `search_vector` |
| API port conflict | `PORT=4001` in `api/.env` + vite proxy |

## Contract references

- [contracts/admin.md](./contracts/admin.md)
- [contracts/discovery.md](./contracts/discovery.md)
- [001 quickstart](../001-platform-mvp/quickstart.md)
