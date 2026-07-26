# Data Model: Ad-Supported Free Track Downloads

**Feature**: 023-ad-supported-free-downloads

---

## New Entities

### AdCreative (`ad_creatives`)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| title | VARCHAR(200) | Admin label |
| image_url | VARCHAR(500) | Banner image (via media upload) |
| click_url | VARCHAR(500) NULL | Optional outbound link |
| is_active | BOOLEAN | Default true |
| sort_order | INT | Display priority |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

---

### AdSession (`ad_sessions`)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | Returned to client |
| track_id | UUID FK → tracks | |
| user_id | UUID FK → users | |
| creative_id | UUID FK → ad_creatives NULL | Assigned creative |
| status | VARCHAR(20) | `PENDING` \| `COMPLETED` \| `EXPIRED` |
| expires_at | TIMESTAMPTZ | created + 2 min |
| completed_at | TIMESTAMPTZ NULL | |
| created_at | TIMESTAMPTZ | |

**Indexes**: `(user_id, track_id, status)`, `(expires_at)`

---

### AdImpression (`ad_impressions`)

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| session_id | UUID FK → ad_sessions UNIQUE | One impression per completed session |
| track_id | UUID FK | Denormalized for analytics |
| user_id | UUID FK | |
| creative_id | UUID FK NULL | |
| completed_at | TIMESTAMPTZ | |

---

## PlatformSettings extension

Add column `ads_config JSONB DEFAULT '{"adsEnabled":true,"gateSeconds":5}'` on `platform_settings`.

| Field | Type | Default |
|-------|------|---------|
| adsEnabled | boolean | true |
| gateSeconds | number | 5 |

---

## Existing entities (unchanged)

- **Track** — `pricingType: FREE` triggers ad gate on download
- **DownloadAccess** — not used for FREE tracks
- **Earnings** — not created for ad impressions in MVP

---

## State transitions

```text
Download free clicked
  → POST ad-session → AdSession PENDING
  → User views ad (gateSeconds)
  → POST ad-session/complete → AdSession COMPLETED + AdImpression
  → GET download + X-Ad-Session-Id → 200 + file

Bypass attempt (no session) → 403 Ad completion required
Expired session → 403 Session expired
adsEnabled=false → skip ad flow (022 behavior)
```

---

## Validation rules

- Only FREE tracks require ad session on download
- Session `userId` must match JWT user
- Session `trackId` must match download `:id`
- Complete only allowed after `gateSeconds` elapsed (server checks `createdAt + gateSeconds`)
