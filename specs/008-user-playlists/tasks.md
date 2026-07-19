# Tasks: User-Generated Playlists

**Input**: Design documents from `/specs/008-user-playlists/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics`, `006-pwyw-pricing`, `007-artist-tipping`

**Tests**: Not requested in spec — manual VS-801–VS-805 only.

---

## Phase 1: Setup — Migration

**Purpose**: `playlists` and `playlist_tracks` tables

- [X] T001 Create migration `api/database/migrations/1719000000008-UserPlaylists.ts` with `playlists`, `playlist_tracks`, indexes `idx_playlists_user_id` and `idx_playlist_tracks_playlist`, and UNIQUE `(playlist_id, track_id)` per data-model.md

---

## Phase 2: Foundational — Playlists Module

**Purpose**: Entity scaffold and module registration — blocks all user stories

- [X] T002 Create `api/src/modules/playlists/entities/playlist.entity.ts` with userId, name, description, coverArtUrl, isPublic, isCurated, timestamps per data-model.md
- [X] T003 [P] Create `api/src/modules/playlists/entities/playlist-track.entity.ts` with playlistId, trackId, position, addedAt and relations per data-model.md
- [X] T004 [P] Create DTOs in `api/src/modules/playlists/dto/create-playlist.dto.ts`, `update-playlist.dto.ts`, and `add-playlist-track.dto.ts` per `contracts/playlists-api.md`
- [X] T005 Create `api/src/modules/playlists/playlists.module.ts` importing TypeORM `Playlist`, `PlaylistTrack`, and `Track` entities
- [X] T006 Register `PlaylistsModule` in `api/src/app.module.ts`

**Checkpoint**: Module loads; routes not yet implemented

---

## Phase 3: User Story 1 — Create a Playlist (Priority: P1)

**Goal**: Authenticated user creates a named playlist with optional description and public flag

**Independent Test**: VS-801 — POST creates playlist; appears in mine list

- [X] T007 [US1] Implement `create(userId, dto)` in `api/src/modules/playlists/playlists.service.ts` setting `isCurated: false`, default `isPublic: true`
- [X] T008 [US1] Add `POST /api/v1/playlists` with `JwtAuthGuard` to `api/src/modules/playlists/playlists.controller.ts` per `contracts/playlists-api.md`
- [X] T009 [P] [US1] Add `useCreatePlaylist()` to `client/src/hooks/usePlaylists.ts`

---

## Phase 4: User Story 2 — Add and Remove Tracks (Priority: P1)

**Goal**: Owner adds published tracks to playlist and removes them; duplicates rejected

**Independent Test**: VS-802 — add two tracks, remove one; duplicate add returns 400

- [X] T010 [US2] Implement `addTrack(userId, playlistId, trackId)` and `removeTrack(userId, playlistId, trackId)` in `api/src/modules/playlists/playlists.service.ts` with position append, published-track validation, and duplicate handling per research.md R2/R6
- [X] T011 [US2] Add `POST /api/v1/playlists/:id/tracks` and `DELETE /api/v1/playlists/:id/tracks/:trackId` to `api/src/modules/playlists/playlists.controller.ts`

---

## Phase 5: User Story 3 — Browse My Playlists (Priority: P1)

**Goal**: User sees all owned playlists with track counts on `/playlists`

**Independent Test**: VS-803 — `/playlists` lists playlists with correct track counts and empty state

- [X] T012 [US3] Implement `findMine(userId)` returning playlists with `trackCount` in `api/src/modules/playlists/playlists.service.ts`
- [X] T013 [US3] Add `GET /api/v1/playlists/mine` with `JwtAuthGuard` to `api/src/modules/playlists/playlists.controller.ts`
- [X] T014 [US3] Create `client/src/pages/PlaylistsPage.tsx` with playlist cards, create form, and empty state per `contracts/playlists-ui.md`
- [X] T015 [US3] Register protected route `/playlists` in `client/src/App.tsx` and add `useMyPlaylists()` to `client/src/hooks/usePlaylists.ts`

---

## Phase 6: User Story 4 — View Public Playlist Detail (Priority: P2)

**Goal**: Public playlists viewable by anyone; private playlists owner-only; owner can delete and remove tracks

**Independent Test**: VS-804 — public detail open without auth; private returns 403 for non-owner

- [X] T016 [US4] Implement `findOne(id, userId?)` with public/private access rules and ordered tracks in `api/src/modules/playlists/playlists.service.ts`
- [X] T017 [US4] Implement `update`, `delete` owner-scoped methods in `api/src/modules/playlists/playlists.service.ts`
- [X] T018 [US4] Add `GET /api/v1/playlists/:id`, `PUT /api/v1/playlists/:id`, and `DELETE /api/v1/playlists/:id` to `api/src/modules/playlists/playlists.controller.ts` with optional JWT on GET per research.md R3
- [X] T019 [US4] Create `client/src/pages/PlaylistDetailPage.tsx` with track list, owner remove/delete actions, and public/private badge per `contracts/playlists-ui.md`
- [X] T020 [US4] Register route `/playlists/:id` in `client/src/App.tsx` and extend `client/src/hooks/usePlaylists.ts` with `usePlaylist`, `useUpdatePlaylist`, `useDeletePlaylist`, `useRemoveTrackFromPlaylist`

---

## Phase 7: User Story 5 — Add to Playlist from Track Page (Priority: P2)

**Goal**: Logged-in user adds current track to a selected playlist from track detail

**Independent Test**: VS-805 — Add to playlist on `/tracks/:id` succeeds; track appears in playlist detail

- [X] T021 [US5] Add `useAddTrackToPlaylist()` to `client/src/hooks/usePlaylists.ts`
- [X] T022 [US5] Add playlist selector and "Add to playlist" control on `client/src/pages/TrackPage.tsx` per `contracts/playlists-ui.md`
- [X] T023 [P] [US5] Add optional "My playlists" link on `client/src/pages/DiscoverPage.tsx` header navigating to `/playlists`

---

## Phase 8: Polish & Cross-Cutting

- [X] T024 Run migration 008 via `yarn workspace @ngoma/api migrations:run` and confirm `playlists` and `playlist_tracks` tables exist
- [X] T025 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T026 Document VS-801–VS-805 validation results in `specs/008-user-playlists/quickstart.md`
- [X] T027 Regression-check discover, checkout, and tip flows unchanged (SC-803)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5) → Phase 8
- US2 depends on US1 (need playlist to add tracks)
- US3 depends on US1 (list shows created playlists)
- US4 depends on US2 (detail shows tracks)
- US5 depends on US2 + US3 (selector uses mine list + add API)
- Phase 2 T003–T004 parallel after T002

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Foundational | T003, T004 | Entities/DTOs after T002 |
| US1 client | T009 | Hook parallel to T007–T008 after Phase 2 |
| US5 nav | T023 | Independent of T021–T022 |

### Suggested MVP scope

Phases 1–5 (US1–US3) — **15 tasks** (T001–T015)

Delivers create playlist, add/remove tracks API, and My Playlists page. Detail and track-page add (US4–US5) can follow.

### Full feature

All phases — **27 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Create playlist | VS-801 | T007–T009 |
| US2 Add/remove tracks | VS-802 | T010–T011 |
| US3 Browse mine | VS-803 | T012–T015 |
| US4 Public detail | VS-804 | T016–T020 |
| US5 Track page add | VS-805 | T021–T023 |
| Regression | SC-803 | T027 |

---

## Notes

- New `playlists` module — register in `app.module.ts`
- `@ApiTags('Playlists')` on controller; Swagger bearer auth on mutating routes
- Only published, active tracks may be added
- `isCurated` always false in this feature; no admin seed
