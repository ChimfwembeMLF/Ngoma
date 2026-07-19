# Tasks: Dashboard Enhancements

**Input**: Design documents from `/specs/016-dashboard-enhancements/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `005-artist-analytics`, `009-shadcn-spotify-redesign`, existing `/dashboard`, `/artist/dashboard`, admin pages

**Tests**: Not requested in spec — manual VS-1601–VS-1605 only.

---

## Phase 1: Setup — Verify Dashboard Baseline

**Purpose**: Confirm extension points before enhancement work

- [X] T001 Verify existing files: `client/src/pages/DashboardPage.tsx`, `client/src/pages/ArtistDashboardPage.tsx`, `client/src/components/analytics/AnalyticsSummaryCards.tsx`, `client/src/components/analytics/EarningsTimeline.tsx`, `api/src/modules/analytics/analytics.service.ts`, `api/src/modules/admin/admin.service.ts`
- [X] T002 [P] Review contracts: `specs/016-dashboard-enhancements/contracts/listener-dashboard-ui.md`, `contracts/artist-dashboard-ui.md`, `contracts/admin-dashboard-api.md`

---

## Phase 2: Foundational — Shared Dashboard Components (User Story 4 enabler)

**Purpose**: Reusable UI primitives — blocks all dashboard page work

**Independent Test**: VS-1604 (partial) — StatCard, TrendBadge, MiniBarChart render in isolation

- [X] T003 Create `StatCard` with label, value, loading skeleton in `client/src/components/dashboard/StatCard.tsx` per `contracts/listener-dashboard-ui.md`
- [X] T004 [P] Create `TrendBadge` for ▲/▼ percent display in `client/src/components/dashboard/TrendBadge.tsx` — positive primary, negative muted, null hidden
- [X] T005 [P] Create `MiniBarChart` vertical bar chart in `client/src/components/dashboard/MiniBarChart.tsx` per `contracts/artist-dashboard-ui.md` (no new chart library)
- [X] T006 [P] Create `QuickActionGrid` link cards in `client/src/components/dashboard/QuickActionGrid.tsx`
- [X] T007 [P] Create `ActivityFeed` list component in `client/src/components/dashboard/ActivityFeed.tsx` for admin recent activity items

**Checkpoint**: Shared dashboard components export from `client/src/components/dashboard/`

---

## Phase 3: User Story 2 — Artist Dashboard KPI Trends (Priority: P1)

**Goal**: Artist summary shows 30d trends, tips stat, and visual earnings chart

**Independent Test**: VS-1602 — Trend badges on KPI cards; MiniBarChart on earnings timeline

- [X] T008 Add `computeMetricTrend()` helper and 30d vs prior-30d trend queries in `api/src/modules/analytics/analytics.service.ts` for netEarnings, plays, downloads
- [X] T009 Register `Tip` entity in `api/src/modules/analytics/analytics.module.ts` and add `tips` aggregate (totalAmount, count) to `getDashboard()` in `api/src/modules/analytics/analytics.service.ts`
- [X] T010 Extend `GET /analytics/dashboard` response types in `client/src/hooks/useAnalytics.ts` with `trends` and `tips` fields per `contracts/admin-dashboard-api.md`
- [X] T011 [US2] Refactor `AnalyticsSummaryCards` in `client/src/components/analytics/AnalyticsSummaryCards.tsx` — use `StatCard` + `TrendBadge`; add tips stat card
- [X] T012 [US2] Refactor `EarningsTimeline` in `client/src/components/analytics/EarningsTimeline.tsx` to use `MiniBarChart` instead of horizontal bar list
- [X] T013 [US2] Update `ArtistDashboardPage` in `client/src/pages/ArtistDashboardPage.tsx` — `AppShell maxWidth="6xl"`, 6-column KPI grid layout per `contracts/artist-dashboard-ui.md`

**Checkpoint**: Artist dashboard shows trends and chart with seeded analytics data

---

## Phase 4: User Story 3 — Admin Platform Overview Dashboard (Priority: P1)

**Goal**: Admin `/admin` overview with platform KPIs, revenue timeline, activity feed

**Independent Test**: VS-1603 — Admin sees KPI cards, chart, activity at `/admin`

- [X] T014 Implement `getAdminDashboard()` in `api/src/modules/admin/admin.service.ts` — KPIs, trends, revenueTimeline (30d platform fees), recentActivity from users/tracks/payments per `contracts/admin-dashboard-api.md`
- [X] T015 Register required repos (`Track`, `Payment`, `Earnings`, etc.) in `api/src/modules/admin/admin.module.ts` if not already available for aggregates
- [X] T016 Add `GET /api/v1/admin/dashboard` in `api/src/modules/admin/admin.controller.ts` with Swagger docs
- [X] T017 [P] [US3] Create `useAdminDashboard()` hook in `client/src/hooks/useAdminDashboard.ts`
- [X] T018 [US3] Create `AdminOverviewPage` in `client/src/pages/AdminOverviewPage.tsx` — KPI StatCards with trends, MiniBarChart revenue timeline, ActivityFeed, quick links to Users/Theme/Branding
- [X] T019 [US3] Add route `/admin` with `AdminRoute` in `client/src/App.tsx`; redirect or keep `/admin/users` as sub-route

**Checkpoint**: Admin overview loads via API and displays platform stats

---

## Phase 5: User Story 1 — Listener Hub Dashboard (Priority: P1) 🎯 MVP

**Goal**: `/dashboard` becomes personal hub with stats, quick actions, recent purchases

**Independent Test**: VS-1601 — Welcome, stat cards, quick actions, recent purchases

- [X] T020 [P] [US1] Create `RecentPurchases` widget in `client/src/components/dashboard/RecentPurchases.tsx` using `usePaymentHistory()` from `client/src/hooks/usePayments.ts` (limit 5)
- [X] T021 [US1] Refactor `DashboardPage` in `client/src/pages/DashboardPage.tsx` — welcome header, StatCards (playlists via `useMyPlaylists`, purchases count), QuickActionGrid, RecentPurchases, `AppShell maxWidth="6xl"` per `contracts/listener-dashboard-ui.md`

**Checkpoint**: Listener dashboard is a useful post-login hub (MVP with Phase 2 components)

---

## Phase 6: User Story 5 — Role-Aware Dashboard Highlights (Priority: P2)

**Goal**: `/dashboard` shows admin overview CTA or artist earnings snapshot by role

**Independent Test**: VS-1605 — Admin sees `/admin` card; artist sees artist dashboard CTA

- [X] T022 [US5] Add admin highlight card on `DashboardPage` in `client/src/pages/DashboardPage.tsx` — prominent link to `/admin` plus existing admin tool links
- [X] T023 [US5] Add artist highlight card on `DashboardPage` — optional `useAnalyticsDashboard()` when `role === ARTIST`; show net earnings snippet + link to `/artist/dashboard`

**Checkpoint**: Role-specific highlights on main dashboard

---

## Phase 7: Navigation & Admin Cross-Links

**Purpose**: Wire admin overview into existing admin pages and dashboard nav

- [X] T024 [P] Add "Overview" link to `/admin` in `client/src/pages/AdminUsersPage.tsx`, `client/src/pages/AdminThemePage.tsx`, `client/src/pages/AdminBrandingPage.tsx`, and `AdminOverviewPage.tsx` nav
- [X] T025 [P] Add `/admin` link on `DashboardPage` admin section (if not covered by T022) and verify `AdminRoute` redirect for non-admin

---

## Phase 8: Polish & Cross-Cutting

- [X] T026 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T027 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T028 Validate VS-1601–VS-1605 from `specs/016-dashboard-enhancements/quickstart.md` with `seed-analytics.sql`; document results in quickstart.md
- [X] T029 Regression-check existing `GET /analytics/dashboard` still returns `summary` + `topTracks` unchanged for clients without trend fields
- [X] T030 Verify mobile responsive grids (1 → 2 → 4 columns) on listener, artist, and admin dashboards

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (shared components) → Phase 3 (US2 API+artist) + Phase 4 (US3 admin) can parallel after Phase 2
- Phase 5 (US1 listener) depends on Phase 2 StatCard, QuickActionGrid, RecentPurchases
- Phase 6 (US5) depends on Phase 5 DashboardPage refactor + Phase 3 artist analytics for artist snapshot
- Phase 7 after Phase 4 admin page exists
- Phase 8 last

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contracts |
| Shared UI | T004, T005, T006, T007 | After T003 StatCard shell |
| Artist API + hook | T008, T009, T010 | Backend trends/tips + client types |
| Admin client | T017, T018 | Hook + page after T014–T016 API |
| US1 widget | T020 | RecentPurchases parallel to admin client |
| Nav links | T024, T025 | Four admin page link updates |
| Polish | T026, T027 | API and client lint/build |

### Suggested MVP scope

Phases 1–2 + Phase 5 — **9 tasks** (T001–T007, T020–T021): shared components + listener hub

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational (shared UI) | 5 | US4 enabler |
| US2 Artist trends | 6 | P1 |
| US3 Admin overview | 6 | P1 |
| US1 Listener hub | 2 | P1 |
| US5 Role highlights | 2 | P2 |
| Navigation | 2 | — |
| Polish | 5 | — |
| **Total** | **30** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1601 | Listener hub with stats, actions, purchases |
| US2 | VS-1602 | Artist trends, tips, bar chart |
| US3 | VS-1603 | Admin overview KPIs + activity |
| US4 | VS-1604 | Shared StatCard/TrendBadge/MiniBarChart |
| US5 | VS-1605 | Role-aware highlights on `/dashboard` |

---

## Implementation Strategy

### MVP First (Listener hub)

1. Complete Phase 1–2 (shared components)
2. Complete Phase 5 (listener dashboard)
3. **STOP and VALIDATE**: VS-1601 on `/dashboard`
4. Continue artist trends (US2) → admin overview (US3) → role highlights (US5)

### Incremental Delivery

1. Shared dashboard components → consistent UI foundation
2. Listener hub → immediate post-login value
3. Artist KPI trends + chart → artist transparency
4. Admin overview → platform visibility
5. Role highlights + nav polish + regression

---

## Notes

- Extend analytics response additively — do not break `summary` / `topTracks` shape (SC-1604)
- Tips aggregate: query `tips` table by `artist_id` via AnalyticsModule TypeORM import
- Admin activity feed: merge last N users, published tracks, completed payments — cap at 10 items
- `usePaymentHistory` may need `limit` param support — extend hook if pagination not exposed
- No new npm chart dependencies (NFR-1602)
