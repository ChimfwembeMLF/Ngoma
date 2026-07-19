# Data Model: 005-artist-analytics

**Date**: 2026-07-19

**Note**: No new persistent entities. This document defines **computed response models** and their source columns.

## Existing Entities (read-only)

### Earnings (`earnings`)

| Column | Type | Analytics use |
|--------|------|---------------|
| artist_id | UUID | Scope filter |
| track_id | UUID | Per-track grouping |
| user_id | UUID | Unique supporters |
| amount | DECIMAL | Net artist earnings |
| platform_fee | DECIMAL | Optional fee total |
| created_at | TIMESTAMPTZ | Timeline buckets |

### Track (`tracks`)

| Column | Type | Analytics use |
|--------|------|---------------|
| artist_id | UUID | Scope filter |
| title | VARCHAR | Display |
| plays | BIGINT | Engagement |
| downloads | BIGINT | Engagement |
| price | DECIMAL | Context |
| is_published | BOOLEAN | Published count |

## Computed Response Models

### AnalyticsSummary

| Field | Type | Source |
|-------|------|--------|
| totalNetEarnings | number | SUM(earnings.amount) |
| totalPlatformFees | number | SUM(earnings.platform_fee) |
| totalPlays | number | SUM(tracks.plays) |
| totalDownloads | number | SUM(tracks.downloads) |
| publishedTrackCount | number | COUNT(tracks WHERE is_published) |
| uniqueSupporters | number | COUNT(DISTINCT earnings.user_id) |
| currency | string | `"ZMW"` constant |

### TrackAnalyticsRow

| Field | Type | Source |
|-------|------|--------|
| trackId | UUID | tracks.id |
| title | string | tracks.title |
| plays | number | tracks.plays |
| downloads | number | tracks.downloads |
| netEarnings | number | SUM(earnings.amount) per track |
| pricingType | string | tracks.pricing_type |

### EarningsTimelineBucket

| Field | Type | Source |
|-------|------|--------|
| date | string (ISO date) | DATE_TRUNC day |
| netEarnings | number | SUM(earnings.amount) for day |

### AnalyticsDashboardResponse

```typescript
{
  success: true;
  data: {
    summary: AnalyticsSummary;
    topTracks: TrackAnalyticsRow[];  // max 10, sorted by netEarnings DESC
  };
}
```

### EarningsTimelineResponse

```typescript
{
  success: true;
  data: {
    days: number;
    buckets: EarningsTimelineBucket[];
    totalNetEarnings: number;  // sum of buckets in window
  };
}
```

## Validation Rules

- `days` query param: integer 7–90, default 30
- All monetary values returned as numbers with 2 decimal precision in JSON
- `topTracks` includes tracks with zero earnings (shows plays/downloads)
- Artist scope: every query MUST include `WHERE artist_id = :artistId`

## Migration

| Migration | Change |
|-----------|--------|
| `1719000000005-EarningsArtistIndex.ts` | Index `idx_earnings_artist_created` on `(artist_id, created_at DESC)` |

No new tables or columns on entities.

## Relationships (query-level)

```text
Artist 1──* Track
Artist 1──* Earnings
Track  1──* Earnings
User   1──* Earnings (buyer)
```
