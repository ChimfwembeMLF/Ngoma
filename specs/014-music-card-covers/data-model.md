# Data Model: 014-music-card-covers

**Feature**: Music card full-width covers

## Database / API Changes

**None.**

## Client Data (existing fields)

| Entity | Field | Used on |
|--------|-------|---------|
| Track | `coverArtUrl` | TrackCard (Discover grids) |
| Playlist | `coverArtUrl` | PlaylistCard (Discover curated, My playlists) |

## UI Component Model

### MediaCard (layout primitive)

| Part | CSS intent |
|------|------------|
| Shell | `overflow-hidden rounded-md border border-border bg-card p-0` |
| Cover | `relative w-full aspect-square bg-muted` |
| Image | `h-full w-full object-cover` |
| Content | `p-3 space-y-1` |

### TrackCard

Composes MediaCard pattern; maps `TrackCardData` → cover + title + artist + duration/price.

### PlaylistCard

Composes MediaCard pattern; maps `{ id, name, trackCount, coverArtUrl, href }`.

## No State Transitions

Pure presentational change.
