# Contract: Playlists Share & Curated API

**Module**: `api/src/modules/playlists/`  
**Base path**: `/api/v1/playlists`

---

## GET /api/v1/playlists/curated

**Auth**: None

**Response**: `{ success: true, data: CuratedSummary[] }`

**CuratedSummary**: `id`, `name`, `shareSlug`, `trackCount`, `coverArtUrl?`, `isCurated: true`

**Notes**: Only `isCurated = true` AND `isPublic = true` playlists; ordered by `createdAt DESC`.

---

## GET /api/v1/playlists/share/:slug

**Auth**: Optional JWT (required for private + owner)

**Response**: Same as `GET /api/v1/playlists/:id` — `PlaylistDetail`

**Errors**: 404 slug not found, 403 private non-owner

---

## POST /api/v1/playlists/:id/share

**Auth**: JWT + playlist owner

**Purpose**: Ensure `shareSlug` exists; return share URL

**Response**:

```json
{
  "success": true,
  "data": {
    "shareSlug": "road-trip-mix-a1b2c3",
    "shareUrl": "http://localhost:5173/playlists/share/road-trip-mix-a1b2c3"
  }
}
```

**Errors**: 403 not owner or playlist private, 404 not found

**Rules**: Only public playlists may generate share links.

---

## Existing endpoints (unchanged behavior)

- `GET /api/v1/playlists/:id` — still works with UUID
- User create/update — MUST NOT accept `isCurated` or `shareSlug` in body

---

## Route registration order (critical)

```text
GET  /curated
GET  /share/:slug
GET  /mine
POST /
GET  /:id
...
```

---

## Swagger

**Tag**: `Playlists`
