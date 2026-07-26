# Quickstart: Ad-Supported Free Downloads

**Feature**: 023-ad-supported-free-downloads

**Prerequisites**: Feature 022 complete; Postgres + API + client; admin + listener accounts; FREE published track.

---

## Setup

```bash
yarn workspace @ngoma/api migrations:run
yarn workspace @ngoma/api dev
yarn workspace @ngoma/client dev
```

---

## VS-2301: Ad gate before free download

1. Admin: ensure at least one active ad creative.
2. Sign in as listener → FREE track → **Download free**.
3. **Expected**: Ad modal → countdown → Download now → file saves.

```bash
# Start session
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/tracks/TRACK_ID/ad-session | jq .

# Complete after gateSeconds (wait 5s)
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/ad-sessions/SESSION_ID/complete | jq .

# Download with session header
curl -sI -H "Authorization: Bearer $TOKEN" \
  -H "X-Ad-Session-Id: SESSION_ID" \
  http://localhost:4001/api/v1/tracks/TRACK_ID/download
# Expected: 200
```

---

## VS-2302: Admin creatives

1. Admin → ad settings → upload banner → active.
2. Listener ad gate shows new creative.

---

## VS-2303: Impression recorded

```bash
# After complete + download
psql -c "SELECT COUNT(*) FROM ad_impressions WHERE track_id = 'TRACK_ID';"
```

Admin overview shows ad impression count (last 30 days KPI on `/admin`).

---

## Validation log (2026-07-19)

| Test | Status | Notes |
|------|--------|-------|
| VS-2301 Ad gate | PASS (code) | Migration + API endpoints + `AdGateModal` + `TrackPage` integration; manual UI verify recommended |
| VS-2302 Admin creatives | PASS (code) | `/admin/ads` CRUD + media upload |
| VS-2303 Impressions | PASS (code) | `ad_impressions` on complete; admin KPI `adImpressions` |
| VS-2304 Paid regression | PASS (code) | Paid path calls `download()` without ad session |
| Kill switch | PASS (code) | `adsEnabled: false` skips session requirement in `TracksService.download()` |
| Build | PASS | `yarn workspace @ngoma/api lint:ci`, `build`, `client lint`, `build` |
| Migration | PASS | `AdSupportedDownloads1719000000015` applied |

---

## VS-2304: Paid track regression

1. Paid track with purchase → Download → **no ad modal**.

---

## Kill switch

1. Admin sets `adsEnabled: false`.
2. FREE download works without ad gate (022 behavior).

---

## References

- [contracts/ads-api.md](./contracts/ads-api.md)
- [contracts/ad-gate-ui.md](./contracts/ad-gate-ui.md)
- [data-model.md](./data-model.md)
