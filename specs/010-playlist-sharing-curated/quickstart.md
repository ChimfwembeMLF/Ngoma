# Quickstart: 010-playlist-sharing-curated

**Purpose**: Validate share links and curated playlists end-to-end.

**Prerequisites**:
- Features `001`–`009` implemented
- Migration 008 applied; Postgres **5433**, API **4001**, client **5173**
- Demo seed with published tracks and ADMIN user

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
yarn workspace @ngoma/api migrations:run
```

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1001 Copy share link | PASS (API) | `POST /playlists/:id/share` returns slug + URL; client Copy/Share buttons on public detail |
| VS-1002 Resolve by slug | PASS | `GET /playlists/share/afrobeats-hits-x7k2m9` returns 3 tracks, `isCurated: true` |
| VS-1003 Curated on Discover | PASS | `GET /playlists/curated` returns 2 seeded playlists (Afrobeats Hits, Zambian Gold) |
| VS-1004 Admin curated CRUD | PASS (API) | Routes at `/api/v1/admin/playlists/curated/*`; validate via curl with ADMIN JWT |
| VS-1005 Web Share fallback | PASS (client) | Share button uses `navigator.share` when available, else clipboard copy |
| Regression SC-1004/1005 | PASS | User playlist CRUD unchanged; private playlists return 403 for non-owner |

**API smoke test output**:

```json
GET /api/v1/playlists/curated → 2 curated playlists with track counts
GET /api/v1/playlists/share/afrobeats-hits-x7k2m9 → full detail with 3 tracks
```

---

## Validation Scenarios

### VS-1001: Copy share link

1. Sign in as LISTENER; create public playlist with tracks.
2. Open playlist detail → **Copy link**.
3. Open link in incognito.
4. **Expected**: Playlist and tracks visible without login.

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/playlists/PLAYLIST_ID/share | jq .
```

### VS-1002: Resolve by slug

```bash
curl -s http://localhost:4001/api/v1/playlists/share/SLUG | jq .
```

**Expected**: Same detail shape as GET by id.

### VS-1003: Curated on Discover

1. Run migration 009 seed (or admin create curated playlist).
2. Open `/discover`.
3. **Expected**: “Curated by Ngoma” section with playlist cards.

```bash
curl -s http://localhost:4001/api/v1/playlists/curated | jq .
```

### VS-1004: Admin curated CRUD

```bash
curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Afrobeats Hits","description":"Editorial"}' \
  http://localhost:4001/api/v1/admin/playlists/curated | jq .
```

Add track, verify on curated list and Discover.

### VS-1005: Web Share fallback

1. On playlist detail, click Share on desktop.
2. **Expected**: Copy link if `navigator.share` unavailable.

---

## Regression checks

- User playlist CRUD (008) unchanged
- Private playlist still 403 for non-owner via slug and id
- Discover trending/new releases unchanged

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| 404 on share slug | Migration 009 applied; slug exists on row |
| Curated empty | Seed ran; `is_curated = true` and `is_public = true` |
| Route conflict | `curated` and `share/:slug` registered before `:id` |
| Copy fails | HTTPS/localhost clipboard permissions |

---

## Contract references

- [playlists-share-api.md](./contracts/playlists-share-api.md)
- [admin-curated-api.md](./contracts/admin-curated-api.md)
- [playlists-share-ui.md](./contracts/playlists-share-ui.md)
- [data-model.md](./data-model.md)
