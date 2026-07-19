# Tasks: Artist Video Posts

**Input**: Design documents from `/specs/021-artist-video-posts/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `018-break-down-long-forms`

**Tests**: Manual quickstart VS-2101–VS-2104; no automated test tasks unless added later.

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm track upload/stream patterns to mirror and review contracts

- [X] T001 Review track upload flow in `api/src/modules/tracks/tracks.service.ts` and `api/src/modules/tracks/tracks.controller.ts` as reference for videos module
- [X] T002 [P] Review contracts in `specs/021-artist-video-posts/contracts/` — videos-api, video-upload-ui, video-discovery-ui

---

## Phase 2: Foundational — Schema & Media (Blocking)

**Purpose**: Database, entity, and video file storage required by all user stories

**⚠️ CRITICAL**: No user story work until this phase completes

- [X] T003 Create TypeORM migration `api/database/migrations/<timestamp>-CreateVideos.ts` for `videos` table per `specs/021-artist-video-posts/data-model.md`
- [X] T004 [P] Create `Video` entity in `api/src/modules/videos/entities/video.entity.ts` matching migration columns
- [X] T005 Add `saveVideo()` to `api/src/modules/media/media.service.ts` — accept `.mp4`/`.webm`, max 200 MB, store under `videos/` folder per `contracts/videos-api.md`
- [X] T006 [P] Add video content-type mapping in `api/src/modules/media/s3-storage.service.ts` or `media.service.ts` for stream responses (`video/mp4`, `video/webm`)
- [X] T007 Scaffold `VideosModule`, register in `api/src/app.module.ts`, import `TypeOrmModule.forFeature([Video])`, `MediaModule`, `ArtistsModule`

**Checkpoint**: Migration runnable; entity registered; media can save video files

---

## Phase 3: User Story 1 — Artist Upload & Publish (Priority: P1) 🎯 MVP

**Goal**: Artist creates video metadata, uploads MP4/WebM + optional thumbnail, publishes, sees list on dashboard

**Independent Test**: VS-2101 — wizard on `/artist/dashboard` → published video in "Your videos" list

- [X] T008 [P] [US1] Create DTOs `CreateVideoDto`, `UpdateVideoDto` in `api/src/modules/videos/dto/`
- [X] T009 [US1] Implement `VideosService.create()`, `uploadFiles()`, `listMine()`, `publish()` in `api/src/modules/videos/videos.service.ts` — resolve artist from userId; block publish without `videoFileUrl`
- [X] T010 [US1] Add artist routes in `api/src/modules/videos/videos.controller.ts` — `POST /api/v1/videos`, `POST /api/v1/videos/:id/upload` (FileInterceptor video + optional thumbnail), `GET /api/v1/videos/mine`, `PUT /api/v1/videos/:id` with JwtAuthGuard + ARTIST role per `contracts/videos-api.md`
- [X] T011 [P] [US1] Create `useVideos.ts` in `client/src/hooks/useVideos.ts` — `useCreateVideo`, `useUploadVideoFiles`, `useUpdateVideo`, `useMyVideos`
- [X] T012 [US1] Create `VideoUploadForm` in `client/src/components/videos/VideoUploadForm.tsx` using `FormWizard` — Details → Video file → Publish; mirror `client/src/components/tracks/TrackUploadForm.tsx` per `contracts/video-upload-ui.md`
- [X] T013 [US1] Add `VideoUploadForm` and "Your videos" list to `client/src/pages/ArtistDashboardPage.tsx`

**Checkpoint**: End-to-end artist upload + publish via UI and API

---

## Phase 4: User Story 2 — Watch Published Video (Priority: P1)

**Goal**: Public video detail page with HTML5 player streaming from API

**Independent Test**: VS-2102 — `/videos/:id` plays MP4; draft returns 404 for anonymous users

- [X] T014 [US2] Implement `VideosService.findPublic()` and `stream()` in `api/src/modules/videos/videos.service.ts` — mirror `tracks.service.ts` stream via `MediaService.openReadStream()`; 404 if unpublished/inactive
- [X] T015 [US2] Add public routes `GET /api/v1/videos/:id` and `GET /api/v1/videos/:id/stream` in `api/src/modules/videos/videos.controller.ts`
- [X] T016 [P] [US2] Extend `useVideos.ts` with `useVideo(id)` query hook for public detail
- [X] T017 [US2] Create `VideoPage` in `client/src/pages/VideoPage.tsx` — `<video controls playsInline>` with stream URL, title, artist link, description per `contracts/video-discovery-ui.md`
- [X] T018 [US2] Add route `/videos/:id` in `client/src/App.tsx`

**Checkpoint**: Published video playable in browser without login

---

## Phase 5: User Story 3 — Discover & Artist Profile Videos (Priority: P2)

**Goal**: Published videos surface on Discover and artist public profile

**Independent Test**: VS-2103 — Discover "Videos" section; artist public page lists videos

- [X] T019 [US3] Add `GET /api/v1/discovery/videos/recent` in `api/src/modules/discovery/discovery.controller.ts` and `discovery.service.ts` — query published videos with artist join, order by `createdAt DESC`
- [X] T020 [US3] Add `GET /api/v1/artists/:id/videos` in `api/src/modules/artists/artists.controller.ts` delegating to `VideosService.listByArtistPublic()` in `api/src/modules/videos/videos.service.ts`
- [X] T021 [P] [US3] Create `VideoCard` component in `client/src/components/videos/VideoCard.tsx` — thumbnail, title, artist, duration badge
- [X] T022 [US3] Add "Videos" section to `client/src/pages/DiscoverPage.tsx` using `useRecentVideos()` hook in `client/src/hooks/useVideos.ts`
- [X] T023 [US3] Add published videos list to artist public view — extend `client/src/pages/TrackPage.tsx` artist section or add videos block on artist tracks route (`/artists/:id` if exists) per `contracts/video-discovery-ui.md`

**Checkpoint**: Published videos discoverable; hidden when unpublished

---

## Phase 6: User Story 4 — Manage Videos (Priority: P2)

**Goal**: Artists edit metadata, unpublish, and soft-delete videos from dashboard

**Independent Test**: VS-2104 — update title, unpublish (gone from discover), delete draft

- [X] T024 [US4] Implement `VideosService.update()` and `softDelete()` in `api/src/modules/videos/videos.service.ts` — ownership check; unpublish sets `isPublished: false`; delete sets `isActive: false`
- [X] T025 [US4] Wire `PUT /api/v1/videos/:id` and `DELETE /api/v1/videos/:id` in `api/src/modules/videos/videos.controller.ts` for metadata edit and soft delete
- [X] T026 [P] [US4] Add `useDeleteVideo` and `useUpdateVideo` mutations with cache invalidation in `client/src/hooks/useVideos.ts`
- [X] T027 [US4] Add edit/unpublish/delete actions to "Your videos" list on `client/src/pages/ArtistDashboardPage.tsx` — inline title edit or modal; confirm delete

**Checkpoint**: Full video lifecycle managed from artist dashboard

---

## Phase 7: Polish & Cross-Cutting

- [X] T028 Run `yarn workspace @ngoma/api migrations:run` and verify `videos` table exists
- [X] T029 Run `yarn workspace @ngoma/api lint:ci` and `yarn workspace @ngoma/api build`
- [X] T030 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T031 Validate VS-2101–VS-2104 from `specs/021-artist-video-posts/quickstart.md`; document results in `quickstart.md`
- [X] T032 [P] Regression: confirm track upload still works via `client/src/components/tracks/TrackUploadForm.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** (foundational)
- **Phase 3 (US1)** requires Phase 2
- **Phase 4 (US2)** requires US1 upload path (needs published video to test)
- **Phase 5 (US3)** requires US2 public video exists
- **Phase 6 (US4)** requires US1 list on dashboard; can parallel with US3 after US1
- **Phase 7** last

### User Story Completion Order

```text
Phase 2 (foundation)
  → US1 (upload/publish)
  → US2 (playback)
  → US3 (discover) ──┐
  → US4 (manage)  ───┴─ can overlap after US1
```

### Parallel Opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Reference + contracts |
| Foundation | T004, T006 | Entity + content-type while migration writes |
| US1 | T008, T011 | DTOs + client hook |
| US2 | T016 | Hook parallel to T014–T015 |
| US3 | T021 | VideoCard while API endpoints built |
| US4 | T026 | Delete hook parallel to T024–T025 |
| Polish | T029, T030, T032 | Lint/build parallel |

### Suggested MVP Scope

**Phases 1–4 (US1 + US2)** — **Tasks T001–T018** (~18 tasks): artist can publish a video and anyone can watch it. Add discover (US3) and manage (US4) as fast follow.

### Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 5 | — |
| US1 Upload & publish | 6 | P1 |
| US2 Watch video | 5 | P1 |
| US3 Discover & profile | 5 | P2 |
| US4 Manage videos | 4 | P2 |
| Polish | 5 | — |
| **Total** | **32** | |

### Independent Test Criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-2101 | Artist wizard upload + publish + dashboard list |
| US2 | VS-2102 | Public detail + stream + VideoPage player |
| US3 | VS-2103 | Discover section + artist public videos |
| US4 | VS-2104 | Edit, unpublish, delete |

---

## Implementation Strategy

### MVP First (Upload + Playback)

1. Complete Phase 1–2 (foundation)
2. Complete Phase 3–4 (US1 + US2)
3. **STOP and VALIDATE**: VS-2101 + VS-2102
4. Demo publish-and-watch flow

### Incremental Delivery

1. MVP → artists post promo clips
2. US3 → fans find videos on Discover
3. US4 → artists curate/unpublish library

---

## Notes

- Mirror `tracks` module patterns; do not add pricing/payment fields to `Video` entity
- `GET /api/v1/videos/mine` must be registered **before** `GET /api/v1/videos/:id` in controller to avoid route conflict
- Video stream uses same S3/local read path as audio — no transcoding
- Thumbnail optional; use placeholder in `VideoCard` when missing
