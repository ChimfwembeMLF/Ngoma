# Implementation Plan: Fix Analytics netEarnings Query Error

**Branch**: `019-fix-analytics-netearnings` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-fix-analytics-netearnings/spec.md`

## Summary

Artist dashboard fails with **"Could not load analytics: column \"netearnings\" does not exist"** because `buildTopTracks()` in `analytics.service.ts` uses `.orderBy('netEarnings', 'DESC')` on a computed SELECT alias. PostgreSQL lowercases unquoted identifiers, so the sort clause references a non-existent column. Fix: order by the aggregate expression `.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')` instead. One-line API change; no migration, no client changes, API contract unchanged.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (API workspace)

**Primary Dependencies**: NestJS 11+, TypeORM, PostgreSQL 15+

**Storage**: PostgreSQL — `earnings`, `tracks` tables (read-only; no schema change)

**Testing**: Manual VS-1901–VS-1903 via `seed-analytics.sql`; optional Jest e2e for `GET /api/v1/analytics/dashboard`

**Target Platform**: REST API (`/api/v1/analytics/*`)

**Project Type**: Yarn monorepo — fix scoped to `api/src/modules/analytics/`

**Performance Goals**: No change — same query plan, corrected ORDER BY clause

**Constraints**:
- Smallest correct diff — single `orderBy` line change
- Preserve `topTracks` sort: net earnings DESC, then plays DESC, limit 10
- No client or migration work

**Scale/Scope**: 1 file changed (~1 line); optional 1 test file

**Reference**: `specs/005-artist-analytics/`, `api/scripts/seed-analytics.sql`, `research.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Fix extends existing `api/src/modules/analytics/` module — no new module
- [x] No alternate backend/frontend roots
- [x] No database migration (query bug, not schema)
- [x] API contract unchanged — `/api/v1/analytics/dashboard`, DTOs, JwtAuthGuard
- [x] No client changes required
- [x] Smallest diff — expression-based ORDER BY per constitution VI

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/019-fix-analytics-netearnings/
├── plan.md              # This file
├── spec.md
├── research.md          # Root cause + decision
├── data-model.md        # Computed TopTrackRow + query fix table
├── quickstart.md        # Validation scenarios
├── contracts/
│   └── analytics-top-tracks-query.md
└── tasks.md             # (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
api/src/modules/analytics/
├── analytics.service.ts   # buildTopTracks() — fix ORDER BY (line ~161)
├── analytics.controller.ts
├── analytics.module.ts
└── dto/

api/scripts/
└── seed-analytics.sql     # Manual validation seed data

client/src/
├── hooks/useAnalytics.ts  # read-only — no changes
└── pages/ArtistDashboardPage.tsx  # read-only — error clears after fix
```

**Structure Decision**: API-only patch in existing analytics module. Client already handles success/error; fix removes the server 500.

## Complexity Tracking

No constitution violations. No complexity justification required.

## Phase 0: Research (complete)

See [research.md](./research.md).

| Unknown | Resolution |
|---------|------------|
| Root cause | PostgreSQL case-folds unquoted `ORDER BY netEarnings` → `netearnings` |
| Fix approach | Order by aggregate expression matching SELECT |
| Scope | Only `buildTopTracks()` affected; grep confirms no other camelCase alias ORDER BY |
| Migration needed? | No |

## Phase 1: Design (complete)

### Data model

See [data-model.md](./data-model.md) — computed `TopTrackRow` unchanged; query fix table documents before/after.

### Contracts

See [contracts/analytics-top-tracks-query.md](./contracts/analytics-top-tracks-query.md) — required SQL semantics and TypeORM implementation contract.

### Implementation steps (for /speckit-tasks)

1. **Fix query** — In `buildTopTracks()`, replace `.orderBy('netEarnings', 'DESC')` with `.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')`.
2. **Verify timeline** — Confirm `getEarningsTimeline()` still works (unchanged; expression-based ORDER BY already).
3. **Manual validation** — Run seed script, hit dashboard as artist, confirm 200 + sorted `topTracks`.
4. **Optional test** — Add Jest e2e/integration test for dashboard endpoint if test harness exists; otherwise document manual-only in quickstart.

### Risk assessment

| Risk | Mitigation |
|------|------------|
| Sort order changes | ORDER BY uses same expression as SELECT aggregate |
| Regression in admin analytics | Out of scope — separate queries in `admin.service.ts` |
| Future camelCase alias ORDER BY | Document pattern in contract; grep in PR review |

## Next Steps

Run `/speckit-tasks` to generate `tasks.md`, then `/speckit-implement` for the one-line fix and validation.
