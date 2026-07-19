# Implementation Plan: Artist Video Posts

**Branch**: `021-artist-video-posts` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/021-artist-video-posts/spec.md`

## Summary

Add **artist video posts** as free-to-watch promotional content. New NestJS **`videos`** module with TypeORM migration, extended **`MediaService.saveVideo()`**, artist upload wizard on dashboard, public **video detail + stream** pages, and a **Discover** videos section. Mirrors existing track upload/stream patterns without payment integration.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM, existing `MediaService`, `S3StorageService`
- Client: React 18, TanStack Query, FormWizard, shadcn/ui

**Storage**: PostgreSQL 15+ — new `videos` table migration; video files in S3/local via `MediaService`

**Testing**: Manual quickstart VS-2101–2104; optional media validation unit tests

**Target Platform**: Web SPA (mobile-first video player)

**Project Type**: Yarn monorepo — new `api/src/modules/videos/` + client pages/components

**Performance Goals**: Stream start < 3s on local/S3; upload validation before persist

**Constraints**:
- No transcoding pipeline in MVP
- Max 200 MB; MP4/WebM only
- Free videos only — no payments module changes
- Constitution: module under `api/src/modules/videos/`

**Scale/Scope**: ~12 API files, ~6 client files, 1 migration

**Reference**: `api/src/modules/tracks/`, `client/src/components/tracks/TrackUploadForm.tsx`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] New module `api/src/modules/videos/` with standard layout
- [x] No alternate backend/frontend roots
- [x] TypeORM migration for `videos` table
- [x] Routes under `/api/v1/`, DTOs, JwtAuthGuard on mutating artist routes
- [x] Client in `client/src/` with TanStack Query hooks
- [x] No payment/webhook changes required

**Post-design re-check**: PASS — parallel content module; no constitution violations.

## Project Structure

### Documentation (this feature)

```text
specs/021-artist-video-posts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── videos-api.md
│   ├── video-upload-ui.md
│   └── video-discovery-ui.md
└── tasks.md             # /speckit-tasks
```

### Source Code

```text
api/src/modules/videos/
├── videos.module.ts
├── videos.controller.ts
├── videos.service.ts
├── entities/video.entity.ts
└── dto/

api/src/modules/media/media.service.ts    # add saveVideo()
api/database/migrations/*-CreateVideos.ts

api/src/modules/discovery/                # add recent videos endpoint
api/src/modules/artists/artists.controller.ts  # GET :id/videos (optional)

client/src/
├── hooks/useVideos.ts
├── components/videos/VideoUploadForm.tsx
├── pages/VideoPage.tsx
├── pages/DiscoverPage.tsx                # Videos section
└── pages/ArtistDashboardPage.tsx         # upload section
```

**Structure Decision**: Mirror tracks module; extend media + discovery rather than bloating tracks.

## Phase 0: Research ✅

See [research.md](./research.md).

## Phase 1: Design ✅

- [data-model.md](./data-model.md)
- [contracts/](./contracts/)
- [quickstart.md](./quickstart.md)

## Implementation Phases (for tasks.md)

1. Migration + Video entity + VideosModule registered in `app.module.ts`
2. MediaService.saveVideo + validation
3. VideosService/Controller — CRUD, upload, stream
4. Discovery recent videos + artist public list
5. Client: useVideos, VideoUploadForm, VideoPage, Discover section
6. Polish: lint, build, quickstart validation

## Out of Scope

Video monetization, transcoding/HLS, embeds, live stream, comments.
