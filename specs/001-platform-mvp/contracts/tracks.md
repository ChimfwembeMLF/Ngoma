# API Contract: Tracks & Artists

**Modules**: `api/src/modules/tracks/`, `api/src/modules/artists/`, `api/src/modules/media/`

## Artists

### GET /api/v1/artists/:id

Public artist profile.

### PUT /api/v1/artists/profile

**Auth**: Bearer (ARTIST) — update own profile.

### GET /api/v1/artists/:id/tracks

Public published tracks for artist.

---

## Tracks

### GET /api/v1/tracks

List published tracks (paginated).

**Query**: `limit`, `offset`, `genre`, `search`

### GET /api/v1/tracks/:id

Track detail (public if published).

### POST /api/v1/tracks

**Auth**: Bearer (ARTIST) — create draft track (metadata only).

### POST /api/v1/tracks/:id/upload

**Auth**: Bearer (ARTIST) — multipart: `audio`, optional `coverArt`.

### PUT /api/v1/tracks/:id

**Auth**: Bearer (ARTIST, owner) — update metadata, price, publish state.

### DELETE /api/v1/tracks/:id

**Auth**: Bearer (ARTIST, owner) — soft delete (`isActive=false`).

### GET /api/v1/tracks/:id/stream

Stream audio (public preview or full if free/owned).

### GET /api/v1/tracks/:id/download

**Auth**: Bearer — requires DownloadAccess or free track.

---

## Media

### POST /api/v1/media/upload

**Auth**: Bearer — generic image upload helper (cover art).

---

## Response envelope

```json
{
  "success": true,
  "data": { },
  "pagination": { "total": 100, "limit": 20, "offset": 0 }
}
```
