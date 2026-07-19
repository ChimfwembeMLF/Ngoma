# Research: User-Generated Playlists

**Feature**: 008-user-playlists | **Date**: 2026-07-19

## R1: Module placement

**Decision**: New `api/src/modules/playlists/` module with own controller, service, entities.

**Rationale**: Playlists are a distinct aggregate (playlist + membership) vs extending `tracks` module. Matches mako feature-module pattern.

**Alternatives considered**:
- Nest under `discovery/` — rejected; playlists are user-owned library, not algorithmic discovery

## R2: Position assignment on add

**Decision**: On add track, set `position = MAX(position) + 1` within playlist (or 0 if empty).

**Rationale**: Supports ordered display without drag-drop UI in MVP. Reorder API deferred.

**Alternatives considered**:
- Client-supplied position — rejected; unnecessary complexity for first slice

## R3: Public vs private access

**Decision**:
- `GET /playlists/:id` — no auth required if `isPublic`; else JWT + owner check
- All mutations require JWT + ownership

**Rationale**: Enables future share links on public playlists; private stays protected.

## R4: Cover art display

**Decision**: Client derives cover from first track's `coverArtUrl` in playlist detail/mine list; no `cover_art_url` upload.

**Rationale**: Smallest diff; column exists in schema for future use but optional/null in MVP.

## R5: Add to playlist UX

**Decision**: Track page `<select>` + Add button listing user's playlists from `GET /playlists/mine`; inline success/error toast text.

**Rationale**: Matches wireframe action without modal library; sufficient for MVP.

**Alternatives considered**:
- Dedicated modal component — deferred unless time allows in implement

## R6: Duplicate track prevention

**Decision**: UNIQUE constraint on `(playlist_id, track_id)` + catch DB error → 400 "Track already in playlist".

**Rationale**: DB-enforced integrity per requirements schema.

## R7: Curated playlists

**Decision**: `isCurated` column defaults `false`; no admin UI or seed in this slice.

**Rationale**: Explicit out of scope; column ready for 008b curated slice.

## R8: Listener-only vs any role

**Decision**: Any authenticated user (LISTENER or ARTIST) may create playlists.

**Rationale**: Artists are also listeners; no business rule restricting playlist creation to LISTENER role.
