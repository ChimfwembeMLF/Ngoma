# Implementation Plan: User-Generated Playlists

**Branch**: `008-user-playlists` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-user-playlists/spec.md`

## Summary

Deliver the **first Phase 2 Week 17–18 slice** (`PROJECT REQUIREMENTS.md` §11.2): **user-generated playlists**. Add a new NestJS **`playlists`** module with `playlists` and `playlist_tracks` tables, REST API for CRUD and track membership, and client pages for My Playlists, playlist detail, and Add to playlist from track page.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM (`Playlist`, `PlaylistTrack`, existing `Track`, `User`)
- Client: React 18, Vite, TanStack Query, design system (003/004)

**Storage**: PostgreSQL 15+ — migration creates `playlists` and `playlist_tracks` tables

**Testing**: Manual VS-801–VS-805 per `quickstart.md`

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — `api/` + `client/`

**Performance Goals**: List/detail queries indexed on `user_id`; track add O(1)

**Constraints**:
- New module at `api/src/modules/playlists/`
- Routes under `/api/v1/playlists/`
- Register `PlaylistsModule` in `app.module.ts`
- Only published active tracks addable

**Scale/Scope**: 1 migration, 1 new API module (~6 endpoints), 3 client pages/hooks, TrackPage add control

**Reference**: `PROJECT REQUIREMENTS.md` §2323–2343, §4.1.4

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature maps to `api/src/modules/playlists/` + `client/src/pages/`
- [x] Schema via TypeORM migration in `api/database/migrations/`
- [x] Endpoints use `/api/v1/`, DTOs, JwtAuthGuard (public read optional), Swagger tags
- [x] Client uses TanStack Query hooks
- [x] No payment/webhook changes

**Post-design re-check**: PASS — constitution satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/008-user-playlists/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── playlists-api.md
│   └── playlists-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
├── database/migrations/
│   └── 1719000000008-UserPlaylists.ts
├── src/
│   ├── app.module.ts
│   └── modules/playlists/
│       ├── playlists.module.ts
│       ├── playlists.controller.ts
│       ├── playlists.service.ts
│       ├── entities/
│       │   ├── playlist.entity.ts
│       │   └── playlist-track.entity.ts
│       └── dto/

client/
├── src/
│   ├── App.tsx
│   ├── hooks/usePlaylists.ts
│   ├── pages/PlaylistsPage.tsx
│   ├── pages/PlaylistDetailPage.tsx
│   └── pages/TrackPage.tsx
```

**Structure Decision**: Dedicated `playlists` module — distinct domain from tracks CRUD; junction table for many-to-many membership.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/playlists-api.md](./contracts/playlists-api.md)
- [contracts/playlists-ui.md](./contracts/playlists-ui.md)
- [quickstart.md](./quickstart.md)
