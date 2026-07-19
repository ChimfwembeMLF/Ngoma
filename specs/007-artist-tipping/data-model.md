# Data Model: Artist Tipping

**Feature**: 007-artist-tipping | **Date**: 2026-07-19

## New Entity: Tip

| Field | Type | Rules |
|-------|------|-------|
| id | uuid | PK |
| artistId | uuid | FK → artists, required |
| userId | uuid | FK → users, required (tipper) |
| amount | decimal(10,2) | gross tip amount, ≥ 1.00 |
| paymentId | uuid | FK → payments, required on completion |
| message | text | optional, max 500 chars |
| trackId | uuid | optional FK → tracks (context from track page) |
| isAnonymous | boolean | default false; UI deferred |
| createdAt | timestamptz | auto |

**Index**: `idx_tips_artist_created ON tips(artist_id, created_at DESC)`

## Extended: Payment

| Field | Change |
|-------|--------|
| purpose | Add enum value `TIP` |
| itemId | Stores `artistId` when purpose is TIP |

## Extended: Earnings

| Field | Change |
|-------|--------|
| source | Add enum value `TIP` |
| trackId | **Nullable** — null when tip has no track context |

### Earnings calculation (TIP)

```text
gross = payment.amount
platformFee = round(gross * 0.05, 2)
artistAmount = round(gross - platformFee, 2)
source = TIP
trackId = tip.trackId ?? null
```

## Migration

**File**: `api/database/migrations/1719000000007-ArtistTipping.ts`

1. Create `tips` table
2. Alter `earnings.track_id` DROP NOT NULL (if currently NOT NULL)
3. Extend `earnings.source` CHECK to include `TIP`
4. Extend `payments.purpose` CHECK to include `TIP` (if CHECK exists)

## Relationships

```text
User ──tips──> Tip <── artist ── Artist
Tip ──payment──> Payment
Tip ──track?──> Track
Payment completion ──creates──> Earnings (source TIP)
```

## API response: Tip (artist received list)

```json
{
  "id": "uuid",
  "amount": 10.0,
  "message": "Love your music!",
  "trackId": "uuid-or-null",
  "createdAt": "2026-07-19T12:00:00Z",
  "tipperName": "Listener Name"
}
```

## Analytics compatibility (005)

| Metric | Tip behavior |
|--------|--------------|
| totalNetEarnings | includes TIP earnings amounts |
| uniqueSupporters | tipper user_id counted in DISTINCT |
| topTracks | unaffected (tips may have null trackId) |
