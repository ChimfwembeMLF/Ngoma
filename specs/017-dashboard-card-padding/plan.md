# Implementation Plan: Dashboard Card Padding Fix

**Branch**: `017-dashboard-card-padding` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-dashboard-card-padding/spec.md`

## Summary

Fix missing horizontal padding on dashboard cards introduced in 016. Root cause: content rendered directly on shadcn `Card` (vertical padding only) without `CardContent` (horizontal padding). Wrap dashboard component bodies in `CardContent`; normalize chart/table wrappers to use design tokens instead of ad-hoc `p-4`.

## Technical Context

**Language/Version**: TypeScript, React 18, Vite, Tailwind CSS v4 + shadcn/ui

**Primary Dependencies**: Existing `Card`, `CardContent` from `client/src/components/ui/card.tsx`

**Storage**: None

**Testing**: Manual VS-1701–VS-1703; client lint/build

**Target Platform**: Web SPA (client-only)

**Project Type**: Yarn monorepo — `client/src/components/dashboard/`, `client/src/components/analytics/`, dashboard pages

**Constraints**:
- Do NOT add horizontal padding to global `Card` root
- Use `--card-spacing` tokens via `CardContent`
- Smallest correct diff — no new wrapper components

**Scale/Scope**: ~8 files, ~20 lines changed

**Reference**: `specs/016-dashboard-enhancements/`, `client/DESIGN.md`, `client/src/components/ui/card.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Client-only — no API module changes
- [x] No alternate frontend roots
- [x] No database or migration work
- [x] Reuses shadcn Card composition pattern
- [x] Smallest diff — scoped to dashboard components

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/017-dashboard-card-padding/
├── plan.md              # This file
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── dashboard-card-padding-ui.md
└── tasks.md             # (/speckit-tasks — not created by /speckit-plan)
```

### Source Code (repository root)

```text
client/src/
├── components/
│   ├── dashboard/
│   │   ├── StatCard.tsx          # wrap in CardContent
│   │   ├── QuickActionGrid.tsx   # wrap in CardContent
│   │   ├── ActivityFeed.tsx      # wrap in CardContent
│   │   └── RecentPurchases.tsx   # wrap in CardContent
│   ├── analytics/
│   │   ├── EarningsTimeline.tsx  # CardContent for chart
│   │   └── TrackEarningsTable.tsx # CardContent for table
│   └── ui/
│       └── card.tsx              # read-only reference — no changes
└── pages/
    ├── ArtistDashboardPage.tsx   # tips card CardContent
    └── AdminOverviewPage.tsx     # chart CardContent
```

**Structure Decision**: Fix at shared component layer so all three dashboards inherit correct padding without per-page duplication.

## Complexity Tracking

> No constitution violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0: Research (complete)

See [research.md](./research.md):
- Root cause: Card vs CardContent padding split
- Fix: wrap dashboard content in CardContent
- Scope: dashboard components only

## Phase 1: Design (complete)

See:
- [data-model.md](./data-model.md) — component composition table
- [contracts/dashboard-card-padding-ui.md](./contracts/dashboard-card-padding-ui.md) — padding contract
- [quickstart.md](./quickstart.md) — VS-1701–VS-1703 validation

## Implementation Notes (for /speckit-tasks)

Suggested task breakdown:
1. Fix shared `components/dashboard/*` (StatCard, QuickActionGrid, ActivityFeed, RecentPurchases)
2. Fix analytics wrappers (EarningsTimeline, TrackEarningsTable)
3. Fix page-level cards (ArtistDashboardPage tips, AdminOverviewPage chart)
4. Lint/build + visual validation per quickstart

**Estimated effort**: 1 phase, ~6 tasks, no API work.
