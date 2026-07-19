# Contract: Listener Dashboard UI

**Feature**: 016-dashboard-enhancements  
**Route**: `/dashboard`

## Layout

```text
┌─────────────────────────────────────────────────────────┐
│ Welcome back, {firstName}                    [Sign out] │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                 │
│ │ Playlists│ │ Purchases│ │ (role)   │  StatCard row   │
│ └──────────┘ └──────────┘ └──────────┘                 │
├─────────────────────────────────────────────────────────┤
│ Quick actions — Discover | My playlists | Purchases     │
├─────────────────────────────────────────────────────────┤
│ Recent purchases (max 5)              [View all →]      │
├─────────────────────────────────────────────────────────┤
│ Role highlight (admin tools OR artist snapshot)         │
└─────────────────────────────────────────────────────────┘
```

## Components

| Component | Path | Usage |
|-----------|------|-------|
| `StatCard` | `components/dashboard/StatCard.tsx` | Playlist count, purchase count |
| `QuickActionGrid` | `components/dashboard/QuickActionGrid.tsx` | Icon + label link cards |
| `RecentPurchases` | `components/dashboard/RecentPurchases.tsx` | Wraps payment history hook |

## Stat cards (listener)

| Label | Source |
|-------|--------|
| Playlists | `useMyPlaylists().data.length` |
| Purchases | `usePaymentHistory().pagination.total` or data length |

## Quick actions

| Label | Route |
|-------|-------|
| Discover music | `/discover` |
| My playlists | `/playlists` |
| Purchase history | `/purchases` |

## Role highlights

**ADMIN**: Card with links to `/admin`, `/admin/users`, `/admin/theme`, `/admin/branding`

**ARTIST**: Card showing net earnings snippet (optional `useAnalyticsDashboard` when artist) + link `/artist/dashboard`

**LISTENER**: Optional "Start exploring" CTA if no purchases

## Typography

- Page h1: `text-[28px] font-bold` (match Discover)
- Section h2: `text-xl font-semibold`
- Stat value: `text-2xl font-bold`

## Shell

`AppShell maxWidth="6xl"`

## Empty states

- No purchases: "No purchases yet — browse Discover"
- No playlists: "Create your first playlist"
