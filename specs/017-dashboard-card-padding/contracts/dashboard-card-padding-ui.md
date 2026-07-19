# Contract: Dashboard Card Padding UI

**Feature**: 017-dashboard-card-padding

## Rule

All dashboard stat and widget cards MUST compose shadcn Card as:

```tsx
<Card size="sm">
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

Do **not** put text directly on `<Card>` without `CardContent`.

## Padding specification

| Element | Horizontal | Vertical |
|---------|------------|----------|
| `Card` root | none (by design) | `py-(--card-spacing)` |
| `CardContent` | `px-(--card-spacing)` | inherits from parent gap |
| `size="sm"` token | 12px (`--spacing(3)`) | 12px |

## Components in scope

| Component | Route(s) |
|-----------|----------|
| `StatCard` | `/dashboard`, `/artist/dashboard`, `/admin` |
| `QuickActionGrid` | `/dashboard`, `/admin` |
| `RecentPurchases` | `/dashboard` |
| `ActivityFeed` | `/admin` |
| `EarningsTimeline` chart wrapper | `/artist/dashboard` |
| `TrackEarningsTable` | `/artist/dashboard` |
| Artist recent tips card | `/artist/dashboard` |

## Anti-patterns (do not use)

```tsx
// ❌ Missing horizontal padding
<Card size="sm">
  <div>{label}</div>
</Card>

// ❌ Ad-hoc padding bypassing tokens (unless additive for chart gutters)
<Card size="sm" className="p-4">...</Card>
```

## Allowed exceptions

- Cards with explicit full padding for section containers: `Card className="p-6"` on role highlight panels (already correct).
- Media cards with full-bleed covers (`MediaCard` + `MediaCardCover`).

## Visual acceptance

- Text and badges inset ≥12px from left/right card border on sm cards.
- Top/bottom padding visually matches left/right (balanced inset).
- Loading skeleton cards in `StatCard` use same `CardContent` wrapper.
