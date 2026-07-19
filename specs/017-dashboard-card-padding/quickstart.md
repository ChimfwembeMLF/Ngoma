# Quickstart: 017-dashboard-card-padding

**Purpose**: Validate dashboard card padding is consistent on all dashboard routes.

**Prerequisites**:
- Client dev server on **5173**
- Feature 016 dashboards implemented (listener, artist, admin)

---

## Run client

```bash
yarn workspace @ngoma/client dev
```

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1701 | PASS (build) | `StatCard` wraps loaded + skeleton states in `CardContent` |
| VS-1702 | PASS (build) | QuickActionGrid, ActivityFeed, RecentPurchases, EarningsTimeline, TrackEarningsTable, tips + admin chart use `CardContent` |
| VS-1703 | PASS | `card.tsx` unchanged; `MediaCard.tsx` untouched |

**Build**: `@ngoma/client` lint + build OK (pre-existing warnings only).

---

## Validation Scenarios

### VS-1701: Stat card padding

1. Sign in → open `/dashboard`
2. Inspect playlist/purchase stat cards
3. **Expected**: Label and value text inset from all four edges; no flush-left text

4. Sign in as artist → `/artist/dashboard`
5. **Expected**: All 6 KPI stat cards have matching inset

6. Sign in as admin → `/admin`
7. **Expected**: Platform KPI cards have inset; trend badges not touching card border

### VS-1702: Widget card padding

1. On `/dashboard` — check quick action cards and recent purchase rows
2. **Expected**: Horizontal padding on all widget cards

3. On `/admin` — check activity feed items and revenue chart card
4. **Expected**: Activity labels inset; chart has balanced padding

5. On `/artist/dashboard` — check earnings chart and track earnings table
6. **Expected**: Table columns inset from card left edge; chart not flush to border

### VS-1703: Regression (non-dashboard)

1. Open `/discover` — track/playlist media cards unchanged (full-bleed cover)
2. Open `/playlists` — playlist grid cards unchanged

---

## Build check

```bash
yarn workspace @ngoma/client lint
yarn workspace @ngoma/client build
```

**Expected**: Pass with no new errors.

---

## Contract reference

- [dashboard-card-padding-ui.md](./contracts/dashboard-card-padding-ui.md)
