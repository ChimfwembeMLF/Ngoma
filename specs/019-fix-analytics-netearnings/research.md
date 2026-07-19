# Research: Fix Analytics netEarnings Query Error

**Feature**: 019-fix-analytics-netearnings  
**Date**: 2026-07-19

## Problem

Artist dashboard shows: **"Could not load analytics: column \"netearnings\" does not exist"**

The client calls `GET /api/v1/analytics/dashboard`, which runs `AnalyticsService.getDashboard()` → `buildTopTracks()`.

## Root Cause

In `api/src/modules/analytics/analytics.service.ts`, `buildTopTracks()` defines a SELECT alias:

```typescript
.addSelect('COALESCE(SUM(e.amount), 0)', 'netEarnings')
// ...
.orderBy('netEarnings', 'DESC')
```

PostgreSQL folds unquoted identifiers to lowercase. TypeORM emits `ORDER BY "netEarnings"` inconsistently vs alias `"netEarnings"` in SELECT — when unquoted in ORDER BY, PG looks for column `netearnings`, which does not exist (it's a computed alias, not a table column).

Other queries in the same file avoid this:
- Timeline uses `.orderBy("DATE_TRUNC('day', ...)", 'ASC')` — expression, not alias
- Summary aggregations have no ORDER BY on aliases

Only `buildTopTracks()` line 161 uses `.orderBy('netEarnings', 'DESC')`.

## Decision: Order by aggregate expression

**Decision**: Replace `.orderBy('netEarnings', 'DESC')` with `.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')`.

**Rationale**:
- Works reliably in PostgreSQL regardless of alias quoting
- Matches the SELECT expression exactly (same sort semantics)
- Minimal one-line fix; no migration, no DTO changes
- TypeORM pattern used elsewhere in codebase (expression-based ORDER BY)

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Quote alias: `.orderBy('"netEarnings"', 'DESC')` | Fragile across TypeORM versions; easy to regress |
| Subquery wrapper | Over-engineered for a sort clause |
| Rename alias to snake_case `net_earnings` | Breaks API contract mapping (`netEarnings` in JSON) unless extra mapping layer added |
| Database migration adding column | Wrong layer — value is computed aggregate, not stored |

## Secondary audit

Grep of `api/src/**/*.ts` for `.orderBy` with camelCase aliases found only this one occurrence (`netEarnings`). Admin analytics queries use date expressions, not camelCase aliases.

## Testing approach

- Manual: artist dashboard after seed-analytics.sql
- Automated: Jest integration/e2e test for `GET /api/v1/analytics/dashboard` returning 200 with `topTracks` array
- Regression: timeline endpoint unchanged

## References

- `specs/005-artist-analytics/contracts/analytics-api.md` — topTracks sort contract
- PostgreSQL identifier case rules: unquoted identifiers → lowercase
