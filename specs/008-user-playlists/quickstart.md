# Quickstart: 008-user-playlists

**Purpose**: Validate user-generated playlists end-to-end.

**Prerequisites**:
- Features `001`–`007` implemented
- Postgres **5433**, API **4001**, client **5173**
- Demo seed with published tracks

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
yarn workspace @ngoma/api migrations:run
```

---

## Validation Scenarios

### VS-801: Create playlist

1. Sign in as **LISTENER**.
2. Open `/playlists` → Create "Road Trip Mix".
3. **Expected**: Playlist appears in list with 0 tracks.

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Road Trip Mix","isPublic":true}' \
  http://localhost:4001/api/v1/playlists | jq .
```

### VS-802: Add and remove tracks

1. Open playlist detail or use API.
2. Add two published track IDs.
3. Remove one.
4. **Expected**: Detail shows one track; duplicate add returns 400.

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trackId":"TRACK_ID"}' \
  http://localhost:4001/api/v1/playlists/PLAYLIST_ID/tracks | jq .
```

### VS-803: My playlists list

1. `GET /api/v1/playlists/mine` or `/playlists` UI.
2. **Expected**: All owned playlists with correct `trackCount`.

### VS-804: Public vs private

1. Set playlist `isPublic: false`.
2. Open `/playlists/:id` as another user (or unauthenticated).
3. **Expected**: 403. Owner still sees full detail.

### VS-805: Add from track page

1. Open `/tracks/:id` while logged in.
2. Select playlist → Add to playlist.
3. **Expected**: Track appears in that playlist detail.

---

## Regression checks

- `/discover` trending and new releases work
- Checkout and tip flows unchanged

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-801 Create playlist | PASS | Migration 008 applied; `POST /api/v1/playlists` + `/playlists` UI create form |
| VS-802 Add/remove tracks | PASS | Append position, duplicate 400, owner-only mutations |
| VS-803 My playlists list | PASS | `GET /api/v1/playlists/mine` with `trackCount`; empty state on `/playlists` |
| VS-804 Public vs private | PASS | Optional JWT on GET; private returns 403 for non-owner |
| VS-805 Add from track page | PASS | Select + Add on `/tracks/:id`; link to create when no playlists |
| Regression | PASS | Discover, checkout, tip routes unchanged; lint/build pass |

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| 403 on own playlist | JWT `sub` must match `playlist.userId` |
| Cannot add track | Track must be published and active |
| Duplicate error | Expected — UNIQUE on playlist_tracks |

---

## Contract references

- [playlists-api.md](./contracts/playlists-api.md)
- [playlists-ui.md](./contracts/playlists-ui.md)
- [data-model.md](./data-model.md)
