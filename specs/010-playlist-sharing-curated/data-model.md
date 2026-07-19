# Data Model: Playlist Sharing & Curated Playlists

**Feature**: 010-playlist-sharing-curated | **Date**: 2026-07-19

## Entity: Playlist (extended)

| Field | Type | Rules |
|-------|------|-------|
| shareSlug | varchar(80) | nullable, unique, immutable once set |
| isCurated | boolean | default false; true only via admin API |

Existing fields unchanged from 008 (`userId`, `name`, `description`, `isPublic`, etc.).

## Indexes

- `UNIQUE (share_slug)` where not null
- Existing `idx_playlists_user_id` unchanged

## Migration

**File**: `api/database/migrations/1719000000009-PlaylistShareCurated.ts`

```sql
ALTER TABLE playlists ADD COLUMN share_slug VARCHAR(80) UNIQUE;
CREATE INDEX idx_playlists_share_slug ON playlists(share_slug) WHERE share_slug IS NOT NULL;
-- Optional seed: INSERT curated playlists for admin user
```

## API response shapes

**Curated summary** (Discover list):

```json
{
  "id": "uuid",
  "name": "Afrobeats Hits",
  "shareSlug": "afrobeats-hits-x7k2m9",
  "trackCount": 12,
  "coverArtUrl": null,
  "isCurated": true
}
```

**Share link payload**:

```json
{
  "shareUrl": "http://localhost:5173/playlists/share/afrobeats-hits-x7k2m9",
  "shareSlug": "afrobeats-hits-x7k2m9"
}
```

## Validation rules

- `shareSlug`: lowercase alphanumeric + hyphens only; 3–80 chars
- Curated create: name required; `isPublic` forced true; `isCurated` forced true
- User create/update: reject `isCurated` in DTO (strip or 403)
- Share by slug: same public/private rules as GET by id

## State transitions

```text
User public playlist → (first copy share) → shareSlug assigned
Admin creates curated → shareSlug assigned immediately
Private playlist → shareSlug null; share disabled
Make private → slug remains but GET by slug returns 403 for non-owner
```
