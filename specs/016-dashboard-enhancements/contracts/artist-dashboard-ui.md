# Contract: Artist Dashboard UI

**Feature**: 016-dashboard-enhancements  
**Route**: `/artist/dashboard`

## Layout (enhanced)

```text
┌─────────────────────────────────────────────────────────┐
│ Artist dashboard                         [Edit profile] │
├─────────────────────────────────────────────────────────┤
│ KPI row (6 cards on lg):                                │
│ Net earnings ▲ | Plays ▲ | Downloads ▲ | Supporters   │
│ Tips total | Published tracks                           │
├─────────────────────────────────────────────────────────┤
│ Earnings chart (MiniBarChart) — 7d / 30d / 90d          │
├─────────────────────────────────────────────────────────┤
│ Recent tips | Performance by track (existing table)     │
├─────────────────────────────────────────────────────────┤
│ Upload form | Your tracks list                          │
└─────────────────────────────────────────────────────────┘
```

## StatCard + TrendBadge

Each KPI stat card optionally shows `TrendBadge`:
- `changePercent > 0` → `▲ {n}%` green/primary
- `changePercent < 0` → `▼ {n}%` muted
- `null` → "—" or hidden when no prior data

**Trend source**: `data.trends.*` from extended analytics dashboard API.

## MiniBarChart

**Path**: `components/dashboard/MiniBarChart.tsx`

**Props**:

```typescript
type MiniBarChartProps = {
  buckets: { label: string; value: number }[];
  formatValue?: (n: number) => string;
  height?: number; // default 160
};
```

- Vertical bars in flex row, `align-items: flex-end`
- Bar: `bg-primary`, min height 2px when value > 0
- X labels rotated or truncated on mobile

**Used by**: Refactored `EarningsTimeline.tsx`

## Tips stat

- Label: "Tips received"
- Value: `ZMW {tips.totalAmount}`
- Subtext: `{tips.count} tips`

## Section order

1. `AnalyticsSummaryCards` (enhanced with trends + tips)
2. `EarningsTimeline` (chart upgrade)
3. Recent tips (unchanged structure)
4. Track earnings table
5. Upload + track list

## Shell

`AppShell maxWidth="6xl"`

## Loading

Shared skeleton from `StatCard` — 4–6 pulse cards matching grid.
