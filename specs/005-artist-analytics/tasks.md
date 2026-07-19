# Tasks: Artist Analytics Dashboard

**Input**: Design documents from `/specs/005-artist-analytics/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`

**Tests**: Not requested in spec — manual VS-401–VS-404 only.

---

## Phase 1: Setup — Migration & Seed

**Purpose**: Index for timeline queries and optional dev seed data

- [X] T001 Create migration `api/database/migrations/1719000000005-EarningsArtistIndex.ts` adding `idx_earnings_artist_created` on `(artist_id, created_at DESC)` per research.md R3
- [X] T002 [P] Create optional dev seed `api/scripts/seed-analytics.sql` inserting sample `earnings` rows for demo artists per quickstart Option B

---

## Phase 2: Foundational — Analytics Module

**Purpose**: NestJS module scaffold before endpoint implementation

- [X] T003 Create `api/src/modules/analytics/analytics.module.ts` importing TypeORM `Earnings` and `Track` entities from existing modules
- [X] T004 [P] Create response DTOs in `api/src/modules/analytics/dto/analytics-dashboard.dto.ts` and `api/src/modules/analytics/dto/earnings-timeline.dto.ts` per `contracts/analytics-api.md`
- [X] T005 Register `AnalyticsModule` in `api/src/app.module.ts`

**Checkpoint**: Module loads; no routes yet

---

## Phase 3: User Story 1 — Performance Summary (Priority: P1)

**Goal**: Artist sees net earnings, downloads, plays, and published track count via API and summary cards

**Independent Test**: VS-401 — ARTIST opens `/artist/dashboard`; four summary metrics match `GET /api/v1/analytics/dashboard` `summary` object

- [X] T006 [US1] Implement summary aggregation in `api/src/modules/analytics/analytics.service.ts` (`totalNetEarnings`, `totalPlatformFees`, `totalPlays`, `totalDownloads`, `publishedTrackCount`, `uniqueSupporters`, `currency`) scoped by `artistId`
- [X] T007 [US1] Create `api/src/modules/analytics/analytics.controller.ts` with `GET /api/v1/analytics/dashboard`, `JwtAuthGuard`, `RolesGuard`, `@Roles(ARTIST)`, and `resolveArtistId()` guard per research.md R4
- [X] T008 [P] [US1] Create `client/src/hooks/useAnalytics.ts` with `useAnalyticsDashboard()` calling `/api/v1/analytics/dashboard`
- [X] T009 [US1] Create `client/src/components/analytics/AnalyticsSummaryCards.tsx` with net earnings, downloads, plays, and supporters tiles using `Card` per `contracts/dashboard-ui.md`
- [X] T010 [US1] Integrate `AnalyticsSummaryCards` into `client/src/pages/ArtistDashboardPage.tsx` above upload form with loading/error states

---

## Phase 4: User Story 2 — Earnings by Track (Priority: P1)

**Goal**: Per-track table with plays, downloads, and net earnings ranked by revenue

**Independent Test**: VS-402 — Performance by track section shows top 10 rows sorted by `netEarnings` DESC

- [X] T011 [US2] Extend `getDashboard()` in `api/src/modules/analytics/analytics.service.ts` to return `topTracks` (join tracks + earnings, limit 10, sort by net earnings) per data-model.md
- [X] T012 [US2] Create `client/src/components/analytics/TrackEarningsTable.tsx` with columns Track / Plays / Downloads / Net earnings per `contracts/dashboard-ui.md`
- [X] T013 [US2] Add `TrackEarningsTable` to `client/src/pages/ArtistDashboardPage.tsx` using `topTracks` from `useAnalyticsDashboard()`

---

## Phase 5: User Story 3 — Earnings Timeline (Priority: P2)

**Goal**: Daily net earnings for last 30 days (configurable 7–90) without chart libraries

**Independent Test**: VS-403 — timeline buckets sum to `totalNetEarnings` for selected window

- [X] T014 [US3] Implement `getEarningsTimeline(artistId, days)` in `api/src/modules/analytics/analytics.service.ts` using `DATE_TRUNC('day', created_at)` per research.md R2
- [X] T015 [US3] Add `GET /api/v1/analytics/earnings/timeline` with `days` query validation (7–90, default 30) to `api/src/modules/analytics/analytics.controller.ts`
- [X] T016 [P] [US3] Add `useEarningsTimeline(days?)` to `client/src/hooks/useAnalytics.ts`
- [X] T017 [US3] Create `client/src/components/analytics/EarningsTimeline.tsx` with CSS bar list or table (no chart library) per research.md R5
- [X] T018 [US3] Add `EarningsTimeline` to `client/src/pages/ArtistDashboardPage.tsx` between summary cards and track table per `contracts/dashboard-ui.md` layout order

---

## Phase 6: User Story 4 — Unique Supporters (Priority: P3)

**Goal**: Distinct buyer count visible and correct

**Independent Test**: VS-401/VS-404 — duplicate purchases by same user count once; zero when no earnings

- [X] T019 [US4] Verify `COUNT(DISTINCT earnings.user_id)` in summary aggregation in `api/src/modules/analytics/analytics.service.ts` and add `ForbiddenException` when JWT lacks `artistId`
- [X] T020 [US4] Format Supporters card with locale grouping and zero empty-state in `client/src/components/analytics/AnalyticsSummaryCards.tsx`

---

## Phase 7: Polish & Cross-Cutting

- [X] T021 Run migration 005 via project TypeORM command and confirm index exists on `earnings`
- [X] T022 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T023 Document VS-401–VS-404 validation results in `specs/005-artist-analytics/quickstart.md`
- [X] T024 Regression-check upload form and track list still work on `client/src/pages/ArtistDashboardPage.tsx` (SC-405)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
- US2 extends same dashboard endpoint/service started in US1 — Phase 4 depends on Phase 3
- US3 timeline endpoint is independent of US2 client work — API timeline (T014–T015) could parallelize with US2 UI after Phase 3 API exists
- Phase 6 mostly validates US1 summary fields; can run after Phase 3

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Migration vs seed script |
| Foundational | T004 | DTOs parallel to T003 after module file exists |
| US1 client | T008 | Hook parallel to T006–T007 if API contract is fixed |
| US3 client | T016 | Timeline hook parallel to T014–T015 |

### Suggested MVP scope

Phases 1–3 (summary only) — **10 tasks** (T001–T010)

Delivers dashboard summary API + summary cards; `topTracks` may return `[]` until Phase 4.

### Full feature

All phases — **24 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Summary | VS-401 | T006–T010 |
| US2 Per-track | VS-402 | T011–T013 |
| US3 Timeline | VS-403 | T014–T018 |
| US4 Supporters | VS-401, VS-404 | T019–T020 |
| Auth / regression | VS-404, SC-405 | T019, T024 |

---

## Notes

- Reuse `Earnings` entity from `api/src/modules/payments/entities/earnings.entity.ts` — no schema changes beyond index
- Monetary values: round to 2 decimals in service before JSON response
- Do not add Recharts/Chart.js (research.md R5)
