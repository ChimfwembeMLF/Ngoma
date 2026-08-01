# Data Model: Google Ads Integration (026)

## Overview

This feature makes **additive, schema-free changes** only. All backend data lives in the existing `platform_settings.ads_config` JSONB column. No new tables or migrations are required.

---

## Extended Entity: AdsConfig (JSONB in `platform_settings`)

The `AdsConfig` type stored in `PlatformSettings.adsConfig` is extended with one new field:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `adsEnabled` *(existing)* | boolean | `true` | Master switch for all ads (custom + Google) |
| `gateSeconds` *(existing, default changed)* | number | `30` | Countdown duration for the ad gate. Default raised from 5 → 30 to maximise Google AdSense viewability score. Admin-configurable. |
| `googleAdsEnabled` *(new)* | boolean | `true` | Controls whether Google AdSense units render. When `false`, custom creatives serve as the fallback in the gate; no Google `<ins>` tags push. |

**Storage**: Pure JSONB field on the existing `platform_settings` row (id = 1). No DDL migration needed — adding a key to a JSONB object is additive.

**Access**: Read by `GET /api/v1/platform/ads/config` (public, no auth). Written by `PUT /api/v1/admin/ads/config` (admin-only).

---

## New Client Entity: Ad Unit Placement (frontend-only, not persisted)

Defined as a TypeScript type in `client/src/components/ads/GoogleAdUnit.tsx`. Not stored in the database — slot IDs come from environment variables at build time.

| Field | Type | Source |
|-------|------|--------|
| `slotId` | string | `VITE_ADSENSE_SLOT_*` env var |
| `format` | `'auto' \| 'rectangle' \| 'leaderboard'` | Prop |
| `publisherId` | string | `VITE_ADSENSE_PUBLISHER_ID` env var |

**Placement map** (slot IDs are created in Google AdSense dashboard):

| Placement Name | Format | Page | Position |
|---------------|--------|------|---------|
| `VITE_ADSENSE_SLOT_GATE` | rectangle (300×250) | Ad Gate Modal | Inside countdown card, above timer |
| `VITE_ADSENSE_SLOT_DISCOVER` | leaderboard (728×90 / responsive) | Discover Page | Between hero and music grid |
| `VITE_ADSENSE_SLOT_TRACK` | rectangle (300×250 / responsive) | Track Page | Below download/stream action area |
| `VITE_ADSENSE_SLOT_ARTIST` | leaderboard (728×90 / responsive) | Artist Profile Page | Between artist header and track list |

---

## Existing Entities (unchanged)

| Entity | Table | Change |
|--------|-------|--------|
| `AdCreative` | `ad_creatives` | None — remains the fallback creative system |
| `AdSession` | `ad_sessions` | None — gate session lifecycle is unchanged |
| `AdImpression` | `ad_impressions` | None — impressions tracked as before |
| `PlatformSettings` | `platform_settings` | `adsConfig` JSONB field extended (additive only) |

---

## State Transitions

The `googleAdsEnabled` flag follows a simple boolean lifecycle:

```
[not configured / publisher ID absent]
         │
         ▼ publisher ID set in env
[enabled: true]  ←→  [enabled: false]
   (admin toggle via PUT /api/v1/admin/ads/config)
```

When transitioning from `enabled → disabled`:
- Google `<ins>` tags are not pushed on next page render.
- Auto ads stop firing (publisher script still loaded but no units created).
- Custom creatives resume serving in the ad gate.
