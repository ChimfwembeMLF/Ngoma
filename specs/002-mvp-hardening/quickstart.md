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

```bash
# After registering a user via /auth, promote to ADMIN:
psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-admin.sql
# Edit email in script first
```

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
