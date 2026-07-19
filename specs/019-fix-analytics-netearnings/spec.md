# Feature Specification: Fix Analytics netEarnings Query Error

**Feature Branch**: `019-fix-analytics-netearnings`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Could not load analytics: column \"netearnings\" does not exist"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Artist dashboard loads analytics (Priority: P1)

An artist opens `/artist/dashboard` and sees earnings summary, top tracks, and timeline without a server error.

**Why this priority**: The dashboard is unusable when analytics API fails; this blocks core artist value.

**Independent Test**: Sign in as artist with at least one published track → dashboard loads with KPI cards and top tracks table populated (or zero-state, not error).

**Acceptance Scenarios**:

1. **Given** an authenticated artist, **When** `GET /api/v1/analytics/dashboard` is called, **Then** response is `200` with `summary`, `topTracks`, and `trends`.
2. **Given** artist dashboard page, **When** analytics hook resolves, **Then** UI does not show "Could not load analytics".
3. **Given** artist with multiple tracks and earnings, **When** dashboard loads, **Then** `topTracks` is sorted by net earnings descending.

---

### User Story 2 - Earnings timeline loads (Priority: P1)

An artist views the earnings timeline chart for the selected period without SQL errors.

**Why this priority**: Timeline is part of the same analytics module; must remain stable after fix.

**Independent Test**: Call `GET /api/v1/analytics/earnings/timeline?days=30` as artist → `200` with daily buckets.

**Acceptance Scenarios**:

1. **Given** authenticated artist, **When** timeline endpoint is requested, **Then** response includes `buckets` and `totalNetEarnings`.
2. **Given** artist dashboard earnings section, **When** chart renders, **Then** no error banner from failed timeline fetch.

---

### User Story 3 - Admin overview analytics unaffected (Priority: P2)

Platform admin revenue charts continue to work; fix is scoped to the broken query only.

**Why this priority**: Prevent scope creep; admin uses separate queries in `admin.service.ts`.

**Independent Test**: Admin overview page loads revenue chart after artist fix ships.

**Acceptance Scenarios**:

1. **Given** admin user on `/admin`, **When** overview loads, **Then** revenue timeline still renders.

---

### Edge Cases

- Artist with zero tracks — dashboard returns empty `topTracks` array, not SQL error.
- Artist with tracks but zero earnings — all tracks show `netEarnings: 0`, sorted by plays secondary.
- PostgreSQL case sensitivity — ORDER BY must reference alias or expression valid in PG.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-1901**: `buildTopTracks()` in `analytics.service.ts` MUST NOT reference an unquoted camelCase SELECT alias in `ORDER BY` (PostgreSQL lowercases to `netearnings`, which does not match).
- **FR-1902**: Fix MUST preserve contract: `topTracks` sorted by net earnings DESC, then plays DESC, limit 10.
- **FR-1903**: No database migration required — bug is in query builder SQL generation, not schema.
- **FR-1904**: No client changes required unless error handling copy needs updating after fix.
- **FR-1905**: Add or extend API test covering dashboard `topTracks` query against PostgreSQL.

### Key Entities

- **TopTrackRow** (computed): `{ trackId, title, plays, downloads, netEarnings, pricingType }` — unchanged API shape.
- **Earnings** (entity): source of `SUM(e.amount)` aggregation — unchanged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `GET /api/v1/analytics/dashboard` returns HTTP 200 for artist JWT in dev/staging.
- **SC-002**: Artist dashboard shows analytics section without "Could not load analytics" error.
- **SC-003**: `topTracks` ordering matches net earnings descending when earnings differ across tracks.
- **SC-004**: Zero schema migrations; fix deployable as API-only patch.

## Assumptions

- Error originates from `buildTopTracks()` `.orderBy('netEarnings', 'DESC')` in PostgreSQL environment.
- Fix uses aggregate expression or quoted alias — no new dependencies.
- Existing seed data (`api/scripts/seed-analytics.sql`) sufficient for manual validation.
