# Research: 017-dashboard-card-padding

**Date**: 2026-07-19

## R1: Root cause of missing horizontal padding

**Decision**: Dashboard cards (016) place content directly on `<Card>` without `<CardContent>`. The shadcn `Card` root only applies **vertical** padding (`py-(--card-spacing)`); **horizontal** padding lives on `CardContent` (`px-(--card-spacing)`).

**Rationale**: Inspecting `client/src/components/ui/card.tsx`:
- `Card` → `py-(--card-spacing)` only
- `CardContent` → `px-(--card-spacing)`

Affected files:
- `StatCard.tsx`, `QuickActionGrid.tsx`, `ActivityFeed.tsx`, `RecentPurchases.tsx`
- `TrackEarningsTable.tsx` (table flush to edges)
- `EarningsTimeline.tsx`, `AdminOverviewPage.tsx` (use ad-hoc `className="p-4"` — inconsistent with token)

**Alternatives considered**:
- Add `px` to global `Card` root — rejected; breaks full-bleed patterns and doubles padding where `CardContent` already used
- Hardcode `p-4` on each dashboard card — rejected; bypasses `--card-spacing` size tokens

---

## R2: Fix strategy

**Decision**: Wrap inner content with `CardContent` in shared dashboard components. For chart/table wrappers, use `Card` + `CardContent` and remove redundant `p-4` overrides where they duplicate token spacing.

**Rationale**: Matches shadcn composition model used elsewhere; single fix point in `components/dashboard/` propagates to all three dashboards.

**Alternatives considered**:
- New `DashboardCard` wrapper — rejected; unnecessary abstraction for one-line `CardContent` usage
- CSS fix on `[data-slot=card]` globally — rejected (constitution simplicity + regression risk)

---

## R3: Padding token values

**Decision**: Use existing tokens — no new CSS variables.

| Card size | `--card-spacing` | Approx padding |
|-----------|------------------|----------------|
| `default` | `--spacing(4)` | 16px |
| `sm` | `--spacing(3)` | 12px |

Dashboard components use `size="sm"` → 12px all sides when `CardContent` is used.

**Rationale**: Aligns with DESIGN.md “Standard (6px) album cards” scaled up for dashboard density; matches shadcn sm card variant.

---

## R4: Scope boundaries

**Decision**: Fix dashboard-related components only; leave `DashboardPage` highlight cards that already use explicit `p-6` unchanged unless they show the same flush-edge issue.

**Rationale**: Role highlight cards on `/dashboard` already set `className="p-6"`. Artist tips list in `ArtistDashboardPage` uses `Card size="sm"` without content wrapper — include in fix.

**Out of scope**:
- API changes
- MediaCard / TrackCard / PlaylistCard (already padded via `MediaCardContent`)
- Global Card component redesign

---

## R5: Validation approach

**Decision**: Manual visual check on three routes + client build. No new test files unless requested.

**Rationale**: Pure CSS/layout fix; visual regression is the acceptance signal per spec SC-1701.
