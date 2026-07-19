# Quickstart: 016-dashboard-enhancements

**Purpose**: Validate enhanced listener, artist, and admin dashboards.

**Prerequisites**:
- API **4001**, client **5173**
- `seed-demo-data.sql` + `seed-analytics.sql`
- Admin: `lufegoh@mailinator.com` / `password`
- Artist account with analytics seed data

---

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1601: Listener hub dashboard

1. Sign in as listener (or user without admin/artist role)
2. Open `/dashboard`
3. **Expected**: Welcome message, playlist/purchase stat cards, quick actions, recent purchases section
4. **Expected**: Empty states if no data — no errors

### VS-1602: Artist KPI trends and chart

1. Sign in as artist with seeded earnings
2. Open `/artist/dashboard`
3. **Expected**: Summary cards show trend badges (▲/▼ %)
4. **Expected**: Tips total stat visible
5. Toggle earnings 7d / 30d / 90d — **Expected**: vertical bar chart renders

### VS-1603: Admin overview

1. Sign in as admin → `/admin`
2. **Expected**: 4+ KPI cards (users, tracks, artists, platform fees)
3. **Expected**: Revenue timeline chart + recent activity list
4. **Expected**: Quick links to Users, Theme, Branding

```bash
TOKEN=$(curl -s -X POST http://localhost:4001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"lufegoh@mailinator.com","password":"password"}' | jq -r '.data.accessToken')

curl -s http://localhost:4001/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq '.data.kpis'
```

### VS-1604: Shared components

1. Inspect listener, artist, admin dashboards
2. **Expected**: Consistent stat card styling and loading skeletons

### VS-1605: Role-aware highlights

1. Admin on `/dashboard` — **Expected**: link/card to `/admin` overview
2. Artist on `/dashboard` — **Expected**: artist dashboard CTA with earnings hint

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1601 | PASS (build) | `/dashboard` refactored with welcome, stats, quick actions, recent purchases |
| VS-1602 | PASS (build) | Artist KPI grid + TrendBadge + MiniBarChart + tips stat implemented |
| VS-1603 | PASS (API) | `GET /admin/dashboard` returns KPIs, trends, 10 activity items (admin token) |
| VS-1604 | PASS (build) | Shared `StatCard`, `TrendBadge`, `MiniBarChart` used across dashboards |
| VS-1605 | PASS (build) | Admin + artist highlight cards on `/dashboard` |

**API smoke test** (admin):

```text
success True
kpis {'totalUsers': 4, 'totalTracks': 8, 'activeArtists': 2, 'platformFees': 4.5, ...}
activity_count 10
```

**Build**: `@ngoma/api` lint + build OK; `@ngoma/client` lint + build OK.

---

## Regression

- Existing analytics endpoints still return `summary` + `topTracks`
- `/admin/users`, `/admin/theme`, `/admin/branding` unchanged
- Artist upload and track list still work

---

## Contract references

- [listener-dashboard-ui.md](./contracts/listener-dashboard-ui.md)
- [artist-dashboard-ui.md](./contracts/artist-dashboard-ui.md)
- [admin-dashboard-api.md](./contracts/admin-dashboard-api.md)
