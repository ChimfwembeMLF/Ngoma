# Data Model: 016-dashboard-enhancements

**Feature**: Dashboard enhancements

## Database Changes

**None** — aggregate queries on existing entities.

## Entities Used

| Entity | Dashboard use |
|--------|----------------|
| `User` | Admin: total users, recent signups |
| `Track` | Admin: total tracks; artist: plays/downloads aggregates |
| `Earnings` | Artist/admin: net earnings, platform fees, timelines |
| `Payment` | Listener: recent purchases; admin: transaction counts |
| `Tip` | Artist: tips total/count |
| `Playlist` | Listener: playlist count (via playlists API) |

## API Response Models

### Artist dashboard extension (`GET /analytics/dashboard`)

```typescript
type MetricTrend = {
  current: number;
  previous: number;
  changePercent: number | null; // null when previous === 0
};

type ArtistDashboardData = {
  summary: AnalyticsSummary; // existing
  topTracks: TrackPerformance[]; // existing
  trends: {
    netEarnings: MetricTrend;
    plays: MetricTrend;
    downloads: MetricTrend;
  };
  tips: {
    totalAmount: number;
    count: number;
    currency: 'ZMW';
  };
};
```

### Admin dashboard (`GET /admin/dashboard`)

```typescript
type AdminDashboardData = {
  kpis: {
    totalUsers: number;
    totalTracks: number;
    activeArtists: number;
    platformFees: number;
    completedTransactions: number;
    currency: 'ZMW';
  };
  trends: {
    users: MetricTrend;
    tracks: MetricTrend;
    platformFees: MetricTrend;
  };
  revenueTimeline: {
    days: 30;
    buckets: { date: string; platformFees: number }[];
  };
  recentActivity: ActivityItem[];
};

type ActivityItem = {
  id: string;
  type: 'USER_REGISTERED' | 'TRACK_PUBLISHED' | 'PAYMENT_COMPLETED';
  label: string;
  occurredAt: string;
};
```

### Listener dashboard (client-composed)

No new API entity — aggregates from:
- `useAuth` / me
- `useMyPlaylists` → `playlistCount`
- `usePaymentHistory({ limit: 5 })` → recent + total from pagination

## Query Windows

| Metric | Current window | Previous window |
|--------|----------------|-----------------|
| Artist trends | Last 30 UTC days | Days 31–60 UTC |
| Admin trends | Last 30 UTC days | Days 31–60 UTC |
| Timelines | Last N days (7/30/90 artist; 30 admin) | — |

## No State Transitions

Read-only aggregates and display.
