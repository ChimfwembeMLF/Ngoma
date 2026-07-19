# Quickstart: 005-artist-analytics

**Purpose**: Validate artist analytics API and dashboard UI end-to-end.

**Prerequisites**:
- `001`–`004` implemented and running
- Postgres on port **5433**, API **4001**, client **5173** (see [002 quickstart](../002-mvp-hardening/quickstart.md))
- Demo seed: `api/scripts/seed-demo-data.sql`

## Run stack

```bash
# From repo root
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

Apply migration after implement:

```bash
yarn workspace @ngoma/api typeorm migration:run
```

## Validation Scenarios

### VS-401: Dashboard summary

1. Sign in as an **ARTIST** with published tracks and at least one completed purchase (or seeded earnings).
2. Open `/artist/dashboard`.
3. **Expected**: Four summary cards show net earnings, downloads, plays, and unique supporters. Values match `GET /api/v1/analytics/dashboard` in Swagger or curl.

**curl** (replace token):

```bash
curl -s -H "Authorization: Bearer $ARTIST_TOKEN" \
  http://localhost:4001/api/v1/analytics/dashboard | jq .
```

### VS-402: Earnings by track

1. On same dashboard, scroll to **Performance by track**.
2. **Expected**: Rows for artist tracks with plays, downloads, net earnings; highest revenue first.

### VS-403: Earnings timeline

1. Call timeline endpoint or view timeline section on dashboard.

```bash
curl -s -H "Authorization: Bearer $ARTIST_TOKEN" \
  "http://localhost:4001/api/v1/analytics/earnings/timeline?days=30" | jq .
```

2. **Expected**: Daily buckets; sum of `netEarnings` equals timeline `totalNetEarnings`.

### VS-404: Authorization

1. Sign in as **LISTENER**; call analytics dashboard endpoint.
2. **Expected**: HTTP 403.
3. Sign in as **ARTIST** with zero sales.
4. **Expected**: Summary zeros, empty timeline, no server error.

## Generating test earnings

**Option A — Sandbox checkout** (see 001/002 quickstart VS-3):

1. Listener purchases artist's priced track.
2. Complete payment (dev auto-complete if no PawaPay token).
3. Refresh artist dashboard — earnings update.

**Option B — Seed extension** (if implement adds `seed-analytics.sql`):

```bash
psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-analytics.sql
```

## Regression checks

- Artist can still upload and publish tracks from dashboard.
- Listener `/discover` and `/purchases` unchanged.

## Troubleshooting

| Issue | Check |
|-------|-------|
| All zeros | No completed payments → no `earnings` rows |
| 403 for artist | JWT missing `artistId`; re-login after artist registration |
| Slow dashboard | Run migration 005 index; check `EXPLAIN` on earnings query |
| Timeline empty | Purchases outside `days` window; increase `days=90` |

## Contract references

- [analytics-api.md](./contracts/analytics-api.md)
- [dashboard-ui.md](./contracts/dashboard-ui.md)
- [data-model.md](./data-model.md)

## Implementation validation (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-401 Dashboard summary | PASS (build) | `GET /api/v1/analytics/dashboard` returns summary + topTracks; four summary cards on `/artist/dashboard` |
| VS-402 Earnings by track | PASS (build) | `topTracks` aggregated via tracks + earnings join, limit 10, sorted by net earnings |
| VS-403 Earnings timeline | PASS (build) | `GET /api/v1/analytics/earnings/timeline?days=7\|30\|90`; CSS bar list with period total |
| VS-404 Authorization | PASS (code) | `@Roles(ARTIST)` + `ForbiddenException` when JWT lacks `artistId` |
| SC-405 Regression | PASS (build) | Upload form and track list unchanged below analytics sections |
| Migration 005 | PASS | `idx_earnings_artist_created` applied via `yarn workspace @ngoma/api migrations:run` |
| Lint / build | PASS | `yarn workspace @ngoma/api lint && build`; `yarn workspace @ngoma/client lint && build` |

**Seed data**: Run `api/scripts/seed-analytics.sql` after `seed-demo-data.sql` for non-zero demo metrics.
