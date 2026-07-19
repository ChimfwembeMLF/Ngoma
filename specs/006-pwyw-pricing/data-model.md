# Data Model: Pay What You Want Pricing

**Feature**: 006-pwyw-pricing | **Date**: 2026-07-19

## Entity Changes

### Track (extended)

| Field | Type | Rules |
|-------|------|-------|
| pricingType | enum | `SET_PRICE` \| `PAY_WHAT_YOU_WANT` \| `FREE` |
| price | decimal(10,2)? | Required when SET_PRICE; null otherwise |
| minPrice | decimal(10,2)? | Required when PAY_WHAT_YOU_WANT; null otherwise; ≥ 0.01 |

### Validation matrix

| pricingType | price | minPrice | Publish allowed |
|-------------|-------|----------|-----------------|
| SET_PRICE | required ≥ 0.01 | must be null | yes (with audio) |
| PAY_WHAT_YOU_WANT | must be null | required ≥ 0.01 | yes (with audio) |
| FREE | null | null | yes (with audio) |

### State transitions

No new lifecycle states. PWYW tracks follow same draft → published flow as SET_PRICE.

## Related entities (unchanged)

### Payment

- `amount`: listener-chosen value for PWYW (validated ≥ track.minPrice)
- `purpose`: `TRACK_DOWNLOAD`
- `itemId`: track UUID

### Earnings

- `amount`: artist share = `(payment.amount - platformFee)`
- `platformFee`: `payment.amount * PLATFORM_FEE_RATE`
- Created in existing `completePayment()` — no schema change

### DownloadAccess

- Granted on completed PWYW payment — same as SET_PRICE

## API response shape (public track)

```json
{
  "id": "uuid",
  "title": "Track Title",
  "pricingType": "PAY_WHAT_YOU_WANT",
  "price": null,
  "minPrice": 5.0,
  "genre": "Afrobeats",
  "isPublished": true
}
```

## Migration

**File**: `api/database/migrations/1719000000006-TrackPwywPricing.ts`

```sql
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS min_price DECIMAL(10, 2);

ALTER TABLE tracks DROP CONSTRAINT IF EXISTS tracks_pricing_type_check;
ALTER TABLE tracks ADD CONSTRAINT tracks_pricing_type_check
  CHECK (pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE'));
```

## Query / index impact

No new indexes. Existing `idx_tracks_artist_published` sufficient.

## Analytics compatibility (005)

| Metric | PWYW behavior |
|--------|---------------|
| totalNetEarnings | sums earnings from PWYW payments at chosen amounts |
| topTracks.netEarnings | per-track sum includes PWYW |
| uniqueSupporters | unchanged — distinct payers |
