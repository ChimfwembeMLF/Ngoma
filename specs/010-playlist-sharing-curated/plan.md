# Implementation Plan: Playlist Sharing & Curated Playlists

**Branch**: `010-playlist-sharing-curated` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-playlist-sharing-curated/spec.md`

## Summary

Extend the existing **`playlists`** module (008) with **share slugs**, a **public share resolver API**, **curated playlist listing**, and **admin curated CRUD**. On the client, add **copy/share controls** on playlist detail, a **`/playlists/share/:slug` route**, and a **“Curated by Ngoma”** section on Discover. One migration adds `share_slug`; optional seed inserts demo curated playlists.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM (extend `Playlist` entity), existing `PlaylistsService`, `AdminModule`
- Client: React 18, Vite, TanStack Query, shadcn/ui (009)

**Storage**: PostgreSQL 15+ — migration `1719000000009-PlaylistShareCurated.ts`

**Testing**: Manual VS-1001–VS-1005 per `quickstart.md`

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — extend `api/src/modules/playlists/` + `admin/`; client pages/hooks

**Performance Goals**: Curated list cached-friendly (small cardinality); slug lookup indexed unique

**Constraints**:
- Extend 008 module — no duplicate playlists module
- Admin routes under `/api/v1/admin/playlists/curated`
- Public routes: `GET /playlists/curated`, `GET /playlists/share/:slug`
- Route order: `share/:slug` and `curated` before `:id` in controller
- `isCurated` only settable via admin API

**Scale/Scope**: 1 migration, ~5 new/extended API endpoints, admin controller methods, client share UX + Discover section

**Reference**: `PROJECT REQUIREMENTS.md` §4.1.4, §11.2 Week 17–18; `specs/008-user-playlists/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature extends `api/src/modules/playlists/` + `admin/` + `client/src/`
- [x] Schema change via TypeORM migration in `api/database/migrations/`
- [x] Endpoints use `/api/v1/`, DTOs, JwtAuthGuard / RolesGuard, Swagger tags
- [x] Client uses TanStack Query hooks; shadcn/ui components
- [x] No payment/webhook changes

**Post-design re-check**: PASS — extends existing modules; constitution satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/010-playlist-sharing-curated/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── playlists-share-api.md
│   ├── admin-curated-api.md
│   └── playlists-share-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
├── database/migrations/
│   └── 1719000000009-PlaylistShareCurated.ts
├── src/modules/
│   ├── playlists/
│   │   ├── playlists.controller.ts    # + curated, share/:slug
│   │   ├── playlists.service.ts       # + findBySlug, findCurated, slug gen
│   │   └── entities/playlist.entity.ts  # + shareSlug
│   └── admin/
│       ├── admin.controller.ts        # + curated playlist routes
│       └── admin.service.ts           # delegate to PlaylistsService

client/
├── src/
│   ├── hooks/usePlaylists.ts          # + useCuratedPlaylists, usePlaylistBySlug
│   ├── pages/
│   │   ├── DiscoverPage.tsx           # Curated section
│   │   └── PlaylistDetailPage.tsx     # Share / copy link
│   └── App.tsx                        # /playlists/share/:slug route
```

**Structure Decision**: Extend 008 playlists module rather than new module; admin curated routes live under `admin` with `RolesGuard` delegating to `PlaylistsService` curated methods.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/playlists-share-api.md](./contracts/playlists-share-api.md)
- [contracts/admin-curated-api.md](./contracts/admin-curated-api.md)
- [contracts/playlists-share-ui.md](./contracts/playlists-share-ui.md)
- [quickstart.md](./quickstart.md)
