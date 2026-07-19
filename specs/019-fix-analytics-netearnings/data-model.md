# Data Model: Fix Analytics netEarnings Query

**Feature**: 019-fix-analytics-netearnings

No schema changes. This document describes the affected computed views and query fix.

## Entities (unchanged)

### Earnings (`earnings` table)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| artist_id | uuid | FK — filter scope |
| track_id | uuid | FK — join to tracks |
| amount | decimal | Summed for net earnings |
| platform_fee | decimal | Used in summary only |
| source | enum | DOWNLOAD, TIP, etc. |
| created_at | timestamp | Timeline grouping |

### Track (`tracks` table)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| artist_id | uuid | Filter |
| title | string | Display |
| plays | int | Secondary sort |
| downloads | int | Display |
| pricing_type | enum | Display |
| is_active | bool | Filter |
| is_published | bool | Summary count |

## Computed: TopTrackRow

Produced by `buildTopTracks(artistId)` — **response shape unchanged**.

| Field | Source | Notes |
|-------|--------|-------|
| trackId | `t.id` | |
| title | `t.title` | |
| plays | `t.plays` | Secondary ORDER BY DESC |
| downloads | `t.downloads` | |
| netEarnings | `COALESCE(SUM(e.amount), 0)` | Primary ORDER BY DESC |
| pricingType | `t.pricing_type` | |

## Query fix

| Before (broken) | After (fixed) |
|-----------------|---------------|
| `.orderBy('netEarnings', 'DESC')` | `.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')` |

Sort order preserved:
1. Net earnings DESC
2. Plays DESC (`t.plays`)
3. LIMIT 10

## State transitions

N/A — read-only aggregation query; no entity lifecycle changes.
