---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions (Ngoma / mako)

- **API module**: `api/src/modules/<feature>/`
- **TypeORM entity**: `api/src/modules/<feature>/entities/<name>.entity.ts`
- **DTO**: `api/src/modules/<feature>/dto/<name>.dto.ts`
- **Migration**: `api/database/migrations/<timestamp>-<Name>.ts`
- **Client page**: `client/src/pages/<Name>Page.tsx`
- **Client component**: `client/src/components/<feature>/`
- **Client hook/API**: `client/src/hooks/` or `client/src/lib/`
- **E2E test**: `api/test/<feature>.e2e-spec.ts`
- **Client test**: `client/src/<path>/<name>.test.tsx`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify yarn workspaces in root `package.json` with `api` and `client`
- [ ] T002 [P] Scaffold NestJS module folder at `api/src/modules/[feature]/`
- [ ] T003 [P] Configure client route/page stub at `client/src/pages/[Feature]Page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create TypeORM migration in `api/database/migrations/[timestamp]-[Feature].ts`
- [ ] T005 [P] Register `[Feature]Module` in `api/src/app.module.ts`
- [ ] T006 [P] Add JwtAuthGuard and Swagger tags to `api/src/modules/[feature]/[feature].controller.ts`
- [ ] T007 Create base entity in `api/src/modules/[feature]/entities/[feature].entity.ts`
- [ ] T008 [P] Add API client hook in `client/src/hooks/use[Feature].ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T009 [P] [US1] E2E test for endpoint in `api/test/[feature].e2e-spec.ts`
- [ ] T010 [P] [US1] Component test in `client/src/pages/[Feature]Page.test.tsx`

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create DTO in `api/src/modules/[feature]/dto/create-[feature].dto.ts`
- [ ] T012 [US1] Implement service methods in `api/src/modules/[feature]/[feature].service.ts`
- [ ] T013 [US1] Add controller routes in `api/src/modules/[feature]/[feature].controller.ts`
- [ ] T014 [US1] Build page UI in `client/src/pages/[Feature]Page.tsx`
- [ ] T015 [US1] Wire TanStack Query in `client/src/hooks/use[Feature].ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Implementation for User Story 2

- [ ] T016 [P] [US2] Extend entity in `api/src/modules/[feature]/entities/[feature].entity.ts`
- [ ] T017 [US2] Add service method in `api/src/modules/[feature]/[feature].service.ts`
- [ ] T018 [US2] Add client component in `client/src/components/[feature]/[Component].tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Update Swagger docs via `api/src/setup-swagger.ts` if new tags added
- [ ] TXXX Run `yarn lint` in `api/` and `client/`
- [ ] TXXX Run quickstart.md validation scenarios
- [ ] TXXX Security review: guards, DTO validation, rate limits on sensitive routes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- Migration/entity before service
- Service before controller
- Controller before client integration
- Core implementation before polish

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Entity + DTO + client hook can run in parallel within a story when files differ
- Different user stories can proceed in parallel after Foundational phase

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

---

## Notes

- Follow `mako/api` module naming: snake_case folders (`content_items`) or kebab-case files
- All API routes MUST use prefix `/api/v1/` in controllers
- Register every new module in `api/src/app.module.ts`
- Use TypeORM migrations for schema changes; never production `DB_SYNCHRONIZE=true`
- Client env: `VITE_API_BASE_URL`; dev proxy configured in `client/vite.config.ts`
