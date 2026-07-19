# Quickstart: Fix Analytics netEarnings Query Error

**Purpose**: Validate artist analytics dashboard loads after fixing PostgreSQL ORDER BY bug.

**Prerequisites**:
- Postgres **5433**, API **4001**, client **5173**
- Demo artist account (from `seed-demo-data.sql`) or artist JWT
- Optional: `api/scripts/seed-analytics.sql` for non-zero earnings

---

## Setup

```bash
# Terminal 1 — API
yarn workspace @ngoma/api start:dev

# Terminal 2 — Client
yarn workspace @ngoma/client dev

# Optional — seed earnings for sort validation
psql -h 127.0.0.1 -p 5433 -U ngoma -d ngoma -f api/scripts/seed-analytics.sql
```

---

## Validation Scenarios

### VS-1901: Dashboard API returns 200

1. Sign in as artist (e.g. demo artist from seed data)
2. Request dashboard analytics:

```bash
curl -s -H "Authorization: Bearer <ARTIST_JWT>" \
  http://localhost:4001/api/v1/analytics/dashboard | jq .
```

3. **Expected**:
   - HTTP **200**
   - `data.summary`, `data.topTracks`, `data.trends` present
   - No PostgreSQL error in API logs

**Before fix**: 500 with `column "netearnings" does not exist`

---

### VS-1902: Artist dashboard UI loads

1. Open `/artist/dashboard` as authenticated artist
2. **Expected**:
   - KPI summary cards render
   - Top tracks table renders (data or empty state)
   - Earnings timeline chart renders
   - **No** "Could not load analytics" error banner

---

### VS-1903: Top tracks sorted by net earnings

**Requires**: `seed-analytics.sql` run (Demo Artist tracks with differing earnings)

1. Load dashboard API or UI top tracks section
2. **Expected**:
   - `topTracks` ordered by `netEarnings` descending
   - When earnings tie, higher `plays` ranks first
   - Maximum 10 rows

Example check:

```bash
curl -s -H "Authorization: Bearer <ARTIST_JWT>" \
  http://localhost:4001/api/v1/analytics/dashboard \
  | jq '.data.topTracks[] | {title, netEarnings, plays}'
```

Verify each row's `netEarnings` ≥ the next row's.

---

### VS-1904: Earnings timeline unchanged

1. Request timeline:

```bash
curl -s -H "Authorization: Bearer <ARTIST_JWT>" \
  "http://localhost:4001/api/v1/analytics/earnings/timeline?days=30" | jq .
```

2. **Expected**: HTTP 200, `data.buckets` array, `data.totalNetEarnings` number

---

### VS-1905: Admin overview unaffected

1. Sign in as admin → `/admin`
2. **Expected**: Revenue chart loads (separate query path in `admin.service.ts`)

---

## Build check

```bash
yarn workspace @ngoma/api test
yarn workspace @ngoma/api lint
yarn workspace @ngoma/api build
```

No client build required unless client changes are added (not expected for this fix).

**Result (2026-07-19)**: Jest test passed (1 suite); lint passed (0 errors); build passed.

---

## Validation Results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1901 Dashboard API | PASS (automated) | `analytics.service.spec.ts` verifies `getDashboard()` query uses aggregate ORDER BY |
| VS-1902 Artist dashboard UI | PASS (static) | Fix removes 500; client unchanged — manual browser check recommended |
| VS-1903 Top tracks sort | PASS (static) | ORDER BY `COALESCE(SUM(e.amount), 0)` DESC + `t.plays` DESC preserved |
| VS-1904 Timeline unchanged | PASS (static) | `getEarningsTimeline()` not modified |
| VS-1905 Admin unaffected | PASS (static) | `admin.service.ts` not modified |
| Grep audit | PASS | No other camelCase SELECT alias in `.orderBy()` across `api/src` |

Manual curl/browser validation with `seed-analytics.sql` recommended before release.

---

## Contracts

- [analytics-top-tracks-query.md](./contracts/analytics-top-tracks-query.md)
- [specs/005-artist-analytics/contracts/analytics-api.md](../005-artist-analytics/contracts/analytics-api.md)
