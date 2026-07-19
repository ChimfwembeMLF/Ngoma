# Tasks: Dashboard Card Padding Fix

**Input**: Design documents from `/specs/017-dashboard-card-padding/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `016-dashboard-enhancements` shared dashboard components

**Tests**: Not requested in spec — manual VS-1701–VS-1703 only.

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm affected files and padding contract before edits

- [X] T001 Verify dashboard component files exist per plan.md: `client/src/components/dashboard/StatCard.tsx`, `QuickActionGrid.tsx`, `ActivityFeed.tsx`, `RecentPurchases.tsx`, `client/src/components/analytics/EarningsTimeline.tsx`, `TrackEarningsTable.tsx`, `client/src/pages/ArtistDashboardPage.tsx`, `client/src/pages/AdminOverviewPage.tsx`
- [X] T002 [P] Review padding contract in `specs/017-dashboard-card-padding/contracts/dashboard-card-padding-ui.md` — Card + CardContent composition, no global Card root changes

---

## Phase 2: Foundational — CardContent Pattern

**Purpose**: Confirm shadcn Card padding split before component fixes

**⚠️ CRITICAL**: No user story work until CardContent pattern is understood

- [X] T003 Confirm `CardContent` provides `px-(--card-spacing)` and `Card` root provides only `py-(--card-spacing)` in `client/src/components/ui/card.tsx` — do NOT modify this file

**Checkpoint**: CardContent is the horizontal padding source for all dashboard fixes

---

## Phase 3: User Story 1 — Consistent Stat Card Spacing (Priority: P1) 🎯 MVP

**Goal**: Stat cards on `/dashboard`, `/artist/dashboard`, and `/admin` have balanced inset on all sides

**Independent Test**: VS-1701 — every `StatCard` shows visible horizontal padding matching vertical padding

- [X] T004 [US1] Wrap loaded and loading skeleton bodies in `CardContent` in `client/src/components/dashboard/StatCard.tsx` per `contracts/dashboard-card-padding-ui.md`

**Checkpoint**: Stat cards fixed on all three dashboard routes (StatCard is shared)

---

## Phase 4: User Story 2 — Dashboard Widget Cards Aligned (Priority: P1)

**Goal**: Quick actions, purchases, activity feed, charts, and tables use the same CardContent padding pattern

**Independent Test**: VS-1702 — no dashboard section has text flush against card left/right edges

- [X] T005 [P] [US2] Wrap quick action card body in `CardContent` in `client/src/components/dashboard/QuickActionGrid.tsx`
- [X] T006 [P] [US2] Wrap activity feed item body in `CardContent` in `client/src/components/dashboard/ActivityFeed.tsx`
- [X] T007 [P] [US2] Wrap recent purchase list item body in `CardContent` in `client/src/components/dashboard/RecentPurchases.tsx`
- [X] T008 [US2] Replace ad-hoc `className="p-4"` with `CardContent` wrapper in chart card in `client/src/components/analytics/EarningsTimeline.tsx`
- [X] T009 [P] [US2] Wrap table in `CardContent` in `client/src/components/analytics/TrackEarningsTable.tsx`
- [X] T010 [P] [US2] Wrap recent tips list item body in `CardContent` in `client/src/pages/ArtistDashboardPage.tsx`
- [X] T011 [US2] Replace ad-hoc `className="p-4"` with `CardContent` wrapper for revenue chart card in `client/src/pages/AdminOverviewPage.tsx`

**Checkpoint**: All dashboard widget and chart cards use design-token padding

---

## Phase 5: User Story 3 — No Regression on Non-Dashboard Cards (Priority: P2)

**Goal**: Media cards and other pages using existing Card patterns remain unchanged

**Independent Test**: VS-1703 — `/discover` and `/playlists` layouts unchanged; global `Card` untouched

- [X] T012 [US3] Verify `client/src/components/ui/card.tsx` has no root horizontal padding added (FR-1704)
- [X] T013 [P] [US3] Spot-check `client/src/components/ui/MediaCard.tsx` and discover/playlists pages — full-bleed covers and existing CardContent usage unchanged

**Checkpoint**: Fix scoped to dashboard components only

---

## Phase 6: Polish & Cross-Cutting

- [X] T014 Run `yarn workspace @ngoma/client lint`
- [X] T015 [P] Run `yarn workspace @ngoma/client build`
- [X] T016 Validate VS-1701–VS-1703 from `specs/017-dashboard-card-padding/quickstart.md`; document results in quickstart.md

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (CardContent pattern) → Phase 3 (US1 StatCard) → Phase 4 (US2 widgets)
- Phase 5 (US3 regression) can run after Phase 3 or in parallel with Phase 4 once StatCard is done
- Phase 6 last

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contract review |
| US2 widgets | T005, T006, T007, T009, T010 | Different files, no deps |
| US3 check | T012, T013 | After core fixes |
| Polish | T014, T015 | Lint + build |

### Suggested MVP scope

Phases 1–3 — **4 tasks** (T001–T004): StatCard fix propagates to all three dashboards

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 1 | — |
| US1 Stat cards | 1 | P1 |
| US2 Widget cards | 7 | P1 |
| US3 No regression | 2 | P2 |
| Polish | 3 | — |
| **Total** | **16** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1701 | Stat card horizontal inset on 3 routes |
| US2 | VS-1702 | Widget/chart/table cards padded consistently |
| US3 | VS-1703 | Discover/playlists unchanged |

---

## Implementation Strategy

### MVP First (Stat cards)

1. Complete Phase 1–2 (baseline + CardContent pattern)
2. Complete Phase 3 (StatCard only)
3. **STOP and VALIDATE**: VS-1701 on `/dashboard`, `/artist/dashboard`, `/admin`
4. Continue widget fixes (US2) → regression (US3) → polish

### Incremental Delivery

1. StatCard fix → immediate visible improvement on all dashboards
2. Widget/chart/table fixes → full dashboard consistency
3. Regression check → confirm no global Card side effects
4. Lint/build + quickstart validation

---

## Notes

- Import `CardContent` from `@/components/ui/card` in each fixed file
- Remove redundant `p-4` when `CardContent` provides token padding (avoid double padding)
- Do NOT change `client/src/components/ui/card.tsx` root styles
- Role highlight cards using explicit `className="p-6"` on `/dashboard` are already correct — leave unchanged
