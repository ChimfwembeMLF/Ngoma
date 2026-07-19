# Tasks: Payment Forms UX — Countries, Flags & Mobile Operators

**Input**: Design documents from `/specs/013-payment-forms-ux/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `011-payments-pawapay-integration` (PawaPay deposit/tip, `payment-countries.ts`, Checkout + Tip pages)

**Tests**: Not requested in spec — manual VS-1301–VS-1305 only.

---

## Phase 1: Setup — Verify Payments Baseline

**Purpose**: Confirm extension points before catalog refactor

- [X] T001 Verify existing files: `api/src/modules/payments/payment-countries.ts`, `payments.service.ts`, `client/src/pages/CheckoutPage.tsx`, `client/src/pages/TipArtistPage.tsx`, `client/src/hooks/usePayments.ts`

---

## Phase 2: Foundational — Enriched Options API & Operator Mapping (User Story 4)

**Purpose**: Rich country/operator catalog and server-side PawaPay resolution — blocks all client form work

**Independent Test**: VS-1304 — `GET /api/v1/payments/mobile-money/options` returns `{ countries, defaultCountryId }` with flags and `displayName`; deposit accepts `operatorId`

- [X] T002 Refactor `api/src/modules/payments/payment-countries.ts` — add `flagEmoji(iso2)`, Zambia catalog with `zm-mtn`/`zm-airtel`/`zm-zamtel`, `displayName`, internal `pawapayCode`, `resolveOperator()`, `resolveOperatorByPawapayCode()`, `resolveCountry()` per research.md R9
- [X] T003 Change `listPaymentCountryOptions()` in `api/src/modules/payments/payment-countries.ts` to return `{ countries, defaultCountryId: 'ZM' }` — strip `pawapayCode` from public operator objects per `contracts/payment-options-api.md`
- [X] T004 [P] Add optional `operatorId` and `countryId` to `api/src/modules/payments/dto/initiate-payment.dto.ts` with validation (require `operatorId` OR legacy `provider`)
- [X] T005 [P] Add optional `operatorId` and `countryId` to `api/src/modules/payments/dto/initiate-tip.dto.ts` with same validation as deposit
- [X] T006 Add `resolveCorrespondent(dto)` private helper in `api/src/modules/payments/payments.service.ts` — map `operatorId` → PawaPay code; legacy `provider` pass-through; 400 friendly errors
- [X] T007 Update `initiateDeposit()` and `initiateTip()` in `api/src/modules/payments/payments.service.ts` to use `resolveCorrespondent()` and country `dialCode` from `resolveCountry(countryId)` for `normalizeMobileMoneyPhone()`
- [X] T008 Update Swagger docs on `GET mobile-money/options`, `POST deposit`, `POST tip` in `api/src/modules/payments/payments.controller.ts`

**Checkpoint**: curl options + deposit with `operatorId: zm-mtn` works; `provider` still accepted

---

## Phase 3: User Story 1 — Country Selector with Flag (Priority: P1)

**Goal**: Country displays with flag emoji, name, and currency; dial prefix on phone field

**Independent Test**: VS-1301 — Checkout shows 🇿🇲 Zambia · ZMW; phone hint +260

- [X] T009 [P] [US1] Extend `usePaymentOptions()` response types in `client/src/hooks/usePayments.ts` for `{ countries, defaultCountryId }` shape
- [X] T010 [US1] Add country selector/badge section to `client/src/components/payments/MobileMoneyForm.tsx` — flag + name + currency; Select when multiple countries, static badge when one (Zambia MVP)
- [X] T011 [US1] Add dial prefix (`+{dialCode}`) and `phonePlaceholder` to phone input in `client/src/components/payments/MobileMoneyForm.tsx`

**Checkpoint**: Country + phone prefix render correctly in isolation or Storybook-style mount

---

## Phase 4: User Story 2 — User-Friendly Operator Selection (Priority: P1)

**Goal**: Operator cards with consumer names; client submits `operatorId` only

**Independent Test**: VS-1302 — UI shows "MTN Mobile Money"; POST body has `operatorId: zm-mtn`

- [X] T012 [P] [US2] Create `client/src/components/payments/OperatorOption.tsx` — selectable card/radio row with `displayName`, 📱 icon, selected border per `contracts/mobile-money-form-ui.md`
- [X] T013 [US2] Add operator radio/card list to `client/src/components/payments/MobileMoneyForm.tsx` using `OperatorOption` — no PawaPay codes in DOM or state
- [X] T014 [US2] Update `useInitiatePayment()` and tip hook in `client/src/hooks/usePayments.ts` / `client/src/hooks/useTips.ts` to send `operatorId`, `countryId`, `phone` (remove raw `provider` from client calls)

**Checkpoint**: Form state uses `operatorId`; network request excludes PawaPay strings

---

## Phase 5: User Story 3 — Shared Mobile Money Form (Priority: P1)

**Goal**: Checkout and Tip use one `MobileMoneyForm` component

**Independent Test**: VS-1303 — Identical country/operator/phone UX on checkout and tip pages

- [X] T015 [US3] Complete `MobileMoneyForm` controlled props API (`value`, `onChange`, `pawapayEnabled`, `disabled`) in `client/src/components/payments/MobileMoneyForm.tsx`
- [X] T016 [US3] Replace inline provider/phone fields in `client/src/pages/CheckoutPage.tsx` with `MobileMoneyForm`; wire currency from selected country
- [X] T017 [US3] Replace inline provider/phone fields in `client/src/pages/TipArtistPage.tsx` with `MobileMoneyForm`

**Checkpoint**: Both pages share form; SC-1303 satisfied

---

## Phase 6: User Story 5 — Purchase History Friendly Labels (Priority: P2)

**Goal**: History shows "MTN Mobile Money" instead of raw PawaPay code

**Independent Test**: VS-1305 — `/purchases` row shows friendly operator label

- [X] T018 [US5] Enrich `history()` items with `providerDisplayName` via `resolveOperatorByPawapayCode()` in `api/src/modules/payments/payments.service.ts`
- [X] T019 [US5] Display `providerDisplayName` (fallback to `provider`) in `client/src/pages/PurchaseHistoryPage.tsx`

---

## Phase 7: Polish & Cross-Cutting

- [X] T020 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T021 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T022 Validate VS-1301–VS-1305 from `specs/013-payment-forms-ux/quickstart.md` and document results in quickstart.md
- [X] T023 Regression-check PWYW min, free track skip, self-tip 403 unchanged in `api/src/modules/payments/payments.service.ts`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (US4 API) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US5) → Phase 7
- US1–US3 client depends on Phase 2 options API shape and `operatorId` deposit/tip acceptance
- US2 operator cards depend on US1 `MobileMoneyForm` shell (sequential phases 3 → 4)
- US3 page integration depends on complete form (Phase 5 after 3+4)
- US5 independent after Phase 2 mapping helpers exist

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| After T002 | T004, T005 | Deposit + tip DTOs in parallel |
| US1 + US2 prep | T009, T012 | Hook types + OperatorOption while form shell built |
| Polish | T020, T021 | API and client lint/build in parallel |

### Suggested MVP scope

Phases 1–5 — **17 tasks** (T001–T017)

Delivers full checkout/tip UX with countries, flags, friendly operators, and shared form. History labels (US5) can follow.

### Full feature

All phases — **23 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US4 Options API & mapping | VS-1304 | T002–T008 |
| US1 Country + flag | VS-1301 | T009–T011 |
| US2 Friendly operators | VS-1302 | T012–T014 |
| US3 Shared form | VS-1303 | T015–T017 |
| US5 History labels | VS-1305 | T018–T019 |
| Build/regression | — | T020–T023 |

---

## Notes

- No database migration — catalog in `payment-countries.ts` only
- Legacy `provider` (PawaPay code) kept on API for scripts; client must not send after T014
- MVP: only Zambia `enabled: true` in catalog response
- Operator display names: MTN Mobile Money, Airtel Money, Zamtel Kwacha (FR-1302)
