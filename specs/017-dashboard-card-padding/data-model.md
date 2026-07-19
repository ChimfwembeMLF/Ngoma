# Data Model: 017-dashboard-card-padding

**Feature**: Dashboard card padding fix

## Database Changes

**None** — client-only UI fix.

## UI Composition Model

### Card padding layers (existing shadcn)

```text
Card (root)
├── py-(--card-spacing)     ← vertical only
└── CardContent
    └── px-(--card-spacing) ← horizontal
```

### Dashboard components (target state)

| Component | Path | Fix |
|-----------|------|-----|
| `StatCard` | `components/dashboard/StatCard.tsx` | Wrap body in `CardContent` |
| `QuickActionGrid` | `components/dashboard/QuickActionGrid.tsx` | Wrap body in `CardContent` |
| `ActivityFeed` | `components/dashboard/ActivityFeed.tsx` | Wrap body in `CardContent` |
| `RecentPurchases` | `components/dashboard/RecentPurchases.tsx` | Wrap list item body in `CardContent` |
| `EarningsTimeline` | `components/analytics/EarningsTimeline.tsx` | Replace bare `p-4` with `CardContent` |
| `TrackEarningsTable` | `components/analytics/TrackEarningsTable.tsx` | Wrap table in `CardContent` |
| Artist tips row | `pages/ArtistDashboardPage.tsx` | Wrap tip card body in `CardContent` |
| Admin revenue chart | `pages/AdminOverviewPage.tsx` | Use `CardContent` for chart area |

### Spacing tokens (no changes)

```css
/* Card sm variant */
--card-spacing: --spacing(3);  /* ~12px */
```

## No State Transitions

Presentational layout fix only.
