# API Contracts: Google Ads Integration (026)

All existing endpoints are extended — no new routes needed for the backend. The public config endpoint gains one new field; the admin config endpoint gains one new writable field.

---

## Modified: GET /api/v1/platform/ads/config

**Auth**: None (public)  
**Purpose**: Returns the current platform ad configuration for fan-facing pages to consume.

### Response (extended)

```json
{
  "success": true,
  "data": {
    "adsEnabled": true,
    "gateSeconds": 30,
    "googleAdsEnabled": true
  }
}
```

| Field | Type | New? | Description |
|-------|------|------|-------------|
| `adsEnabled` | boolean | No | Master ads toggle |
| `gateSeconds` | number | No | Gate countdown seconds (default now 30) |
| `googleAdsEnabled` | boolean | **Yes** | Whether Google AdSense units should render |

---

## Modified: PUT /api/v1/admin/ads/config

**Auth**: Bearer JWT — Admin role required  
**Purpose**: Updates platform ad configuration.

### Request Body (extended)

```json
{
  "adsEnabled": true,
  "gateSeconds": 30,
  "googleAdsEnabled": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `adsEnabled` | boolean | No | Update master toggle |
| `gateSeconds` | number | No | Update gate countdown seconds |
| `googleAdsEnabled` | boolean | **No (new)** | Update Google Ads toggle |

### Response

Same shape as GET response above (returns updated config).

---

## Unchanged Endpoints

| Endpoint | Notes |
|----------|-------|
| `POST /api/v1/tracks/:id/ad-session` | Unchanged — creates gate session |
| `POST /api/v1/ad-sessions/:id/complete` | Unchanged — completes gate session |
| `GET /api/v1/admin/ads/creatives` | Unchanged |
| `POST /api/v1/admin/ads/creatives` | Unchanged |
| `PUT /api/v1/admin/ads/creatives/:id` | Unchanged |
| `DELETE /api/v1/admin/ads/creatives/:id` | Unchanged |

---

## Client Environment Interface

These are build-time configuration values consumed by the Vite client. Not REST endpoints — documented here as the external configuration contract.

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_ADSENSE_PUBLISHER_ID` | No | `ca-pub-1234567890123456` | AdSense publisher ID. If absent, all Google ad units are suppressed. |
| `VITE_ADSENSE_SLOT_GATE` | No | `1234567890` | Slot ID for the ad-gate modal rectangle unit |
| `VITE_ADSENSE_SLOT_DISCOVER` | No | `0987654321` | Slot ID for the Discover page leaderboard |
| `VITE_ADSENSE_SLOT_TRACK` | No | `1122334455` | Slot ID for the Track page rectangle |
| `VITE_ADSENSE_SLOT_ARTIST` | No | `5544332211` | Slot ID for the Artist Profile page leaderboard |

> All slot variables are optional. When absent, the corresponding `GoogleAdUnit` renders `null`. This allows incremental rollout (e.g., gate slot first, then discover, etc.).
