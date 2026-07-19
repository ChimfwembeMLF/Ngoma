# Research: 016-dashboard-enhancements

**Date**: 2026-07-19

## R1: Current dashboard baseline

**Decision**: Three surfaces to enhance:
- `/dashboard` — profile + links only (no stats)
- `/artist/dashboard` — analytics from 005 but list-based chart, no trends
- Admin — scattered pages, no `/admin` overview

**Rationale**: User said "enhance the dashboards" (plural); PROJECT REQUIREMENTS defines rich artist + admin dashboards.

**Alternatives considered**:
- Artist-only scope — rejected; listener and admin gaps too large

---

## R2: Period-over-period trends

**Decision**: Compare **last 30 UTC days** vs **previous 30 UTC days** for artist metrics (earnings, plays, downloads). Return `{ current, previous, changePercent }` per metric from API.

**Rationale**: Matches wireframe "▲ 23% vs last month" without full month-calendar complexity.

**Alternatives considered**:
- Calendar month boundaries — rejected; edge cases near month start
- Client-only trend calc — rejected; needs historical aggregates server-side

---

## R3: Chart rendering without new dependencies

**Decision**: `MiniBarChart` component — flex/grid of `div` bars with `height` proportional to value, labels on x-axis. Used by artist earnings and admin revenue timeline.

**Rationale**: Constitution simplicity; EarningsTimeline already uses horizontal bars — upgrade to vertical mini chart for dashboard polish.

**Alternatives considered**:
- recharts / chart.js — rejected; new dependency for MVP
- Pure table — rejected; user wants enhanced visual dashboards

---

## R4: Admin platform KPIs

**Decision**: New `GET /api/v1/admin/dashboard` aggregating:
- `totalUsers`, `totalTracks`, `activeArtists` (artists with ≥1 published track)
- `platformFees` (sum `earnings.platform_fee`), `totalTransactions` (completed payments count)
- `trends` — 30d vs prior 30d for users/tracks/revenue
- `revenueTimeline` — daily platform fees last 30 days
- `recentActivity` — last 10 events (user registered, track published, payment completed)

**Rationale**: §5.1.1 admin overview; reuses existing tables.

**Alternatives considered**:
- Separate microservice — rejected
- Embed in `/dashboard` only for admin — rejected; dedicated `/admin` overview is clearer

---

## R5: Listener dashboard data sources

**Decision**:
- Playlist count: existing `GET /api/v1/playlists/mine`
- Purchase count + recent: existing `GET /api/v1/payments/history?limit=5`
- Optional lightweight `GET /api/v1/users/me/summary` — **skip for MVP**; client composes from existing hooks

**Rationale**: Minimize API surface; two parallel TanStack queries on dashboard mount.

**Alternatives considered**:
- New listener summary endpoint — deferred unless waterfall loading is poor

---

## R6: Tips on artist dashboard

**Decision**: Add `tipsTotal` and `tipsCount` to analytics dashboard response via join on tips table (artist receives tips).

**Rationale**: Tips section exists but no summary stat; FR-1604 requirement.

---

## R7: Layout width

**Decision**: Listener and artist dashboards use `AppShell maxWidth="6xl"`; admin overview uses `6xl` with 4-column KPI grid on lg+.

**Rationale**: More room for stat cards and charts; matches Discover admin pages.

---

## R8: Admin route

**Decision**: New route `/admin` → `AdminOverviewPage`; keep `/admin/users`, `/admin/theme`, `/admin/branding` as sub-pages. Add "Overview" link in admin nav headers.

**Rationale**: §5.1.1 tabbed admin with Overview first.

---

## R9: Backward compatibility

**Decision**: Extend analytics dashboard response with optional `trends` and `tips` objects — existing fields unchanged.

**Rationale**: SC-1604 zero regression for summary/topTracks consumers.
