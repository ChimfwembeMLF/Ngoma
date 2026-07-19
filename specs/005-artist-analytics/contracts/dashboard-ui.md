# Contract: Artist Dashboard Analytics UI

**Route**: `/artist/dashboard` (`ArtistDashboardPage.tsx`)  
**Design system**: Reuse `DesignSystemLayout`, `Card`, muted/ink tokens from 003/004

---

## Layout order (top → bottom)

```text
[Header row]
  h1 "Artist dashboard"
  outline link "Edit profile"

[AnalyticsSummaryCards]  ← NEW (US1, US4)
  4-column grid (2 on mobile):
    - Net earnings (ZMW, 2 decimals)
    - Total downloads
    - Total plays
    - Unique supporters

[EarningsTimeline]       ← NEW (US3)
  h2 "Earnings (last 30 days)"
  Table or bar list from timeline API

[TrackEarningsTable]     ← NEW (US2)
  h2 "Performance by track"
  Columns: Track | Plays | Downloads | Net earnings

[TrackUploadForm]        ← existing

[Your tracks list]       ← existing
```

---

## AnalyticsSummaryCards

**Props**: `summary` from dashboard API

| Card | Label | Value format |
|------|-------|--------------|
| 1 | Net earnings | `ZMW {totalNetEarnings}` |
| 2 | Downloads | locale integer |
| 3 | Plays | locale integer |
| 4 | Supporters | `uniqueSupporters` |

**Loading**: skeleton or muted "Loading analytics…"  
**Error**: `Card` with `text-error` message; upload section still visible

---

## TrackEarningsTable

**Props**: `tracks: TrackAnalyticsRow[]`

| Column | Alignment | Style |
|--------|-----------|-------|
| Track title | left | `text-ink font-medium` |
| Plays | right | `text-muted` |
| Downloads | right | `text-muted` |
| Net earnings | right | `text-ink` |

Empty: "No track data yet."

---

## EarningsTimeline

**Props**: `buckets`, `days`

- Default fetch `days=30`
- Optional: select 7 / 30 / 90 (P2 polish — may defer to implement if time-boxed)
- Max bar width relative to max bucket value
- Show `totalNetEarnings` for period as caption

---

## Hooks

**File**: `client/src/hooks/useAnalytics.ts`

```typescript
useAnalyticsDashboard()  // GET /api/v1/analytics/dashboard
useEarningsTimeline(days?: number)  // GET /api/v1/analytics/earnings/timeline?days=
```

Query keys: `['analytics', 'dashboard']`, `['analytics', 'timeline', days]`

---

## Access control

- Page already behind `ProtectedRoute`; analytics hooks only called when user role is ARTIST (or silently skip for non-artists — dashboard is artist-only route today)

---

## Regression

- Upload form and track list unchanged below analytics sections
- PurchaseHistory and listener routes unaffected
