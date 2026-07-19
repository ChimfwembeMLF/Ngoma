# Feature Specification: User-Generated Playlists

**Feature Branch**: `008-user-playlists`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Phase 2 user-generated playlists — create playlists, add tracks, view and manage my playlists"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics`, `006-pwyw-pricing`, `007-artist-tipping` (tracks, discovery, auth, design system exist)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Playlist (Priority: P1)

A signed-in listener creates a named playlist (optional description, public by default) and sees it in their library.

**Why this priority**: Playlists require a container before tracks can be added — core Week 17–18 capability (`PROJECT REQUIREMENTS.md` §4.1.4, §11.2).

**Independent Test**: Listener creates "Road Trip Mix" → appears in My Playlists via API and UI.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a playlist with name and optional description, **Then** playlist is saved with `userId`, `isPublic: true`, `isCurated: false`.
2. **Given** empty name, **When** submitted, **Then** validation rejects with 400.
3. **Given** a LISTENER creates a playlist, **When** listed via mine endpoint, **Then** only their playlists appear.

---

### User Story 2 - Add and Remove Tracks (Priority: P1)

A listener adds published tracks to their playlist and removes them; duplicate adds are rejected.

**Why this priority**: Playlist value comes from track collections; wireframe shows "Add to Playlist" on track player.

**Independent Test**: Add two tracks → playlist detail shows both in order; remove one → one remains.

**Acceptance Scenarios**:

1. **Given** own playlist and published track, **When** user adds track, **Then** `playlist_tracks` row created with position after existing tracks.
2. **Given** track already in playlist, **When** add again, **Then** 400 conflict.
3. **Given** track in playlist, **When** user removes it, **Then** row deleted and positions remain stable.
4. **Given** unpublished track, **When** add attempted, **Then** 404 or 400.

---

### User Story 3 - Browse My Playlists (Priority: P1)

A listener views all their playlists with track counts on a dedicated page.

**Why this priority**: Primary navigation surface for playlist management.

**Independent Test**: `/playlists` shows cards for each user playlist with name and track count.

**Acceptance Scenarios**:

1. **Given** user with 2 playlists, **When** they open My Playlists, **Then** both listed with names and track counts.
2. **Given** user with no playlists, **When** page loads, **Then** empty state with create CTA.

---

### User Story 4 - View Public Playlist Detail (Priority: P2)

Anyone (or any authenticated user) can view a public playlist's tracks; private playlists are owner-only.

**Independent Test**: Public playlist `/playlists/:id` shows track rows; private playlist returns 403 for non-owner.

**Acceptance Scenarios**:

1. **Given** public playlist with tracks, **When** any user opens detail, **Then** track list with title, artist, duration shown.
2. **Given** private playlist, **When** non-owner requests detail, **Then** 403 Forbidden.
3. **Given** owner views private playlist, **Then** full access including remove actions.

---

### User Story 5 - Add to Playlist from Track Page (Priority: P2)

From track detail, a logged-in user picks one of their playlists to add the current track.

**Why this priority**: Matches product wireframe "Add to Playlist" action on Now Playing / track page.

**Independent Test**: On `/tracks/:id`, Add to playlist → select existing playlist → track appears in that playlist.

**Acceptance Scenarios**:

1. **Given** logged-in user with playlists, **When** they use Add to playlist on track page, **Then** dropdown lists their playlists and add succeeds.
2. **Given** no playlists yet, **When** Add to playlist, **Then** prompt to create one or link to `/playlists`.

---

### Edge Cases

- Delete playlist → cascade removes `playlist_tracks` rows.
- Owner deletes playlist while another user viewing → 404 on refresh.
- Max playlist name length 100 chars.
- Only published, active tracks can be added.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-801**: System MUST persist `playlists` and `playlist_tracks` tables per requirements schema.
- **FR-802**: System MUST expose CRUD for own playlists under `/api/v1/playlists` (create, list mine, get one, update, delete).
- **FR-803**: System MUST expose `POST /api/v1/playlists/:id/tracks` and `DELETE /api/v1/playlists/:id/tracks/:trackId`.
- **FR-804**: Playlist endpoints MUST require JWT; mutate operations scoped to owning `userId`.
- **FR-805**: Public playlist GET allowed without auth; private playlists owner-only.
- **FR-806**: Client MUST provide `/playlists` (my library) and `/playlists/:id` (detail) pages using design system.
- **FR-807**: Track page MUST offer Add to playlist control for authenticated users.
- **FR-808**: `isCurated` MUST default false; admin curated playlists out of scope.

### Key Entities

- **Playlist**: `userId`, `name`, `description`, `isPublic`, `isCurated`, timestamps
- **PlaylistTrack**: `playlistId`, `trackId`, `position`, `addedAt`

## Success Criteria *(mandatory)*

- **SC-801**: Listener creates playlist, adds tracks, views detail end-to-end in dev.
- **SC-802**: VS-801–VS-805 quickstart scenarios pass.
- **SC-803**: Discovery, checkout, and tipping flows unchanged (regression).
- **SC-804**: Duplicate track add rejected cleanly.

## Assumptions

- Playlist cover art uses first track's cover or placeholder (no upload in this slice).
- Reordering tracks (drag-drop) deferred — append-only position on add.
- Playlist following and curated/admin playlists are later slices.
- Streaming entire playlist queue in audio player deferred — detail page links to individual tracks.

## Out of Scope

- Curated playlists (`isCurated: true` admin seed).
- Playlist following / social feed.
- Share links and embed codes (Week 17–18 next slice).
- Algorithmic recommendations.
- Collaborative playlists (multiple editors).
