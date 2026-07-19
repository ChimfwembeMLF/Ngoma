# Quickstart: Free Track Downloads

**Feature**: 022-free-track-downloads

**Prerequisites**: Postgres + API (4001) + client (5173); artist + listener accounts; sample audio file.

---

## Setup

```bash
yarn workspace @ngoma/api dev
yarn workspace @ngoma/client dev
```

---

## VS-2201: Free track download

1. Artist uploads track with pricing **Free** → publish.
2. Sign in as listener → open `/tracks/:id`.
3. Click **Download free**.
4. **Expected**: File downloads; no 403; `canDownload: true` in track API response.

```bash
# With listener JWT
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/tracks/TRACK_ID | jq '.data.canDownload'
# Expected: true (FREE track)

curl -sI -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/tracks/TRACK_ID/download | grep HTTP
# Expected: HTTP/1.1 200
```

---

## VS-2202: Paid track without purchase

1. Open paid track as listener (no prior purchase).
2. **Expected**: Buy button visible; **no** Download button.
3. Force download via curl → 403.

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/tracks/PAID_TRACK_ID | jq '.data.canDownload'
# Expected: false

curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/tracks/PAID_TRACK_ID/download
# Expected: 403 Purchase required to download
```

---

## VS-2203: Paid track after purchase

1. Complete checkout for paid track.
2. Return to TrackPage.
3. **Expected**: Download button visible; download succeeds; `canDownload: true`.

---

## VS-2204: Error handling

1. Attempt download on paid track without access (if button reachable).
2. **Expected**: User-visible error message; no uncaught promise in console.

---

## Validation Results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-2201 | Implemented | FREE + JWT → `canDownload: true`; download endpoint unchanged |
| VS-2202 | Implemented | Paid + no access → `canDownload: false`; no Download button on TrackPage |
| VS-2203 | Implemented | Checkout invalidates `['track', id]` on complete; Download shown when entitled |
| VS-2204 | Implemented | `downloadError` state on TrackPage; no uncaught promise |
| Build | Pass | API + client lint/build succeed |

---

## Regression

- FREE stream still works without login.
- PWYW and SET_PRICE checkout unchanged.
