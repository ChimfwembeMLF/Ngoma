# Tasks: Artist Tipping

**Input**: Design documents from `/specs/007-artist-tipping/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics`, `006-pwyw-pricing`

**Tests**: Not requested in spec — manual VS-701–VS-705 only.

---

## Phase 1: Setup — Migration

**Purpose**: `tips` table and enum constraint extensions

- [X] T001 Create migration `api/database/migrations/1719000000007-ArtistTipping.ts` with `tips` table, `idx_tips_artist_created`, nullable `earnings.track_id`, and CHECK updates for `TIP` on `payments.purpose` and `earnings.source` per data-model.md

---

## Phase 2: Foundational — Entities & DTOs

**Purpose**: Payment/tip data model — blocks all user stories

- [X] T002 Create `api/src/modules/payments/entities/tip.entity.ts` with artistId, userId, amount, paymentId, message, trackId, isAnonymous, createdAt per data-model.md
- [X] T003 [P] Add `TIP` to `PaymentPurpose` enum in `api/src/modules/payments/entities/payment.entity.ts`
- [X] T004 [P] Add `TIP` to `EarningsSource` enum and make `trackId` nullable in `api/src/modules/payments/entities/earnings.entity.ts`
- [X] T005 [P] Create `api/src/modules/payments/dto/initiate-tip.dto.ts` with artistId, amount (≥1), provider, phone, optional message (max 500), optional trackId per `contracts/tips-api.md`
- [X] T006 Register `Tip` entity and `TipsController` in `api/src/modules/payments/payments.module.ts`

**Checkpoint**: Entities load; no tip routes wired yet

---

## Phase 3: User Story 1 — Fan Sends a Tip (Priority: P1)

**Goal**: Listener tips artist via mobile money with preset or custom amount ≥ ZMW 1; 95% artist earnings on completion

**Independent Test**: VS-701 — Listener tips ZMW 10 → payment COMPLETED, tip + earnings rows created

- [X] T007 [US1] Implement `initiateTip(userId, dto)` in `api/src/modules/payments/payments.service.ts` mirroring deposit flow with `purpose: TIP`, `itemId: artistId`, self-tip forbidden (403), min amount ZMW 1 per research.md R5
- [X] T008 [US1] Extend `completePayment()` in `api/src/modules/payments/payments.service.ts` for `TIP`: create `tips` row, create `earnings` with `source: TIP`, `TIP_PLATFORM_FEE_RATE = 0.05` (95% artist share) per research.md R3
- [X] T009 [US1] Add `POST /api/v1/payments/tip` to `api/src/modules/payments/payments.controller.ts` with `JwtAuthGuard` and Swagger docs per `contracts/tips-api.md`
- [X] T010 [P] [US1] Create `client/src/hooks/useTips.ts` with `useInitiateTip()` calling `/api/v1/payments/tip`
- [X] T011 [US1] Create `client/src/pages/TipArtistPage.tsx` with preset chips (5/10/25/50), custom amount, provider, phone, and `PaymentStatusPanel` per `contracts/tip-ui.md`
- [X] T012 [US1] Register route `/tip/:artistId` in `client/src/App.tsx` loading `TipArtistPage`

---

## Phase 4: User Story 2 — Tip from Track Page (Priority: P1)

**Goal**: Track detail links to tip flow with artist and optional track context

**Independent Test**: VS-701 UI — "Tip artist" from `/tracks/:id` opens tip page for correct artist; completed tip stores optional `trackId`

- [X] T013 [US2] Validate optional `trackId` belongs to target artist in `initiateTip()` in `api/src/modules/payments/payments.service.ts`
- [X] T014 [US2] Add "Tip artist" link on `client/src/pages/TrackPage.tsx` to `/tip/{artistId}?trackId={trackId}` when logged in per `contracts/tip-ui.md`
- [X] T015 [US2] Read `trackId` search param in `client/src/pages/TipArtistPage.tsx` and pass to `useInitiateTip()` mutation

---

## Phase 5: User Story 3 — Tip Earnings in Analytics (Priority: P2)

**Goal**: Confirm 005 dashboard aggregates include tip earnings without API changes

**Independent Test**: VS-703 — After tip, artist dashboard net earnings and unique supporters update

- [X] T016 [US3] Verify `api/src/modules/analytics/analytics.service.ts` summary queries include TIP earnings via existing `SUM(earnings.amount)` — document PASS or fix if filtered by source

---

## Phase 6: User Story 4 — Optional Message & Tip List (Priority: P3)

**Goal**: Message stored on tip; artist views recent tips with fan name and message

**Independent Test**: VS-702 / VS-704 — Tip with message appears in `GET /api/v1/tips/received`

- [X] T017 [US4] Create `api/src/modules/payments/tips.controller.ts` with `GET /api/v1/tips/received`, `JwtAuthGuard`, `RolesGuard`, `@Roles(ARTIST)`, paginated tip list with tipper name per `contracts/tips-api.md`
- [X] T018 [US4] Add optional message textarea to `client/src/pages/TipArtistPage.tsx` (max 500 chars) per `contracts/tip-ui.md`
- [X] T019 [US4] Add `useTipsReceived()` to `client/src/hooks/useTips.ts` and optional "Recent tips" section on `client/src/pages/ArtistDashboardPage.tsx`

---

## Phase 7: Polish & Cross-Cutting

- [X] T020 Run migration 007 via `yarn workspace @ngoma/api migrations:run` and confirm `tips` table exists
- [X] T021 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T022 Document VS-701–VS-705 validation results in `specs/007-artist-tipping/quickstart.md`
- [X] T023 Regression-check SET_PRICE and PWYW checkout on `client/src/pages/CheckoutPage.tsx` (SC-703)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
- US2 depends on US1 tip API and page scaffold
- US3 depends on US1 completion creating TIP earnings
- US4 tip list depends on US1 tip records existing
- Phase 2 T003–T005 parallel after T002; T010 parallel with T011 after T009

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Foundational enums/DTO | T003, T004, T005 | After T002 entity |
| US1 client hook | T010 | Parallel to T011 after T009 |
| US4 can start API T017 after T008 | T017 | Independent of client message UI |

### Suggested MVP scope

Phases 1–4 (US1 + US2) — **15 tasks** (T001–T015)

Delivers full tip payment flow and track-page entry. Analytics verification and tip list (US3–US4) can follow.

### Full feature

All phases — **23 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Fan sends tip | VS-701, VS-705 | T001–T012 |
| US2 Track page entry | VS-701 UI | T013–T015 |
| US3 Analytics | VS-703 | T016 |
| US4 Message & list | VS-702, VS-704 | T017–T019 |
| Regression | SC-703 | T023 |

---

## Notes

- Reuse `PaymentStatusPanel` from checkout for tip status polling
- `GET /api/v1/artists/:id` already exists for artist name on tip page
- Do not change download `completePayment` branch (30% fee remains for TRACK_DOWNLOAD)
- Idempotent completion: guard against duplicate tip/earnings if payment already COMPLETED
