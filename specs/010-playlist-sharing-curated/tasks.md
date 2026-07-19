# Tasks: Playlist Sharing & Curated Playlists

**Input**: Design documents from `/specs/010-playlist-sharing-curated/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp` through `009-shadcn-spotify-redesign` (008 playlists module required)

**Tests**: Not requested in spec — manual VS-1001–VS-1005 only.

---

## Phase 1: Setup — Migration

**Purpose**: `share_slug` column and demo curated seed

- [X] T001 Create migration `api/database/migrations/1719000000009-PlaylistShareCurated.ts` adding `share_slug VARCHAR(80) UNIQUE`, partial index `idx_playlists_share_slug`, and seed 2–4 curated public playlists for ADMIN user per data-model.md and FR-1009

---

## Phase 2: Foundational — Entity & Slug Helpers

**Purpose**: Schema extension and slug generation — blocks share and curated stories

- [X] T002 Add `shareSlug` column mapping to `api/src/modules/playlists/entities/playlist.entity.ts` per data-model.md
- [X] T003 Implement private `generateShareSlug(name: string)` and `ensureShareSlug(playlist)` helpers in `api/src/modules/playlists/playlists.service.ts` per research.md R2 (immutable once set, collision suffix)
- [X] T004 Guard user `create()` and `update()` in `api/src/modules/playlists/playlists.service.ts` to reject or ignore `isCurated` and `shareSlug` from user DTOs per FR-1005

**Checkpoint**: Entity loads; slug helper unit-testable via service; user API unchanged for curated flags

---

## Phase 3: User Story 2 — Resolve Playlist by Share Slug (Priority: P1)

**Goal**: Public API and client route resolve playlists by human-readable slug

**Independent Test**: VS-1002 — `GET /api/v1/playlists/share/:slug` returns detail; invalid slug 404; private 403

- [X] T005 [US2] Implement `findBySlug(slug, userId?)` reusing `findOne` access rules in `api/src/modules/playlists/playlists.service.ts`
- [X] T006 [US2] Implement `ensureShareLink(userId, playlistId)` returning `{ shareSlug, shareUrl }` for public owner playlists in `api/src/modules/playlists/playlists.service.ts`
- [X] T007 [US2] Add `GET /api/v1/playlists/share/:slug` and `POST /api/v1/playlists/:id/share` to `api/src/modules/playlists/playlists.controller.ts` **before** `GET :id` per `contracts/playlists-share-api.md` route order

---

## Phase 4: User Story 1 — Copy Share Link (Priority: P1)

**Goal**: Owner or viewer copies share URL for public playlists; incognito open works

**Independent Test**: VS-1001 — Copy link from detail → incognito loads playlist

- [X] T008 [US1] Add `useEnsureShareLink()` mutation and share URL builder in `client/src/hooks/usePlaylists.ts` calling `POST /api/v1/playlists/:id/share`
- [X] T009 [US1] Add “Copy link” control on `client/src/pages/PlaylistDetailPage.tsx` for public playlists with success/error feedback per `contracts/playlists-share-ui.md`
- [X] T010 [US1] Register route `/playlists/share/:slug` in `client/src/App.tsx` and add `usePlaylistBySlug(slug)` to `client/src/hooks/usePlaylists.ts` wiring `PlaylistDetailPage.tsx` to resolve by slug

---

## Phase 5: User Story 3 — Curated Playlists on Discover (Priority: P1)

**Goal**: Discover shows “Curated by Ngoma” editorial section

**Independent Test**: VS-1003 — `/discover` lists seeded curated cards; click opens detail without owner actions

- [X] T011 [US3] Implement `findCurated()` returning summaries with `trackCount` and `shareSlug` in `api/src/modules/playlists/playlists.service.ts`
- [X] T012 [US3] Add `GET /api/v1/playlists/curated` (no auth) to `api/src/modules/playlists/playlists.controller.ts` before `:id` route per `contracts/playlists-share-api.md`
- [X] T013 [US3] Add `useCuratedPlaylists()` to `client/src/hooks/usePlaylists.ts`
- [X] T014 [US3] Add “Curated by Ngoma” card grid section on `client/src/pages/DiscoverPage.tsx` using shadcn `Card`; hide when empty per `contracts/playlists-share-ui.md`
- [X] T015 [US3] Hide owner delete/remove/toggle actions on `client/src/pages/PlaylistDetailPage.tsx` when `isCurated` is true (read-only editorial view)

---

## Phase 6: User Story 4 — Admin Manages Curated Playlists (Priority: P2)

**Goal**: Admin CRUD for curated playlists and track membership

**Independent Test**: VS-1004 — Admin creates curated playlist, adds track → appears in `GET /curated` and Discover

- [X] T016 [US4] Implement admin curated methods `createCurated`, `updateCurated`, `deleteCurated`, `addCuratedTrack`, `removeCuratedTrack`, `listCuratedAdmin` in `api/src/modules/playlists/playlists.service.ts` with `isCurated: true` and auto `shareSlug` on create
- [X] T017 [US4] Add curated routes to `api/src/modules/admin/admin.controller.ts` and delegate via `api/src/modules/admin/admin.service.ts` per `contracts/admin-curated-api.md`; ensure `PlaylistsModule` exported to `AdminModule` in `api/src/modules/admin/admin.module.ts`

---

## Phase 7: User Story 5 — Web Share API (Priority: P3)

**Goal**: Native share sheet on supported browsers with copy fallback

**Independent Test**: VS-1005 — Share button uses `navigator.share` or falls back to copy

- [X] T018 [US5] Add “Share” button on `client/src/pages/PlaylistDetailPage.tsx` calling `navigator.share({ title, url })` when available else copy link per `contracts/playlists-share-ui.md`

---

## Phase 8: Polish & Cross-Cutting

- [X] T019 Run migration 009 via `yarn workspace @ngoma/api migrations:run` and confirm `share_slug` column and curated seed rows
- [X] T020 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T021 Document VS-1001–VS-1005 validation results in `specs/010-playlist-sharing-curated/quickstart.md`
- [X] T022 Regression-check 008 user playlist CRUD, add-from-track, and private playlist 403 behavior (SC-1004, SC-1005)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US2 API) → Phase 4 (US1 client) → Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5) → Phase 8
- US1 depends on US2 (`POST /share` + slug route)
- US3 depends on curated seed (T001) and `GET /curated` (T011–T012); can ship with seed before US4 admin API
- US4 admin API optional for dev if migration seed satisfies VS-1003
- Controller route order critical: `curated`, `share/:slug`, `mine` before `:id`

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| After T005 | T008, T011 | Client hooks parallel if API stubs exist |
| US3 client | T013, T014 | After T012 |
| Polish | T020 | After all feature tasks |

### Suggested MVP scope

Phases 1–5 (T001–T015) — **15 tasks**

Delivers share slugs, copy link, slug route, curated Discover section, and migration seed. Admin CRUD API (US4) and Web Share (US5) can follow.

### Full feature

All phases — **22 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Copy share link | VS-1001 | T008–T010 |
| US2 Resolve by slug | VS-1002 | T005–T007, T010 |
| US3 Curated on Discover | VS-1003 | T011–T015, T001 seed |
| US4 Admin curated CRUD | VS-1004 | T016–T017 |
| US5 Web Share API | VS-1005 | T018 |
| Regression | SC-1004, SC-1005 | T022 |

---

## Notes

- Extends 008 `playlists` module — no new module
- Share URL uses client origin + `/playlists/share/{slug}`
- Admin UI page deferred — validate US4 via curl per quickstart
- UUID `/playlists/:id` routes remain backward compatible
