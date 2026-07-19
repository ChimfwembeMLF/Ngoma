# Data Model: User-Generated Playlists

**Feature**: 008-user-playlists | **Date**: 2026-07-19

## Entity: Playlist

| Field | Type | Rules |
|-------|------|-------|
| id | uuid | PK |
| userId | uuid | FK → users, required |
| name | varchar(100) | required, 1–100 chars |
| description | text | optional |
| coverArtUrl | text | optional, unused in MVP UI |
| isPublic | boolean | default true |
| isCurated | boolean | default false |
| createdAt | timestamptz | auto |
| updatedAt | timestamptz | auto |

## Entity: PlaylistTrack

| Field | Type | Rules |
|-------|------|-------|
| id | uuid | PK |
| playlistId | uuid | FK → playlists CASCADE |
| trackId | uuid | FK → tracks CASCADE |
| position | integer | nullable; append order |
| addedAt | timestamptz | default now |

**Unique**: `(playlist_id, track_id)`

## Relationships

```text
User 1──* Playlist
Playlist *──* Track via PlaylistTrack
```

## Migration

**File**: `api/database/migrations/1719000000008-UserPlaylists.ts`

Creates `playlists` and `playlist_tracks` per `PROJECT REQUIREMENTS.md` §2323–2343.

Indexes:
- `idx_playlists_user_id ON playlists(user_id)`
- `idx_playlist_tracks_playlist ON playlist_tracks(playlist_id, position)`

## API response shapes

**Playlist summary** (mine list):

```json
{
  "id": "uuid",
  "name": "Road Trip Mix",
  "description": null,
  "isPublic": true,
  "trackCount": 12,
  "createdAt": "2026-07-19T12:00:00Z"
}
```

**Playlist detail**:

```json
{
  "id": "uuid",
  "name": "Road Trip Mix",
  "isPublic": true,
  "isOwner": true,
  "tracks": [
    {
      "trackId": "uuid",
      "title": "Track Title",
      "artistName": "Demo Artist",
      "duration": 210,
      "coverArtUrl": "...",
      "position": 0
    }
  ]
}
```

## Validation rules

- Add track: track must `isPublished` and `isActive`
- Delete/update playlist: `playlist.userId === req.user.sub`
- Name: non-empty, max 100 characters
