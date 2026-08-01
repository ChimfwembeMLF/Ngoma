# Tasks: Tekrem & Mako Ecosystem Integration

**Input**: Design documents from `/specs/025-tekrem-mako-integration/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/mako-integration-api.yaml](./contracts/mako-integration-api.yaml)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story, following the mako monorepo layout (`api/` and `client/`).

## Format: `[ID] [P?] [Story] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US3], [US4], [US5])
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base integration structure

- [ ] T001 Verify yarn workspace structural alignment in `api/package.json` and `client/package.json` for new integration dependencies (e.g., OIDC verification, axios)
- [ ] T002 [P] Scaffold NestJS module directory structure at `api/src/modules/marketing-integration/` with module stub `marketing-integration.module.ts`
- [ ] T003 [P] Scaffold client marketing routing boundaries and root layout at `client/src/pages/marketing/MarketingLayout.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database schema, TypeORM entities, and API module registration required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create foundational TypeORM entities in `api/src/modules/marketing-integration/entities/` (`tekrem-account-link.entity.ts`, `mako-promotion-campaign.entity.ts`, `smart-link-attribution.entity.ts`, and `fan-segment.entity.ts`)
- [ ] T005 Create TypeORM migration in `api/database/migrations/1722470000000-CreateMarketingIntegrationTables.ts` with required foreign keys, indexes, and constraints
- [ ] T006 [P] Register `MarketingIntegrationModule` and TypeORM entities within `api/src/app.module.ts`
- [ ] T007 [P] Create shared API HTTP client service for interacting with external Mako endpoints in `api/src/modules/marketing-integration/mako-http.service.ts`
- [ ] T008 [P] Initialize TanStack Query base marketing API hook in `client/src/hooks/useMarketingIntegration.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin independently

---

## Phase 3: User Story 1 - Unified Artist Identity via Tekrem ID (Priority: P1) 🎯 MVP

**Goal**: Enable seamless single sign-on (SSO) across Ngoma and Mako using Tekrem ID OpenID Connect Relying Party authentication without secondary credential prompts.

**Independent Test**: Register or log into Ngoma via Tekrem Auth OIDC flow, verify session establishment, and ensure navigation into Mako promotional workflows passes active OIDC session context without re-authenticating.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create OIDC callback DTO with validation annotations in `api/src/modules/auth/dto/tekrem-callback.dto.ts`
- [ ] T010 [US1] Implement OpenID Connect authorization code verification and token exchange methods in `api/src/modules/auth/tekrem-oidc.service.ts`
- [ ] T011 [US1] Add `/api/v1/auth/tekrem/callback` authentication endpoint protected with Swagger documentation in `api/src/modules/auth/tekrem-oidc.controller.ts`
- [ ] T012 [P] [US1] Build React OIDC authentication callback processing handler at `client/src/pages/auth/TekremCallbackPage.tsx`
- [ ] T013 [US1] Integrate Tekrem SSO login trigger and automated token refreshment logic into auth hooks in `client/src/lib/auth.tsx`

**Checkpoint**: At this point, User Story 1 is functional; artists authenticate once via Tekrem ID across the suite.

---

## Phase 4: User Story 2 - One-Click Song Promotion & Metadata Sync (Priority: P1)

**Goal**: Empower artists to promote a published song, album, or music video immediately with a single click by pre-filling release metadata into Mako's AI promotional campaign creator.

**Independent Test**: Click "Promote with Mako" on any published track in Ngoma; confirm that a campaign record is created locally and the artist is seamlessly redirected into Mako with track title, artwork, and streaming landing links pre-filled.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create release promotion payload validation DTO at `api/src/modules/marketing-integration/dto/promote-release.dto.ts`
- [ ] T015 [US2] Implement metadata bundling and Mako social campaign pre-fill URL generation service methods in `api/src/modules/marketing-integration/marketing-integration.service.ts`
- [ ] T016 [US2] Expose protected endpoint `@Post('promotions/prefill')` under prefix `/api/v1/marketing` in `api/src/modules/marketing-integration/marketing-integration.controller.ts`
- [ ] T017 [P] [US2] Build reusable one-click promotional modal dialog at `client/src/components/marketing/PromoteWithMakoDialog.tsx`
- [ ] T018 [US2] Build the artist promotional management overview dashboard at `client/src/pages/marketing/PromotionDashboardPage.tsx`
- [ ] T019 [US2] Wire promotion triggers into catalog track rows in `client/src/components/catalog/TrackRowActions.tsx`

**Checkpoint**: User Stories 1 and 2 both operate independently; artists authenticate via Tekrem ID and launch Mako promotions instantly.

---

## Phase 5: User Story 3 - Smart Link Generation & Conversion Tracking (Priority: P2)

**Goal**: Automatically generate traceable promotional URLs for releases and attribute downstream track purchases, downloads, or artist tips back to the originating social media campaigns.

**Independent Test**: Visit a smart link from an external referral channel (WhatsApp/IG), complete a track purchase or tip, and verify that the financial conversion is correctly ascribed to the campaign ID in TypeORM ledgers.

### Implementation for User Story 3

- [ ] T020 [P] [US3] Create smart link creation and visitor referral tracking DTOs in `api/src/modules/marketing-integration/dto/create-smart-link.dto.ts`
- [ ] T021 [US3] Implement slug formatting, redirection routing, and referral attribution logging in `api/src/modules/marketing-integration/smart-links.service.ts`
- [ ] T022 [US3] Expose smart link generator `@Post('smart-links')` and public redirection handler in `api/src/modules/marketing-integration/smart-links.controller.ts`
- [ ] T023 [US3] Integrate campaign conversion attribution hooks into payment verification fulfillment in `api/src/modules/payments/payments.service.ts`
- [ ] T024 [P] [US3] Create smart link generator and QR sharing UI component in `client/src/components/marketing/SmartLinkGenerator.tsx`

**Checkpoint**: Promotional campaigns now issue traceable URLs that reliably attribute direct music commerce revenue.

---

## Phase 6: User Story 4 - Unified ROI Analytics Dashboard (Priority: P2)

**Goal**: Pair Mako's advertising exposure metrics (impressions, link clicks, ad spend) with Ngoma's financial sales and tip ledgers to display consolidated Net ROI percentages per release.

**Independent Test**: Open the ROI analytics workspace during an active promotion and confirm that gross purchase revenue and advertising costs combine to calculate accurate Net ROI percentages.

### Implementation for User Story 4

- [ ] T025 [P] [US4] Create ROI parameter and filtering query DTO in `api/src/modules/marketing-integration/dto/roi-filter.dto.ts`
- [ ] T026 [US4] Implement Mako analytics fetchers and revenue compositing math in `api/src/modules/marketing-integration/roi-analytics.service.ts`
- [ ] T027 [US4] Add `@Get('analytics/roi')` endpoint protected with `JwtAuthGuard` in `api/src/modules/marketing-integration/marketing-integration.controller.ts`
- [ ] T028 [P] [US4] Build financial metric visualization card in `client/src/components/marketing/RoiSummaryCard.tsx`
- [ ] T029 [US4] Construct full unified return-on-investment analytics dashboard page in `client/src/pages/marketing/RoiAnalyticsPage.tsx`

**Checkpoint**: Artists have visibility into exact promotional profitability across all social channels.

---

## Phase 7: User Story 5 - Fan CRM & Automated Audience Intelligence (Priority: P3)

**Goal**: Organize fan engagement histories (favorite genres, tip amounts, repeat purchases) into actionable audience segmentation lists to power targeted outreach on future releases.

**Independent Test**: Perform recurring artist tips across a specific genre, inspect the audience intelligence table, and confirm fans are classified by genre preference and supporter tier (CASUAL/FAN/VIP).

### Implementation for User Story 5

- [ ] T030 [US5] Implement automated audience interaction aggregation and supporter tier calculations in `api/src/modules/marketing-integration/fan-crm.service.ts`
- [ ] T031 [US5] Expose `@Get('fans/segments')` endpoint with tier filtering in `api/src/modules/marketing-integration/marketing-integration.controller.ts`
- [ ] T032 [P] [US5] Build audience segmentation display and export table in `client/src/components/marketing/AudienceSegmentTable.tsx`
- [ ] T033 [US5] Build main Fan CRM profile management view at `client/src/pages/marketing/FanCrmPage.tsx`

**Checkpoint**: Complete ecosystem functionality delivered; artists manage identity, promotion, conversion, analytics, and CRM seamlessly.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, system security verification, code formatting, and validation testing

- [ ] T034 [P] Update OpenAPI Swagger integration specifications via `@ApiTags('Marketing')` across all new controllers in `api/src/modules/marketing-integration/`
- [ ] T035 Apply `@nestjs/throttler` rate limits to smart link redirection and public referral recording routes in `api/src/modules/marketing-integration/smart-links.controller.ts`
- [ ] T036 Run static linting and formatting validation across workspace suites (`yarn workspace api lint && yarn workspace client lint`)
- [ ] T037 Execute validation test scenarios documented in `specs/025-tekrem-mako-integration/quickstart.md` against local postgres and redis instances

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all user story phases being completed

### Within Each User Story

- TypeORM entities & migrations before services
- Service core logic before controllers and routes
- Controllers and API endpoints before React components and hooks
- Core functional UI before cross-cutting polish

### Parallel Opportunities

- Tasks marked `[P]` within Setup and Foundational phases can be executed simultaneously.
- Within each user story, DTO definitions and client UI skeleton components marked `[P]` can proceed in parallel with core service logic implementations.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)
1. Complete Phase 1 (Setup) and Phase 2 (Foundational database migration).
2. Complete Phase 3 (User Story 1) to enable Tekrem ID SSO authentication.
3. Complete Phase 4 (User Story 2) to unlock One-Click Release Promotion into Mako.
4. **STOP and VALIDATE**: Verify identity flow and metadata pre-filling independently before adding advanced tracking analytics.

---

## Phase 9: Convergence

- [x] T038 Apply `@nestjs/throttler` rate limit decorations (`@Throttle`) to public redirection and referral recording routes in `api/src/modules/marketing-integration/smart-links.controller.ts` per Constitution IV & T035 (`missing`)
- [x] T039 Create reusable audience segmentation display and export table component in `client/src/components/marketing/AudienceSegmentTable.tsx` per plan touchpoint & T032 (`missing`)
- [x] T040 Establish main Fan CRM profile management view at `client/src/pages/marketing/FanCrmPage.tsx` integrating `AudienceSegmentTable` per plan touchpoint & T033 (`partial`)
- [x] T041 Scaffold API e2e integration test verification suite at `api/test/marketing-integration.e2e-spec.ts` per plan touchpoint (`missing`)

