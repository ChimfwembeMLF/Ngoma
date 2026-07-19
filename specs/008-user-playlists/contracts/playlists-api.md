# Contract: Playlists API

**Module**: `api/src/modules/playlists/`  
**Base path**: `/api/v1/playlists`

---

## POST /api/v1/playlists

**Auth**: JWT required

**Body**:

```json
{
  "name": "Road Trip Mix",
  "description": "Optional",
  "isPublic": true
}
```

**Response**: `{ success: true, data: Playlist }`

---

## GET /api/v1/playlists/mine

**Auth**: JWT required

**Response**: `{ success: true, data: PlaylistSummary[] }` with `trackCount` per playlist

---

## GET /api/v1/playlists/:id

**Auth**: Optional — required for private playlists (owner only)

**Response**: `{ success: true, data: PlaylistDetail }` with ordered `tracks[]`

**Errors**: 403 private non-owner, 404 not found

---

## PUT /api/v1/playlists/:id

**Auth**: JWT + owner

**Body**: `{ name?, description?, isPublic? }`

---

## DELETE /api/v1/playlists/:id

**Auth**: JWT + owner

**Response**: `{ success: true, data: { deleted: true } }`

---

## POST /api/v1/playlists/:id/tracks

**Auth**: JWT + owner

**Body**: `{ trackId: "uuid" }`

**Response**: `{ success: true, data: { trackId, position } }`

**Errors**: 400 duplicate, 404 track not found/unpublished

---

## DELETE /api/v1/playlists/:id/tracks/:trackId

**Auth**: JWT + owner

**Response**: `{ success: true, data: { removed: true } }`

---

## Swagger

**Tag**: `Playlists`  
**Bearer auth** on mutating routes
