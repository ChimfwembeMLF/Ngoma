# Implementation Plan: Advanced Media Player & Playlists

**Branch**: `024-advanced-media-player` | **Date**: 2026-07-31 | **Spec**: [specs/024-advanced-media-player/spec.md](specs/024-advanced-media-player/spec.md)

**Input**: Feature specification from `/specs/024-advanced-media-player/spec.md`

## Summary

Enhance the audio player with queue management, repeat controls, and playlist autoplay functionality. Also, allow users to reorder tracks within playlists and add an external link to video posts.
**Additional Plan Fixes ("Playlist Add & Queue UX")**: 
1. Make the Queue/Playlist (`ListMusic`) icon button in `AudioPlayer.tsx` interactive to open a pop-over/drawer displaying all tracks currently in the playback queue.
2. Provide an interactive "Add Tracks" search & selection UI directly inside `PlaylistDetailPage.tsx` so users can search and add songs to their playlist without navigating away.
3. Polish the "Add to Playlist" card carousel on `TrackPage.tsx` with clearer visual states and verified cache invalidation so updated track lists and counts are instantly visible everywhere.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM, @nestjs/jwt, @nestjs/throttler, class-validator, BullMQ
- Client: React 18, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod

**Storage**: PostgreSQL 15+ (TypeORM entities + migrations in `api/database/migrations/`)

**Testing**: Jest (`api/test/`, `api/src/**/*.spec.ts`), Vitest (`client/src/**/*.test.tsx`)

**Target Platform**: Web (mobile-first SPA + REST API)

**Project Type**: Yarn-workspace monorepo — `api/` (NestJS) + `client/` (React + Vite)

**Constraints**: Follow `mako/api` module layout; all routes under `/api/v1/`; no Prisma/Next.js/Express

**Reference**: `PROJECT REQUIREMENTS.md`, `mako/api/` and `mako/client/` for structural conventions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature maps to `api/src/modules/<feature>/` (new module) or extends an existing module
- [x] No alternate backend/frontend roots introduced
- [x] Schema changes use TypeORM migrations (not synchronize-only in shared envs)
- [x] API endpoints use `/api/v1/`, DTOs, JwtAuthGuard, Swagger tags
- [x] Client work stays in `client/src/` with TanStack Query for server state
- [x] Payment/webhook work reuses payments module patterns from `mako/api`

## Project Structure

### Documentation (this feature)

```text
specs/024-advanced-media-player/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
api/
├── src/
│   ├── modules/
│   │   ├── playlists/
│   │   │   ├── playlist.controller.ts
│   │   │   ├── playlist.service.ts
│   │   │   ├── entities/playlist-track.entity.ts
│   │   │   └── dto/reorder-playlist.dto.ts
│   │   └── videos/
│   │       ├── entities/video.entity.ts
│   │       └── dto/
├── database/
│   └── migrations/

client/
├── src/
│   ├── providers/PlayerProvider.tsx
│   ├── components/player/AudioPlayer.tsx
│   └── components/playlists/
```

**Structure Decision**: Ngoma uses the mako monorepo layout. Backend features are NestJS
modules under `api/src/modules/`. Frontend features are pages/components under
`client/src/`. Cross-cutting API code goes in `api/src/common/`.
