# Tasks: MVP Hardening & Convergence

**Input**: Design documents from `/specs/002-mvp-hardening/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp` (implemented)

**Tests**: Not requested in spec — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add dependencies and dev bootstrap scripts for hardening work

- [ ] T001 Add `music-metadata` dependency to `api/package.json` and run `yarn install`
- [ ] T002 [P] Create `api/scripts/seed-admin.sql` to promote a user to ADMIN by email (per research.md R3)
- [ ] T003 [P] Update `api/.env.example` with `DB_PORT=5433` and `PORT` conflict notes (per research.md R4)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema migration and admin API hardening required before user stories

**⚠️ CRITICAL**: No user story work until this phase completes

- [ ] T004 Create migration `api/database/migrations/1719000000004-TrackSearchFts.ts` adding `search_vector tsvector`, GIN index, and backfill from title/genre/artist name per data-model.md
- [ ] T005 Add self-deactivate guard in `api/src/modules/admin/admin.service.ts` (403 when admin deactivates own account per spec edge case)
- [ ] T006 [P] Add optional `role` query filter to `GET /api/v1/admin/users` in `api/src/modules/admin/admin.controller.ts` and `admin.service.ts` per contracts/admin.md
- [ ] T007 [P] Create `AdminRoute` role guard component in `client/src/components/AdminRoute.tsx` (redirect non-ADMIN users)
- [ ] T008 Run migration 004 and verify `search_vector` column exists on `tracks`

**Checkpoint**: FTS column migrated, admin API supports role filter and self-guard, client has admin route wrapper

---

## Phase 3: User Story 1 — Admin User Management UI (Priority: P1) 🎯 MVP

**Goal**: Admin views paginated user list and deactivates accounts from the client

**Independent Test**: Sign in as ADMIN → open `/admin/users` → deactivate test user → VS-101 in quickstart.md

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create `useAdminUsers` and `useDeactivateUser` hooks in `client/src/hooks/useAdmin.ts` (TanStack Query)
- [ ] T010 [P] [US1] Create `UserTable` component in `client/src/components/admin/UserTable.tsx` (email, name, role, status, join date, deactivate action)
- [ ] T011 [US1] Build `AdminUsersPage` with pagination and role filter in `client/src/pages/AdminUsersPage.tsx`
- [ ] T012 [US1] Register `/admin/users` route with `AdminRoute` in `client/src/App.tsx`
- [ ] T013 [US1] Add admin dashboard link for ADMIN role in `client/src/pages/DashboardPage.tsx`

**Checkpoint**: US1 complete — admin manages users without Swagger (VS-101)

---

## Phase 4: User Story 2 — Accurate Track Duration (Priority: P2)

**Goal**: Upload sets `tracks.duration`; client displays mm:ss on discovery and track pages

**Independent Test**: Artist uploads MP3 → `duration > 0` on API and UI → VS-102 in quickstart.md

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create `parseAudioDuration` helper in `api/src/modules/media/audio-metadata.util.ts` using `music-metadata`
- [ ] T015 [US2] Return parsed duration from `MediaService.saveAudio` in `api/src/modules/media/media.service.ts`
- [ ] T016 [US2] Persist `duration` in `TracksService.uploadFiles` in `api/src/modules/tracks/tracks.service.ts`
- [ ] T017 [P] [US2] Create `formatDuration(seconds)` util in `client/src/lib/format-duration.ts` (mm:ss)
- [ ] T018 [US2] Display duration on track cards in `client/src/pages/DiscoverPage.tsx`
- [ ] T019 [US2] Display duration on track detail in `client/src/pages/TrackPage.tsx`

**Checkpoint**: US2 complete — duration extracted and visible (VS-102)

---

## Phase 5: User Story 3 — Full-Text Search (Priority: P2)

**Goal**: Discovery search uses PostgreSQL FTS with relevance ranking

**Independent Test**: Publish tracks → search partial terms → ranked results → VS-103 in quickstart.md

### Implementation for User Story 3

- [ ] T020 [US3] Add `syncSearchVector(trackId)` in `api/src/modules/tracks/tracks.service.ts` (title + genre + artist name → tsvector)
- [ ] T021 [US3] Call `syncSearchVector` on track create, update, and publish in `api/src/modules/tracks/tracks.service.ts`
- [ ] T022 [US3] Replace ILIKE search with `plainto_tsquery` + `ts_rank` in `api/src/modules/discovery/discovery.service.ts` per contracts/discovery.md
- [ ] T023 [US3] Return 400 when `q` is missing or empty in `api/src/modules/discovery/discovery.controller.ts`
- [ ] T024 [US3] Sanitize FTS query input (strip/skip invalid `plainto_tsquery` tokens) in `discovery.service.ts`

**Checkpoint**: US3 complete — FTS search ranked and validated (VS-103)

---

## Phase 6: User Story 4 — Dev Environment & Quickstart Alignment (Priority: P3)

**Goal**: Developers run stack with port conflicts documented; quickstart scenarios pass

**Independent Test**: Follow quickstart port table → health OK → VS-104 regression passes

### Implementation for User Story 4

- [ ] T025 [P] [US4] Confirm Postgres host port `5433:5432` in `docker-compose.yml` and document in `specs/001-platform-mvp/quickstart.md`
- [ ] T026 [P] [US4] Update `specs/001-platform-mvp/quickstart.md` troubleshooting for API port conflicts and vite proxy alignment
- [ ] T027 [US4] Add proxy port comment in `client/vite.config.ts` referencing `api/.env` `PORT` value
- [ ] T028 [US4] Cross-link `specs/002-mvp-hardening/quickstart.md` admin bootstrap steps with `api/scripts/seed-admin.sql`

**Checkpoint**: US4 complete — onboarding docs match real dev setup (VS-104)

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Lint, validation, and regression pass

- [ ] T029 Run `yarn lint` in `api/` and `client/` workspaces and fix blocking issues
- [ ] T030 Validate VS-101 through VS-104 in `specs/002-mvp-hardening/quickstart.md`
- [ ] T031 Re-run VS-1 through VS-5 from `specs/001-platform-mvp/quickstart.md` and note results in `specs/002-mvp-hardening/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 1 (music-metadata); independent of US1
- **Phase 5 (US3)**: Depends on Phase 2 (migration 004)
- **Phase 6 (US4)**: Depends on Phases 3–5 (docs reference completed features)
- **Phase 7 (Polish)**: Depends on all user stories

### User Story Dependencies

| Story | Depends on | Can test independently after |
|-------|------------|------------------------------|
| US1 | Foundational | Phase 3 complete (needs seed-admin.sql + AdminRoute) |
| US2 | Setup (T001) | Phase 4 complete |
| US3 | Foundational (migration) | Phase 5 complete |
| US4 | US1–US3 | Phase 6 complete |

### Within Each User Story

- API/service changes → client hooks/pages → route registration

---

## Parallel Opportunities

### Phase 1
```bash
T002 seed-admin.sql
T003 .env.example updates
```

### Phase 2
```bash
T006 admin role filter (API)
T007 AdminRoute (client)
```

### US1 parallel batch
```bash
T009 useAdmin.ts
T010 UserTable.tsx
```

### US2 parallel batch
```bash
T014 audio-metadata.util.ts
T017 format-duration.ts
```

### US3 + US2 overlap
US2 (Phase 4) and US3 (Phase 5) can run in parallel after Phase 2 if different developers — no file conflicts between media util and discovery service.

### US4 parallel batch
```bash
T025 docker-compose.yml
T026 001 quickstart update
```

---

## Parallel Example: User Story 2

```bash
T014 parseAudioDuration util
T017 formatDuration client util
# Then sequential: T015 → T016 → T018 → T019
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Admin UI)
4. **STOP and VALIDATE** VS-101 from quickstart.md
5. Demo admin flow before continuing

### Incremental Delivery

1. Setup + Foundational → migration + admin API ready
2. US1 → admin UI → deploy/demo (closes FR-011 client gap)
3. US2 → duration on uploads → deploy/demo
4. US3 → FTS search → deploy/demo
5. US4 → docs alignment → onboarding fixed
6. Polish → lint + full quickstart pass

### Suggested MVP Scope

**Minimum shippable increment**: Phases 1–3 (Setup + Foundational + US1) — **13 tasks**

**Full hardening (all four stories)**: Phases 1–6 — **28 tasks**

**Production-ready pass**: All phases — **31 tasks**

---

## Notes

- Builds on `001-platform-mvp` — do not recreate existing modules
- Reference: `specs/001-platform-mvp/` for base contracts and entities
- FTS column is Postgres-only; TypeORM entity may omit `search_vector` and use raw queries
- Admin bootstrap: register user first, then run `api/scripts/seed-admin.sql`
- Local dev ports: Postgres **5433**, API **4000** or **4001** if conflict
