# Contract: Admin Dashboard API

**Feature**: 016-dashboard-enhancements

## GET /api/v1/admin/dashboard

**Auth**: JWT + `ADMIN` role

**Response 200**:

```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalUsers": 1234,
      "totalTracks": 567,
      "activeArtists": 89,
      "platformFees": 45678.0,
      "completedTransactions": 2345,
      "currency": "ZMW"
    },
    "trends": {
      "users": { "current": 45, "previous": 38, "changePercent": 18.4 },
      "tracks": { "current": 12, "previous": 10, "changePercent": 20.0 },
      "platformFees": { "current": 1200.0, "previous": 980.0, "changePercent": 22.4 }
    },
    "revenueTimeline": {
      "days": 30,
      "buckets": [
        { "date": "2026-07-01", "platformFees": 120.5 }
      ]
    },
    "recentActivity": [
      {
        "id": "uuid-or-composite",
        "type": "PAYMENT_COMPLETED",
        "label": "Payment ZMW 15.00 completed",
        "occurredAt": "2026-07-19T10:00:00.000Z"
      }
    ]
  }
}
```

**KPI definitions**:
- `totalUsers` — all users
- `totalTracks` — active tracks
- `activeArtists` — distinct artists with ≥1 published active track
- `platformFees` — lifetime sum `earnings.platform_fee`
- `completedTransactions` — count payments `status = COMPLETED`

**Trend definitions** (30d vs prior 30d):
- `users.current` — users created in last 30 days
- `tracks.current` — tracks created in last 30 days
- `platformFees.current` — sum platform fees in last 30 days

**Activity feed**: Up to 10 items, merged from recent users, published tracks, completed payments — sorted by `occurredAt` DESC.

**Errors**: 401, 403

---

## Extended GET /api/v1/analytics/dashboard

**Additive fields** (existing `summary`, `topTracks` unchanged):

```json
{
  "trends": {
    "netEarnings": { "current": 500, "previous": 400, "changePercent": 25.0 },
    "plays": { "current": 1200, "previous": 900, "changePercent": 33.3 },
    "downloads": { "current": 50, "previous": 45, "changePercent": 11.1 }
  },
  "tips": {
    "totalAmount": 250.0,
    "count": 8,
    "currency": "ZMW"
  }
}
```

See `specs/005-artist-analytics/contracts/analytics-api.md` for base contract.

---

## Service placement

| Method | File |
|--------|------|
| `getAdminDashboard()` | `api/src/modules/admin/admin.service.ts` |
| `buildArtistTrends()` | `api/src/modules/analytics/analytics.service.ts` |

## Client hooks

| Hook | Endpoint |
|------|----------|
| `useAdminDashboard()` | `GET /api/v1/admin/dashboard` |
| `useAnalyticsDashboard()` | extended response types |
