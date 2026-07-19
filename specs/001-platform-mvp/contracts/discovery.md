# API Contract: Discovery

**Base path**: `/api/v1/discovery`  
**Module**: `api/src/modules/discovery/`

Public read endpoints for listener browse experience.

## GET /trending

**Auth**: Public

**Query**: `limit` (default 20)

Returns tracks ordered by recent plays/downloads.

---

## GET /new-releases

**Auth**: Public

Recently published tracks.

---

## GET /search

**Auth**: Public

**Query**: `q` (required), `limit`, `offset`

Full-text search on track title and artist name (PostgreSQL FTS MVP).

---

## Response item shape

```json
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
```
