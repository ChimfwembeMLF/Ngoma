# Feature Specification: Music Card Full-Width Covers

**Feature Branch**: `014-music-card-covers`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "For all the music cards I need the music cover to fill the whole width of the card"

**Depends on**: `009-shadcn-spotify-redesign` (`TrackCard`, Discover grids, shadcn Card)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Track Cards Edge-to-Edge Cover (Priority: P1)

A listener browsing Discover (Trending, New releases, Search) sees album art that spans the full width of each track card — no horizontal inset or padding around the cover image.

**Why this priority**: `TrackCard` currently applies `p-3` on the card wrapper, inseting the cover; user explicitly wants full-width covers.

**Independent Test**: VS-1401 — Track card cover touches left and right card edges; metadata remains padded below.

**Acceptance Scenarios**:

1. **Given** a track with cover art on Discover, **When** the card renders, **Then** cover image width equals card width (edge-to-edge).
2. **Given** a track without cover art, **When** the card renders, **Then** placeholder fills full card width at same aspect ratio.
3. **Given** hover on card, **When** scale animation applies, **Then** cover remains clipped within card bounds (overflow hidden).

---

### User Story 2 — Curated Playlist Cards Full-Width Cover (Priority: P1)

Curated playlist cards on Discover show cover art full bleed at the top of the card, matching Spotify album/playlist grid pattern.

**Why this priority**: Curated cards use shadcn `Card` with vertical padding, preventing full-width covers.

**Independent Test**: VS-1402 — Curated card cover spans full card width; title/track count padded below.

**Acceptance Scenarios**:

1. **Given** curated playlist with `coverArtUrl`, **When** card renders, **Then** image is full width with square (or 1:1) aspect ratio.
2. **Given** curated playlist without cover, **When** card renders, **Then** full-width placeholder with music icon.

---

### User Story 3 — Unified Media Card Pattern (Priority: P2)

Track and playlist cards share a consistent **media card** layout: full-bleed cover on top, padded metadata footer — per `DESIGN.md` grid-based album cards.

**Why this priority**: Prevents divergent one-off fixes; one component pattern for all music grids.

**Independent Test**: VS-1403 — TrackCard and PlaylistCard use same cover + footer structure.

**Acceptance Scenarios**:

1. **Given** any music grid on Discover, **When** compared side-by-side, **Then** cover alignment and aspect ratio are consistent.
2. **Given** responsive grid (1–4 columns), **When** viewport changes, **Then** covers remain full width of their grid cell.

---

### User Story 4 — My Playlists Grid Covers (Priority: P2)

User playlist list (`/playlists`) shows cover art full-width when available (first track cover or playlist `coverArtUrl`), not text-only cards.

**Independent Test**: VS-1404 — Playlist with cover shows full-width art on My playlists grid.

**Acceptance Scenarios**:

1. **Given** playlist with `coverArtUrl`, **When** listed on `/playlists`, **Then** cover displays full card width.
2. **Given** playlist without cover, **When** listed, **Then** consistent placeholder at full width.

---

## Functional Requirements

- **FR-1401**: Track card cover MUST span 100% of card content width (no horizontal padding on cover region).
- **FR-1402**: Cover region MUST use `aspect-square` (1:1) with `object-cover` for images.
- **FR-1403**: Card metadata (title, artist, price) MUST remain in a padded footer below the cover.
- **FR-1404**: Curated playlist cards on Discover MUST use the same full-bleed cover pattern.
- **FR-1405**: Cards MUST use `overflow-hidden` on outer container so hover zoom does not bleed outside rounded corners.
- **FR-1406**: Border radius: cover flush to top rounded corners of card; bottom corners rounded on card shell only.
- **FR-1407**: No API or database changes required — uses existing `coverArtUrl` fields.

## Non-Functional Requirements

- **NFR-1401**: Client-only CSS/layout change; no new dependencies.
- **NFR-1402**: Preserve existing grid breakpoints on Discover (`sm:2`, `lg:3`, `xl:4`).

## Success Criteria

- **SC-1401**: Zero visible horizontal gap between cover image and card border on track cards.
- **SC-1402**: Curated and track cards visually match Spotify grid cover treatment.
- **SC-1403**: All music card usages updated — no orphaned inset-cover patterns in `client/src`.

## Out of Scope

- Redesigning track detail hero (`TrackPage` — already full-width within its column)
- Playlist detail row thumbnails (list view, not grid cards)
- Cover art upload pipeline changes
- Animated cover parallax or play-button overlay on hover (future)

## Assumptions

- Square (1:1) aspect ratio for grid covers matches Spotify and current `TrackCard`
- `PlaylistsPage` API already returns `coverArtUrl` on playlist list items (verify during implement)
