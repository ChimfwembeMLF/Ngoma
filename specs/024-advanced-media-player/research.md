# Research: Advanced Media Player & Playlists

## Technical Decisions

### 1. Audio Player Queue and Repeat Modes
- **Decision**: Manage the queue and repeat state entirely on the client side using React Context (`PlayerProvider`).
- **Rationale**: The playback queue is ephemeral. Storing it in the backend is unnecessary overhead. The `PlayerProvider` will be updated to hold an array of tracks (`queue`), a `queueIndex`, and a `repeatMode` state (`off`, `track`, `queue`).
- **Alternatives Considered**: Persisting the queue in local storage (rejected to keep it simple for now, but could be added as an enhancement).

### 2. Playlist Track Reordering
- **Decision**: Use the existing `position` column in `playlist_tracks` and create a bulk update endpoint `/api/v1/playlists/:id/reorder`.
- **Rationale**: `PlaylistTrack` already has a nullable `position` integer field. We can send an array of `{ trackId, position }` to the API to update the order. On the client, we will use a library like `@dnd-kit/core` or similar if already installed, or just basic up/down buttons for now to reorder tracks.
- **Alternatives Considered**: Recreating all `PlaylistTrack` records (rejected due to inefficiency and loss of `added_at` data).

### 3. Video External Links
- **Decision**: Add an `externalUrl` (varchar, nullable) column to the `Video` entity. The user question was skipped so we assume the most standard approach (Option A: clickable external link displayed alongside the video).
- **Rationale**: Keeps the model simple and allows artists to direct fans to external platforms (e.g., ticket sales, merch).
- **Alternatives Considered**: Creating a separate `VideoLink` entity (overkill for a single link).

### 4. Audio Player Queue Display (Interactive Drawer)
- **Decision**: Render a clean overlay popover/sheet directly above the `AudioPlayer` when the queue (`ListMusic`) icon is toggled.
- **Rationale**: Keeps the user directly within their listening experience without forcing a page transition. Users can see upcoming tracks, click any track in the queue to jump directly to it, or clear the queue.

### 5. In-Page Playlist Track Addition (`PlaylistDetailPage.tsx`)
- **Decision**: Embed an inline search/picker component in the playlist detail view for playlist owners. We will reuse track listing hooks to display available tracks directly inside the playlist management screen with an "Add" button next to each result.
- **Rationale**: Eliminates context-switching friction where users previously had to navigate away from their playlist to discover and add individual tracks from disparate pages.
