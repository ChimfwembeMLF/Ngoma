# Contract: Analytics Top Tracks Query Fix

**Module**: `api/src/modules/analytics/analytics.service.ts`  
**Method**: `buildTopTracks(artistId: string)`  
**Endpoint**: `GET /api/v1/analytics/dashboard` (via `getDashboard`)

---

## Bug

PostgreSQL error when loading artist dashboard:

```text
column "netearnings" does not exist
```

Triggered by `ORDER BY` referencing camelCase SELECT alias without proper quoting.

---

## Required SQL semantics (unchanged)

```sql
SELECT
  t.id AS "trackId",
  t.title AS title,
  t.plays AS plays,
  t.downloads AS downloads,
  t.pricing_type AS "pricingType",
  COALESCE(SUM(e.amount), 0) AS "netEarnings"
FROM tracks t
LEFT JOIN earnings e ON e.track_id = t.id AND e.artist_id = t.artist_id
WHERE t.artist_id = :artistId AND t.is_active = true
GROUP BY t.id, t.title, t.plays, t.downloads, t.pricing_type
ORDER BY COALESCE(SUM(e.amount), 0) DESC, t.plays DESC
LIMIT 10
```

**Note**: `ORDER BY` MUST use the aggregate expression (or equivalently quoted alias), NOT unquoted `netEarnings`.

---

## TypeORM implementation contract

```typescript
// CORRECT
.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')
.addOrderBy('t.plays', 'DESC')

// INCORRECT — fails on PostgreSQL
.orderBy('netEarnings', 'DESC')
```

---

## API response (unchanged)

See `specs/005-artist-analytics/contracts/analytics-api.md` — `topTracks` array shape and sort order unchanged.

---

## Out of scope

- Client hook changes (`useAnalytics.ts`)
- Database migrations
- Admin dashboard queries (`admin.service.ts`)
