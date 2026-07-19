# Implementation Plan: Dashboard Enhancements

**Branch**: `016-dashboard-enhancements` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-dashboard-enhancements/spec.md`

## Summary

Upgrade **three dashboard surfaces**: enrich **listener `/dashboard`** into a personal hub; enhance **artist `/artist/dashboard`** with KPI trends, tips stat, and visual earnings chart; add **admin `/admin` overview** with platform KPIs, revenue timeline, and activity feed. Extend **analytics** and new **admin dashboard API**; introduce shared **`dashboard/` UI components**.

## Technical Context

**Language/Version**: TypeScript, Node 20+, React 18, Vite, NestJS 11

**Primary Dependencies**: TypeORM, TanStack Query, shadcn Card/Button, existing analytics module

**Storage**: PostgreSQL — aggregate queries on existing tables (no new entities for MVP)

**Testing**: Manual VS-1601–VS-1605; reuse `seed-analytics.sql`

**Target Platform**: Web SPA

**Project Type**: Yarn monorepo — `api/src/modules/analytics/`, `api/src/modules/admin/`, `client/src/pages/`, `client/src/components/dashboard/`

**Constraints**:
- No new chart library — SVG/CSS bar chart
- Extend existing analytics contract (backward compatible)
- Admin dashboard admin-only

**Scale/Scope**: 2 API endpoints extended/new, ~8 client components, 3 page refactors

**Reference**: `PROJECT REQUIREMENTS.md` §3.4.1, §5.1.1; `specs/005-artist-analytics/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] API in `api/src/modules/analytics/` and `api/src/modules/admin/`
- [x] Client in `client/src/pages/` and `client/src/components/dashboard/`
- [x] No new storage stack; TypeORM query aggregates only
- [x] Routes under `/api/v1/`, JwtAuthGuard + RolesGuard
- [x] TanStack Query for server state

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/016-dashboard-enhancements/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── listener-dashboard-ui.md
│   ├── artist-dashboard-ui.md
│   └── admin-dashboard-api.md
└── tasks.md
```

### Source Code (repository root)

```text
api/src/modules/analytics/
├── analytics.service.ts        # + trends, tipsTotal on dashboard
└── analytics.controller.ts

api/src/modules/admin/
├── admin.service.ts            # + getDashboardOverview()
└── admin.controller.ts         # + GET dashboard

client/src/
├── components/dashboard/
│   ├── StatCard.tsx
│   ├── TrendBadge.tsx
│   ├── QuickActionGrid.tsx
│   ├── MiniBarChart.tsx
│   ├── RecentPurchases.tsx
│   └── ActivityFeed.tsx
├── components/analytics/
│   └── EarningsTimeline.tsx    # REFACTOR to MiniBarChart
├── pages/
│   ├── DashboardPage.tsx       # REFACTOR listener hub
│   ├── ArtistDashboardPage.tsx # REFACTOR layout + trends
│   └── AdminOverviewPage.tsx   # NEW /admin
└── hooks/
    ├── useAnalytics.ts         # extend types
    └── useAdminDashboard.ts    # NEW
```

**Structure Decision**: Shared `components/dashboard/` for cross-role UI; keep analytics-specific tables in `components/analytics/`.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/listener-dashboard-ui.md](./contracts/listener-dashboard-ui.md)
- [contracts/artist-dashboard-ui.md](./contracts/artist-dashboard-ui.md)
- [contracts/admin-dashboard-api.md](./contracts/admin-dashboard-api.md)
- [quickstart.md](./quickstart.md)
