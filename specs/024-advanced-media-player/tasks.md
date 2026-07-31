# Tasks: Advanced Media Player & Playlists

**Input**: Design documents from `/specs/024-advanced-media-player/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project compiles and runs before starting

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 Create TypeORM migration for `external_url` on Video entity in `api/database/migrations/[timestamp]-AddExternalUrlToVideo.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Advanced Audio Player Controls (Priority: P1) 🎯 MVP

**Goal**: Listeners can control their listening experience with advanced playback features such as repeat and manual queuing.

**Independent Test**: Play a track, toggle repeat to see if it loops. Add track to queue, ensure it plays next.

### Implementation for User Story 1

- [x] T003 [P] [US1] Update `PlayerProvider` in `client/src/providers/PlayerProvider.tsx` to include `queue`, `queueIndex`, `repeatMode` state and `addToQueue`, `setRepeatMode`, `playNext`, `playPrevious` functions
- [x] T004 [US1] Update `AudioPlayer` UI in `client/src/components/player/AudioPlayer.tsx` to include a Repeat button and correctly bind playNext/playPrevious

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Playlist Autoplay & Arrangement (Priority: P1)

**Goal**: Users can arrange tracks within their saved playlists and experience seamless autoplay.

**Independent Test**: Reorder tracks in a playlist, verify it saves. Play a playlist and verify the next track auto-plays.

### Implementation for User Story 2

- [x] T005 [P] [US2] Create DTO `ReorderPlaylistDto` in `api/src/modules/playlists/dto/reorder-playlist.dto.ts`
- [x] T006 [US2] Implement `reorderTracks` method in `api/src/modules/playlists/playlist.service.ts` to bulk update positions based on the contract
- [x] T007 [US2] Add `PATCH /:id/reorder` endpoint in `api/src/modules/playlists/playlist.controller.ts`
- [x] T008 [P] [US2] Add TanStack Query mutation for reordering in `client/src/hooks/usePlaylists.ts` (or similar playlist hook file)
- [x] T009 [US2] Update Playlist UI (e.g., `client/src/pages/PlaylistPage.tsx` or Playlist detail component) to allow reordering tracks and call the API
- [x] T010 [US2] Update Playlist UI to load all tracks into the `PlayerProvider` queue when the "Play" button is clicked for a playlist
- [x] T010b [US2] Dynamically update active player queue when a currently playing playlist is reordered in `client/src/pages/PlaylistDetailPage.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Video Links (Priority: P2)

**Goal**: Users uploading or viewing videos can interact with external links associated with the video content.

**Independent Test**: Edit a video to add an external link, then view the video and click the link.

### Implementation for User Story 3

- [x] T011 [P] [US3] Update `Video` entity in `api/src/modules/videos/entities/video.entity.ts` to add `externalUrl` column
- [x] T012 [P] [US3] Update Create and Update Video DTOs in `api/src/modules/videos/dto/` to allow `externalUrl`
- [x] T013 [US3] Update video detail page `client/src/pages/VideoPage.tsx` (or similar) to display the external link if it exists
- [x] T014 [US3] Update video edit/upload form component to allow inputting `externalUrl`

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 5.1: Playlist Add & Queue UX Enhancement (User Story 4)

**User Story**: As a user, I want to easily add songs to my playlists directly within the playlist page and clearly see my playback queue directly from the audio player without any confusion.

**Goal**: Seamless in-page track addition and an interactive audio player queue drawer.

**Independent Test**: Click the queue icon in the audio player to open the track list drawer; open a playlist page you own and use the built-in track search to add songs directly without leaving the view.

### Implementation for User Story 4

- [x] T018 [US4] Implement interactive Queue Drawer in `client/src/components/player/AudioPlayer.tsx` triggered by clicking the `ListMusic` icon button, allowing track jumping and viewing upcoming items.
- [x] T019 [US4] Implement an inline "Add Tracks" search and selector directly within `client/src/pages/PlaylistDetailPage.tsx` for playlist owners, enabling single-click track addition without navigating away from the page.
- [x] T020 [US4] Polish "Add to Playlist" feedback in `client/src/pages/TrackPage.tsx` with robust cache invalidation and clearer visual feedback after adding tracks.

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 [P] Update Swagger docs if new tags added (automatically picked up from controllers)
- [x] T016 Run `yarn lint` in `api/` and `client/`
- [x] T017 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete
