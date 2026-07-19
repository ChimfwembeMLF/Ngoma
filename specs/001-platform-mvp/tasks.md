# Tasks: Ngoma Platform MVP

**Input**: Design documents from `/specs/001-platform-mvp/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in spec — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Bootstrap mako-aligned monorepo from empty repo

- [X] T001 Create root `package.json` with Yarn 4 workspaces for `api` and `client` (mirror `mako/package.json`)
- [X] T002 [P] Scaffold NestJS API in `api/` using `mako/api` as reference (`nest-cli.json`, `tsconfig.json`, `src/main.ts`, `src/app.module.ts`)
- [X] T003 [P] Scaffold React + Vite client in `client/` using `mako/client` as reference (`vite.config.ts`, `src/main.tsx`, `src/App.tsx`)
- [X] T004 Create `docker-compose.yml` with postgres, redis, api, and client services per plan.md
- [X] T005 [P] Add `api/.env.example` with DATABASE_URL, JWT secrets, Redis, PawaPay sandbox vars
- [X] T006 [P] Configure Vite dev proxy in `client/vite.config.ts` (`/api` → `http://localhost:4000`)
- [X] T007 [P] Add Tailwind + shadcn/ui base config in `client/tailwind.config.ts` and `client/src/index.css`
- [X] T008 Copy TypeORM data-source pattern into `api/database/data-source.ts` from `mako/api/database/data-source.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story

**⚠️ CRITICAL**: No user story work until this phase completes

- [X] T009 Create migration `api/database/migrations/1719000000001-InitialUsersArtists.ts` for users and artists tables per data-model.md
- [X] T010 [P] Create User entity in `api/src/modules/user/entities/user.entity.ts`
- [X] T011 [P] Create Artist entity in `api/src/modules/artists/entities/artist.entity.ts`
- [X] T012 Implement TypeORM config factory in `api/src/database/ormconfig.ts`
- [X] T013 Configure global ValidationPipe and exception filter in `api/src/main.ts` and `api/src/filters/http-exception.filter.ts`
- [X] T014 [P] Add HealthModule in `api/src/modules/health/health.module.ts` and `health.controller.ts` at `/api/v1/health`
- [X] T015 [P] Configure Swagger in `api/src/setup-swagger.ts`
- [X] T016 Register ThrottlerModule and AppThrottlerGuard in `api/src/app.module.ts` and `api/src/common/guards/app-throttler.guard.ts`
- [X] T017 Create shared API response types in `api/src/common/dto/api-response.dto.ts`
- [X] T018 [P] Create API client wrapper in `client/src/lib/api-client.ts` with auth header injection
- [X] T019 [P] Add React Router routes skeleton in `client/src/App.tsx` (auth, discover, dashboard placeholders)
- [X] T020 Run initial migration and verify `GET /api/v1/health` returns 200

**Checkpoint**: Database migrated, API boots, client dev server proxies to API

---

## Phase 3: User Story 1 — Account Registration & Sign-In (Priority: P1) 🎯 MVP

**Goal**: Users register, sign in, and view profile with JWT auth

**Independent Test**: Register artist account → sign in → `GET /api/v1/auth/me` returns user + role (VS-1 in quickstart.md)

### Implementation for User Story 1

- [X] T021 [P] [US1] Create RegisterDto in `api/src/modules/auth/dto/register.dto.ts` with class-validator rules
- [X] T022 [P] [US1] Create LoginDto in `api/src/modules/auth/dto/login.dto.ts`
- [X] T023 [US1] Implement AuthService in `api/src/modules/auth/auth.service.ts` (bcrypt hash, JWT + refresh tokens)
- [X] T024 [US1] Implement JwtStrategy in `api/src/modules/auth/strategies/jwt.strategy.ts` and JwtAuthGuard in `api/src/modules/auth/guards/jwt-auth.guard.ts`
- [X] T025 [US1] Implement AuthController in `api/src/modules/auth/auth.controller.ts` (`POST register`, `login`, `refresh`, `GET me`) per contracts/auth.md
- [X] T026 [US1] Register AuthModule and UserModule in `api/src/app.module.ts`
- [X] T027 [P] [US1] Implement UserService profile read in `api/src/modules/user/user.service.ts`
- [X] T028 [P] [US1] Create RolesGuard in `api/src/modules/auth/guards/roles.guard.ts` and `@Roles()` decorator in `api/src/modules/auth/decorators/roles.decorator.ts`
- [X] T029 [P] [US1] Create useAuth hook in `client/src/hooks/useAuth.ts` (register, login, logout, me via TanStack Query)
- [X] T030 [US1] Build AuthPage with register/login forms in `client/src/pages/AuthPage.tsx` (React Hook Form + Zod)
- [X] T031 [US1] Add auth token persistence in `client/src/lib/auth-storage.ts` and route guards in `client/src/components/ProtectedRoute.tsx`

**Checkpoint**: US1 complete — new user can register, login, and see profile

---

## Phase 4: User Story 2 — Artist Profile & Track Publishing (Priority: P2)

**Goal**: Artists create profile, upload tracks, set price, publish

**Independent Test**: Artist uploads MP3, sets 10 ZMW price, publishes → track appears on dashboard (VS-2)

### Implementation for User Story 2

- [X] T032 Create migration `api/database/migrations/1719000000002-TracksAlbums.ts` for albums and tracks tables
- [X] T033 [P] [US2] Create Album entity in `api/src/modules/albums/entities/album.entity.ts`
- [X] T034 [P] [US2] Create Track entity in `api/src/modules/tracks/entities/track.entity.ts`
- [X] T035 [P] [US2] Implement MediaModule storage service in `api/src/modules/media/media.service.ts` (Supabase or local `api/uploads/`)
- [X] T036 [US2] Implement ArtistsService and ArtistsController in `api/src/modules/artists/artists.service.ts` and `artists.controller.ts` (`GET :id`, `PUT profile`)
- [X] T037 [US2] Create track DTOs in `api/src/modules/tracks/dto/create-track.dto.ts` and `update-track.dto.ts`
- [X] T038 [US2] Implement TracksService in `api/src/modules/tracks/tracks.service.ts` (CRUD, publish/unpublish, owner checks)
- [X] T039 [US2] Implement TracksController in `api/src/modules/tracks/tracks.controller.ts` per contracts/tracks.md
- [X] T040 [US2] Add multipart upload endpoint in `api/src/modules/tracks/tracks.controller.ts` for audio and cover art
- [X] T041 [P] [US2] Implement AlbumsModule basic CRUD in `api/src/modules/albums/albums.module.ts`, `albums.service.ts`, `albums.controller.ts`
- [X] T042 [P] [US2] Create useTracks hook in `client/src/hooks/useTracks.ts`
- [X] T043 [US2] Build ArtistProfileSetup form in `client/src/pages/ArtistProfilePage.tsx`
- [X] T044 [US2] Build ArtistDashboardPage with track list and upload UI in `client/src/pages/ArtistDashboardPage.tsx`
- [X] T045 [US2] Create TrackUploadForm component in `client/src/components/tracks/TrackUploadForm.tsx`

**Checkpoint**: US2 complete — artist can publish priced track visible on dashboard

---

## Phase 5: User Story 3 — Mobile Money Purchase (Priority: P3)

**Goal**: Listeners pay via PawaPay; webhook grants download access and records earnings

**Independent Test**: Sandbox payment completes → download_access + earnings rows created (VS-3)

### Implementation for User Story 3

- [X] T046 Create migration `api/database/migrations/1719000000003-PaymentsAccess.ts` for payments, download_access, earnings tables
- [X] T047 [P] [US3] Create Payment entity in `api/src/modules/payments/entities/payment.entity.ts`
- [X] T048 [P] [US3] Create DownloadAccess entity in `api/src/modules/tracks/entities/download-access.entity.ts`
- [X] T049 [P] [US3] Create Earnings entity in `api/src/modules/payments/entities/earnings.entity.ts`
- [X] T050 [US3] Port PawaPay client to `api/src/modules/payments/pawapay.client.ts` from `mako/api/src/modules/payments/pawapay.client.ts`
- [X] T051 [US3] Implement PaymentsService in `api/src/modules/payments/payments.service.ts` (initiate deposit, webhook handler, status poll, history)
- [X] T052 [US3] Implement PaymentsController in `api/src/modules/payments/payments.controller.ts` per contracts/payments.md
- [X] T053 [US3] Implement webhook side effects: update payment, create DownloadAccess, create Earnings in `api/src/modules/payments/payments.service.ts`
- [X] T054 [P] [US3] Create InitiatePaymentDto in `api/src/modules/payments/dto/initiate-payment.dto.ts`
- [X] T055 [P] [US3] Create usePayments hook in `client/src/hooks/usePayments.ts`
- [X] T056 [US3] Build CheckoutPage with mobile-money provider selection in `client/src/pages/CheckoutPage.tsx`
- [X] T057 [US3] Add payment status polling UI in `client/src/components/payments/PaymentStatusPanel.tsx`

**Checkpoint**: US3 complete — paid track purchase grants download access

---

## Phase 6: User Story 4 — Music Discovery & Playback (Priority: P4)

**Goal**: Public browse/search, in-browser streaming, secure download for entitled users

**Independent Test**: Visitor browses tracks, plays audio, downloads after purchase (VS-4)

### Implementation for User Story 4

- [X] T058 [P] [US4] Implement DiscoveryService in `api/src/modules/discovery/discovery.service.ts` (trending, new-releases, PostgreSQL FTS search)
- [X] T059 [US4] Implement DiscoveryController in `api/src/modules/discovery/discovery.controller.ts` per contracts/discovery.md
- [X] T060 [US4] Add stream endpoint `GET /api/v1/tracks/:id/stream` in `api/src/modules/tracks/tracks.controller.ts` with play count increment
- [X] T061 [US4] Add download endpoint `GET /api/v1/tracks/:id/download` in `api/src/modules/tracks/tracks.controller.ts` with DownloadAccess check
- [X] T062 [P] [US4] Create useDiscovery hook in `client/src/hooks/useDiscovery.ts`
- [X] T063 [US4] Build DiscoverPage with paginated track grid in `client/src/pages/DiscoverPage.tsx`
- [X] T064 [US4] Build TrackPage with metadata and buy/play actions in `client/src/pages/TrackPage.tsx`
- [X] T065 [US4] Implement AudioPlayer component with Howler.js in `client/src/components/player/AudioPlayer.tsx`
- [X] T066 [US4] Wire free-track and owned-track download buttons in `client/src/pages/TrackPage.tsx`

**Checkpoint**: US4 complete — full listener loop from discovery to playback/download

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Admin basics, validation, and production readiness

- [X] T067 [P] Add basic AdminModule user list/deactivate in `api/src/modules/admin/admin.controller.ts` and `admin.service.ts` (FR-011)
- [X] T068 [P] Add purchase history view in `client/src/pages/PurchaseHistoryPage.tsx` consuming `GET /api/v1/payments/history`
- [X] T069 Ensure all controllers have `@ApiTags` and protected routes use `@ApiBearerAuth()` in respective module controllers
- [X] T070 Run `yarn lint` in `api/` and `client/` workspaces and fix blocking issues
- [X] T071 Validate all quickstart.md scenarios VS-1 through VS-5 and document any gaps in `specs/001-platform-mvp/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2 + US1 (auth required for artist actions)
- **Phase 5 (US3)**: Depends on Phase 2 + US2 (priced tracks must exist)
- **Phase 6 (US4)**: Depends on Phase 2 + US2 (published tracks); integrates with US3 for paid downloads
- **Phase 7 (Polish)**: Depends on US1–US4

### User Story Dependencies

| Story | Depends on | Can test independently after |
|-------|------------|------------------------------|
| US1 | Foundational | Phase 3 complete |
| US2 | US1 + Foundational | Phase 4 complete |
| US3 | US2 + Foundational | Phase 5 complete |
| US4 | US2 (+ US3 for paid download) | Phase 6 complete |

### Within Each User Story

- Migration/entity → service → controller → client hook → page/component

---

## Parallel Opportunities

### Phase 1
```bash
# Run together after T001:
T002 Scaffold api/
T003 Scaffold client/
T005 api/.env.example
T006 client vite proxy
T007 Tailwind setup
```

### Phase 2
```bash
T010 User entity
T011 Artist entity
T014 HealthModule
T015 Swagger setup
T018 api-client.ts
T019 Router skeleton
```

### US1 parallel batch
```bash
T021 RegisterDto
T022 LoginDto
T027 UserService
T028 RolesGuard
T029 useAuth hook
```

### US2 parallel batch
```bash
T033 Album entity
T034 Track entity
T035 MediaModule
T041 AlbumsModule
T042 useTracks hook
```

---

## Parallel Example: User Story 3

```bash
T047 Payment entity
T048 DownloadAccess entity
T049 Earnings entity
T054 InitiatePaymentDto
T055 usePayments hook
# Then sequential: T050 → T051 → T052 → T053 → T056 → T057
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE** VS-1 from quickstart.md
5. Demo auth flow before continuing

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 → auth working → deploy/demo
3. US2 → artists publish content → deploy/demo
4. US3 → payments live (sandbox) → deploy/demo
5. US4 → listener experience complete → MVP launch candidate
6. Polish → admin + lint + full quickstart pass

### Suggested MVP Scope

**Minimum shippable increment**: Phases 1–3 (Setup + Foundational + US1) — **31 tasks**

**Full MVP (all four stories)**: Phases 1–6 — **66 tasks**

**Production-ready pass**: All phases — **71 tasks**

---

## Notes

- Reference implementation: `../mako/api/` and `../mako/client/` (sibling repo)
- All API routes MUST use `@Controller('api/v1/...')` prefix
- Register every new module in `api/src/app.module.ts`
- Never use `DB_SYNCHRONIZE=true` outside local dev bootstrap
- Payment module MUST follow `mako/api/src/modules/payments/` webhook patterns
