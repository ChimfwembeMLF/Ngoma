# Contract: Admin Curated Playlists API

**Module**: `api/src/modules/admin/` (delegates to `PlaylistsService`)  
**Base path**: `/api/v1/admin/playlists/curated`

**Auth**: JWT + `ADMIN` role on all routes

---

## POST /api/v1/admin/playlists/curated

**Body**:

```json
{
  "name": "Afrobeats Hits",
  "description": "Editorial pick"
}
```

**Response**: `{ success: true, data: Playlist }` with `isCurated: true`, `isPublic: true`, `shareSlug` set

---

## PUT /api/v1/admin/playlists/curated/:id

**Body**: `{ name?, description? }`

**Response**: Updated playlist

**Errors**: 404, 403 if not curated playlist

---

## DELETE /api/v1/admin/playlists/curated/:id

**Response**: `{ success: true, data: { deleted: true } }`

---

## POST /api/v1/admin/playlists/curated/:id/tracks

**Body**: `{ trackId: "uuid" }`

**Response**: Same as user add track

---

## DELETE /api/v1/admin/playlists/curated/:id/tracks/:trackId

**Response**: Same as user remove track

---

## GET /api/v1/admin/playlists/curated

**Purpose**: Admin list all curated playlists (including private flag edits)

**Response**: `{ success: true, data: CuratedSummary[] }`

---

## Swagger

**Tag**: `Admin`

**Bearer auth**: Required
