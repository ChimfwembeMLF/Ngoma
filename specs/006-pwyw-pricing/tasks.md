# Tasks: Pay What You Want Pricing

**Input**: Design documents from `/specs/006-pwyw-pricing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics`

**Tests**: Not requested in spec — manual VS-601–VS-604 only.

---

## Phase 1: Setup — Migration

**Purpose**: Add `min_price` column and expand `pricing_type` CHECK constraint

- [X] T001 Create migration `api/database/migrations/1719000000006-TrackPwywPricing.ts` adding `min_price DECIMAL(10,2)` and CHECK `pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE')` per research.md R3 and data-model.md

---

## Phase 2: Foundational — Track Entity & DTOs

**Purpose**: Backend pricing model extension — blocks all user stories

- [X] T002 Add `PAY_WHAT_YOU_WANT` to `PricingType` enum and `minPrice` column mapping in `api/src/modules/tracks/entities/track.entity.ts` per data-model.md
- [X] T003 [P] Extend `api/src/modules/tracks/dto/create-track.dto.ts` with `minPrice` validation (`ValidateIf` when `pricingType === PAY_WHAT_YOU_WANT`, `@Min(0.01)`) per `contracts/tracks-pricing.md`
- [X] T004 [P] Extend `api/src/modules/tracks/dto/update-track.dto.ts` with same `minPrice` validation and pricing-type transition rules per `contracts/tracks-pricing.md`
- [X] T005 Extend `create()`, `update()`, and `toPublicTrack()` in `api/src/modules/tracks/tracks.service.ts` to persist/clear `price` vs `minPrice` per pricing type matrix in data-model.md

**Checkpoint**: Track API accepts and returns PWYW fields; migration not yet applied

---

## Phase 3: User Story 1 — Artist Sets PWYW Minimum (Priority: P1)

**Goal**: Artist selects Pay What You Want and sets minimum on upload; track saved with correct pricing fields

**Independent Test**: VS-601 — Artist creates PWYW track with min ZMW 5 → API returns `pricingType: PAY_WHAT_YOU_WANT`, `minPrice: 5`, `price: null`

- [X] T006 [P] [US1] Extend `Track` type and create/update mutation bodies in `client/src/hooks/useTracks.ts` with `PAY_WHAT_YOU_WANT` and `minPrice` per `contracts/checkout-ui.md`
- [X] T007 [US1] Add pricing type selector (Set price / Pay what you want / Free) and conditional price/min-price inputs in `client/src/components/tracks/TrackUploadForm.tsx` per `contracts/checkout-ui.md`
- [X] T008 [US1] Display PWYW minimum in artist track list rows on `client/src/pages/ArtistDashboardPage.tsx` when `pricingType === 'PAY_WHAT_YOU_WANT'`

---

## Phase 4: User Story 2 — Listener Chooses Amount at Checkout (Priority: P1)

**Goal**: Listener pays chosen amount ≥ minimum; payment completes; download access and earnings recorded

**Independent Test**: VS-602 — Listener pays ZMW 10 on min ZMW 5 track → payment completes, download works; VS-603 rejects ZMW 3

- [X] T009 [US2] Extend `initiateDeposit()` in `api/src/modules/payments/payments.service.ts` to accept `PAY_WHAT_YOU_WANT` tracks, validate `amount >= track.minPrice`, reject below minimum with 400 per `contracts/payments-pwyw.md`
- [X] T010 [US2] Add editable amount input (prefilled with `minPrice`, client min validation) to `client/src/pages/CheckoutPage.tsx` when track is PWYW per `contracts/checkout-ui.md`
- [X] T011 [US2] Confirm paid download path treats PWYW like SET_PRICE (non-FREE requires access) in `api/src/modules/tracks/tracks.service.ts` `download()` — adjust only if regression found

---

## Phase 5: User Story 3 — Discovery and Track Detail Display (Priority: P2)

**Goal**: PWYW tracks show clear labels with minimum on discover and track detail; SET_PRICE/FREE unchanged

**Independent Test**: PWYW track on `/discover` and `/tracks/:id` shows pay-what-you-want labeling with minimum

- [X] T012 [P] [US3] Update `isPaid` logic and primary CTA to `Pay what you want · from ZMW {minPrice}` in `client/src/pages/TrackPage.tsx` per `contracts/checkout-ui.md`
- [X] T013 [P] [US3] Add PWYW price label `PWYW from ZMW {minPrice}` in `client/src/components/ui/TrackCard.tsx` per `contracts/checkout-ui.md`
- [X] T014 [US3] Include `minPrice` in public track mapping in `api/src/modules/discovery/discovery.service.ts` and extend `client/src/hooks/useDiscovery.ts` track type

---

## Phase 6: User Story 4 — Analytics Reflects PWYW Earnings (Priority: P3)

**Goal**: Confirm 005 analytics includes PWYW purchases without code changes

**Independent Test**: VS-604 — After PWYW purchase, artist dashboard net earnings and per-track row reflect chosen amount

- [X] T015 [US4] Verify PWYW payments flow through existing `completePayment()` earnings in `api/src/modules/payments/payments.service.ts` (no schema/API changes expected — document if gap found)
- [X] T016 [US4] Manual regression: complete PWYW sandbox purchase and confirm `client/src/pages/ArtistDashboardPage.tsx` analytics sections update via existing `useAnalyticsDashboard()` hook

---

## Phase 7: Polish & Cross-Cutting

- [X] T017 Run migration 006 via `yarn workspace @ngoma/api migrations:run` and confirm `min_price` column and CHECK constraint exist
- [X] T018 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T019 Document VS-601–VS-604 validation results in `specs/006-pwyw-pricing/quickstart.md`
- [X] T020 Regression-check SET_PRICE checkout on `client/src/pages/CheckoutPage.tsx` and FREE download on `client/src/pages/TrackPage.tsx` (SC-605)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7
- US2 depends on US1 — listeners need PWYW tracks created by artists
- US3 can start after Phase 2 (API returns `minPrice`) but full E2E needs US1 published tracks
- US4 depends on US2 completing at least one PWYW payment
- Phase 2 T003–T004 parallel after T002; T006 parallel with T007 after Phase 2

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Foundational DTOs | T003, T004 | After T002 entity |
| US1 client | T006 | Hook types parallel to T007 after Phase 2 |
| US3 UI | T012, T013 | Different files after T014 API field exists |

### Suggested MVP scope

Phases 1–4 (US1 + US2) — **11 tasks** (T001–T011)

Delivers artist PWYW configuration and listener checkout end-to-end. Discovery labels (US3) can follow without blocking payment flow.

### Full feature

All phases — **20 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Artist PWYW config | VS-601 | T001–T008 |
| US2 Listener checkout | VS-602, VS-603 | T009–T011 |
| US3 Discovery labels | VS-601 UI | T012–T014 |
| US4 Analytics | VS-604 | T015–T016 |
| Regression | SC-605 | T020 |

---

## Notes

- No new NestJS module — extend `tracks` and `payments` only
- Reuse existing `POST /api/v1/payments/deposit` — no new payment routes
- `price` must be null for PWYW; `minPrice` must be null for SET_PRICE and FREE
- Currency ZMW only; platform fee rate unchanged from SET_PRICE
