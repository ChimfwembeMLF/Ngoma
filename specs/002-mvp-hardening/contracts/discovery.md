# API Contract: Discovery Search (delta for 002)

**Module**: `api/src/modules/discovery/`  
**Endpoint**: `GET /api/v1/discovery/search`

## Change from 001

001 used ILIKE on `title` and `artist_name`. 002 uses PostgreSQL FTS on `tracks.search_vector`.

## GET /search

**Auth**: Public

**Query**:
| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| q | yes | — | Search terms (passed to `plainto_tsquery`) |
| limit | no | 20 | Max 50 |
| offset | no | 0 | Pagination offset |

### Response 200

Same item shape as 001:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Track Title",
      "artistName": "Artist Name",
      "artistId": "uuid",
      "coverArtUrl": "https://...",
      "price": 10,
      "pricingType": "SET_PRICE",
      "genre": "Afrobeats",
      "duration": 210
    }
  ]
}
```

Results ordered by `ts_rank(search_vector, query)` descending.

### Errors

| HTTP | Description |
|------|-------------|
| 400 | Missing or empty `q` |

---

## Track duration in responses

All discovery and track list responses MUST include `duration` (seconds) when available.
