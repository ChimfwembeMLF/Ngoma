# Contract: Analytics API

**Base path**: `/api/v1/analytics`  
**Auth**: Bearer JWT, role `ARTIST`  
**Scope**: All data filtered by `artistId` from token

---

## GET /dashboard

**Summary**: Artist performance summary and top tracks by net earnings.

**Guards**: `JwtAuthGuard`, `RolesGuard`, `@Roles(ARTIST)`

**Response 200**:

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalNetEarnings": 3502.0,
      "totalPlatformFees": 389.11,
      "totalPlays": 45678,
      "totalDownloads": 2345,
      "publishedTrackCount": 6,
      "uniqueSupporters": 42,
      "currency": "ZMW"
    },
    "topTracks": [
      {
        "trackId": "uuid",
        "title": "Track 1",
        "plays": 1200,
        "downloads": 567,
        "netEarnings": 2835.0,
        "pricingType": "SET_PRICE"
      }
    ]
  }
}
```

**Errors**:
- `401` — missing/invalid token
- `403` — not ARTIST or missing `artistId` on token

**Sorting**: `topTracks` ordered by `netEarnings` DESC, limit 10.

---

## GET /earnings/timeline

**Summary**: Daily net earnings buckets for chart/table display.

**Query params**:

| Param | Type | Default | Validation |
|-------|------|---------|------------|
| days | number | 30 | 7–90 inclusive |

**Guards**: Same as dashboard.

**Response 200**:

```json
{
  "success": true,
  "data": {
    "days": 30,
    "totalNetEarnings": 1245.0,
    "buckets": [
      { "date": "2026-07-01", "netEarnings": 0 },
      { "date": "2026-07-18", "netEarnings": 50.0 }
    ]
  }
}
```

**Notes**:
- Include days with zero earnings OR omit zeros — implementation may omit for brevity; client handles sparse series
- Dates in artist-local or UTC date string (ISO `YYYY-MM-DD`); document UTC in implement phase

**Errors**:
- `400` — invalid `days` param
- `401` / `403` — same as dashboard

---

## Swagger

- Tag: `Analytics`
- Bearer auth documented on both routes

---

## Non-goals (this feature)

- `GET /analytics/fans` — not implemented
- `GET /analytics/download` — not implemented
