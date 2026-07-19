# Tasks: Payments — Remaining Work

**Input**: Design documents from `/specs/020-payments-remaining-work/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `011-payments-pawapay-integration`, `013-payment-forms-ux`, `006-pwyw-pricing`, `007-artist-tipping`, `018-break-down-long-forms`

**Tests**: Manual quickstart VS-2001–VS-2005 required. Unit test for `normalizePaymentAmount()` included per plan (optional but recommended for FR-2003).

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm existing payments module and contracts before extending

- [X] T001 Verify payments module exists at `api/src/modules/payments/` with `payments.service.ts`, `pawapay.client.ts`, `payment-countries.ts`, and `GET /api/v1/payments/config` + `GET /api/v1/payments/mobile-money/options` in `api/src/modules/payments/payments.controller.ts`
- [X] T002 [P] Review contracts in `specs/020-payments-remaining-work/contracts/` — production-rollout, multi-country-catalog, amount-normalization, payouts-api

---

## Phase 2: Foundational — Amount Normalization Core

**Purpose**: Shared catalog metadata and normalizer required by US2 and US3 (Phase A, no migration)

**⚠️ CRITICAL**: US2 catalog extension and US3 deposit wiring depend on this phase

- [X] T003 Add `decimalsInAmount: 'NONE' | 'TWO'` to `PaymentCountryDefinition` and `PaymentCountryPublic` types in `api/src/modules/payments/payment-countries.ts`
- [X] T004 Create `normalizePaymentAmount()` and `getDecimalsInAmountForCurrency()` in `api/src/modules/payments/payment-amount.util.ts` per `specs/020-payments-remaining-work/contracts/amount-normalization.md`
- [X] T005 [P] Add Jest unit tests for `normalizePaymentAmount()` in `api/src/modules/payments/payment-amount.util.spec.ts` — cover XOF floor, ZMW two-decimal round, below-minimum rejection

**Checkpoint**: Normalizer ready; catalog type extended — US2/US3 can proceed

---

## Phase 3: User Story 1 — Production Mobile Money Go-Live (Priority: P1) 🎯 MVP

**Goal**: Production PawaPay env resolves correctly; webhook URL surfaced in config; gateway errors are user-friendly

**Independent Test**: VS-2001 — `GET /api/v1/payments/config` shows `environment: production`, `devAutoComplete: false`; production deposit hits `api.pawapay.io/v2`; webhook completes payment

- [X] T006 [US1] Extend `getPaymentConfig()` in `api/src/modules/payments/payments.service.ts` to return `webhookUrlConfigured: boolean` (non-empty `PAWAPAY_WEBHOOK_URL`) per `contracts/production-rollout.md`
- [X] T007 [US1] Verify production base URL resolution in `api/src/modules/payments/pawapay.client.ts` uses `https://api.pawapay.io/v2` when `PAWAPAY_ENV=production`; fix if legacy alias `PAWAPAY_ENVIRONMENT` not honored
- [X] T008 [US1] Wrap `postPawaPayDeposit()` failures in `api/src/modules/payments/payments.service.ts` (track + tip deposit paths) with try/catch — return friendly 502/503 message, log token/HTTP details server-side only (FR-2001 scenario 3)
- [X] T009 [P] [US1] Add production payment env block to `api/.env.example` — `PAWAPAY_ENV`, `PAWAPAY_PRODUCTION_API_TOKEN`, `PAWAPAY_WEBHOOK_URL`, `PAYMENTS_DEV_AUTO_COMPLETE=false` (no real tokens)

**Checkpoint**: Config health + production URL + error handling ready for operator rollout

---

## Phase 4: User Story 2 — Multi-Country Payment Catalog (Priority: P1)

**Goal**: 14-country catalog formalized with decimal metadata; options API and client surfaces show all merchant markets

**Independent Test**: VS-2002 — `GET /api/v1/payments/mobile-money/options` returns 14 entries; Kenya checkout shows M-Pesa; DRC USD separate from CDF

- [X] T010 [US2] Set `decimalsInAmount` on all 14 catalog entries in `api/src/modules/payments/payment-countries.ts` — `NONE` for XOF/XAF/RWF/UGX; `TWO` for ZMW/KES/USD/CDF/SLE per `contracts/multi-country-catalog.md`
- [X] T011 [US2] Add `getCountryById()` and `getDecimalsInAmountForCountry()` helpers in `api/src/modules/payments/payment-countries.ts` for service lookup
- [X] T012 [US2] Ensure `getMobileMoneyOptions()` in `api/src/modules/payments/payments.service.ts` returns only `enabled: true` countries and strips internal `pawapayCode` from public DTO
- [X] T013 [P] [US2] Expose `decimalsInAmount` on public country DTO in `api/src/modules/payments/payment-countries.ts` and `GET /api/v1/payments/mobile-money/options` response for client input hints
- [X] T014 [P] [US2] Verify `client/src/pages/CheckoutPage.tsx`, `client/src/pages/TipArtistPage.tsx`, and `client/src/pages/AuthPage.tsx` consume `usePaymentOptions()` — Kenya shows MPESA, DRC USD wallet distinct from CDF

**Checkpoint**: Catalog validated end-to-end; 14 countries visible in API and UI

---

## Phase 5: User Story 3 — Currency Amount Rules (Priority: P1)

**Goal**: Deposits send PawaPay-compliant amount strings; no fractional XOF/XAF/RWF/UGX rejected by gateway

**Independent Test**: VS-2003 — XOF deposit with 500.50 normalizes to `"500"` before POST; ZMW PWYW 10.50 sends `"10.50"`

- [X] T015 [US3] Call `normalizePaymentAmount()` in track deposit path in `api/src/modules/payments/payments.service.ts` before `postPawaPayDeposit()` — persist normalized amount on `Payment` entity
- [X] T016 [US3] Call `normalizePaymentAmount()` in tip deposit path in `api/src/modules/payments/payments.service.ts` before `postPawaPayDeposit()`
- [X] T017 [US3] Return `400 Bad Request` with clear message when normalized amount is below platform minimum in `api/src/modules/payments/payments.service.ts`
- [X] T018 [P] [US3] Update amount inputs in `client/src/pages/CheckoutPage.tsx` and `client/src/pages/TipArtistPage.tsx` — `step={1}` and helper text "Whole amounts only" when selected country has `decimalsInAmount: 'NONE'`

**Checkpoint**: Amount rules enforced API-side; client hints for no-decimal currencies

---

## Phase 6: User Story 4 — Artist Payouts (Priority: P2)

**Goal**: Artists request withdrawal; admins approve; PawaPay payout completes; balance reduced

**Independent Test**: VS-2004 — `POST /api/v1/payouts/request` → admin `PUT /api/v1/admin/payouts/:id` approve → COMPLETED; insufficient balance returns 400

- [X] T019 [US4] Create TypeORM migration `api/database/migrations/<timestamp>-CreatePayouts.ts` for `payouts` table per `specs/020-payments-remaining-work/data-model.md`
- [X] T020 [P] [US4] Create `Payout` entity and `PayoutStatus` enum in `api/src/modules/payouts/entities/payout.entity.ts`
- [X] T021 [P] [US4] Create DTOs `RequestPayoutDto` and `ProcessPayoutDto` in `api/src/modules/payouts/dto/`
- [X] T022 [US4] Scaffold `PayoutsModule`, `PayoutsService`, `PayoutsController` in `api/src/modules/payouts/` — register in `api/src/app.module.ts`
- [X] T023 [US4] Implement `getAvailableBalance(artistId)` in `api/src/modules/payouts/payouts.service.ts` — `SUM(earnings) - SUM(payouts in pending/completed states)` using `api/src/modules/payments/entities/earnings.entity.ts`
- [X] T024 [US4] Implement `requestPayout()` in `api/src/modules/payouts/payouts.service.ts` — validate balance, minimum amount, create PENDING row
- [X] T025 [US4] Add `postPawaPayPayout()` in `api/src/modules/payments/pawapay.client.ts` and `processPayout()` in `api/src/modules/payouts/payouts.service.ts` — approve triggers gateway payout, update status PROCESSING → COMPLETED/FAILED
- [X] T026 [US4] Add artist routes `GET /api/v1/payouts` and `POST /api/v1/payouts/request` in `api/src/modules/payouts/payouts.controller.ts` with JwtAuthGuard + artist role
- [X] T027 [US4] Add admin routes `GET /api/v1/admin/payouts` and `PUT /api/v1/admin/payouts/:id` in `api/src/modules/admin/admin.controller.ts` delegating to `PayoutsService` per `contracts/payouts-api.md`
- [X] T028 [P] [US4] Create `usePayouts` hook in `client/src/hooks/usePayouts.ts` — list, request, balance query
- [X] T029 [US4] Add payout request section to `client/src/pages/ArtistDashboardPage.tsx` — balance display, phone/operator form, request button
- [X] T030 [US4] Create `client/src/pages/AdminPayoutsPage.tsx` — pending queue, approve/reject actions; add route in `client/src/App.tsx`

**Checkpoint**: Full payout lifecycle works in sandbox

---

## Phase 7: User Story 5 — Admin Payment Operations (Priority: P3)

**Goal**: Admin overview shows payment config health and pending payout count without editing env files

**Independent Test**: VS-2005 — `/admin` shows PawaPay environment, webhook configured flag, enabled country count, pending payouts badge

- [X] T031 [US5] Extend admin dashboard payload in `api/src/modules/admin/admin.service.ts` — include `paymentHealth: { environment, webhookConfigured, enabledCountries, pendingPayouts }` from payments config + payouts count
- [X] T032 [US5] Add payment health cards to `client/src/pages/AdminOverviewPage.tsx` — environment badge, webhook status, country count
- [X] T033 [US5] Add pending payout count badge and link to `/admin/payouts` in `client/src/pages/AdminOverviewPage.tsx` and admin nav in `client/src/components/layout/AppShell.tsx`

**Checkpoint**: Admin has at-a-glance payment ops visibility

---

## Phase 8: Polish & Cross-Cutting

- [X] T034 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T035 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T036 Validate VS-2001–VS-2003 from `specs/020-payments-remaining-work/quickstart.md` in sandbox; document results in `quickstart.md`
- [X] T037 [P] Regression: re-run VS-1101–VS-1103 from `specs/011-payments-pawapay-integration/quickstart.md` after Phase A changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** (foundational normalizer)
- **Phase 3 (US1)** can start after Phase 1 — independent of Phase 2
- **Phase 4 (US2)** requires Phase 2 T003
- **Phase 5 (US3)** requires Phase 2 T004–T005 and US2 T010–T011
- **Phase 6 (US4)** requires Phase A complete (recommended); no hard dependency on US1–US3
- **Phase 7 (US5)** requires US4 T027 (pending payout count) + US1 T006 (config health)
- **Phase 8** last

### User Story Completion Order

```text
US1 (production config) ──┐
US2 (catalog) ──► US3 (amount rules) ──► Phase A MVP complete
US4 (payouts) ──► US5 (admin ops)
```

### Parallel Opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contract review |
| Foundational | T004, T005 | Util + tests after T003 |
| US1 | T007, T009 | Client URL vs env docs |
| US2 | T013, T014 | API DTO + client pages |
| US3 | T018 | Client hints parallel to T015–T017 |
| US4 entity layer | T020, T021, T028 | Entity, DTOs, hook |
| Polish | T034–T037 | Lint/build + validation |

### Suggested MVP Scope

**Phase A only (US1 + US2 + US3)** — **Tasks T001–T018** (~18 tasks): production go-live readiness + multi-country + amount rules. Skip payouts (US4) and admin ops (US5) until deposits are validated in production.

### Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 3 | — |
| US1 Production go-live | 4 | P1 |
| US2 Multi-country catalog | 5 | P1 |
| US3 Amount rules | 4 | P1 |
| US4 Payouts | 12 | P2 |
| US5 Admin payment ops | 3 | P3 |
| Polish | 4 | — |
| **Total** | **37** | |

### Independent Test Criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-2001 | Production config + deposit + webhook |
| US2 | VS-2002 | 14 countries in API + Kenya M-Pesa UI |
| US3 | VS-2003 | Integer XOF amounts; decimal ZMW preserved |
| US4 | VS-2004 | Payout request → approve → complete |
| US5 | VS-2005 | Admin payment health + pending badge |

---

## Implementation Strategy

### MVP First (Phase A — Deposits Go-Live)

1. Complete Phase 1–2 (setup + normalizer)
2. Complete Phase 3–5 (US1 + US2 + US3)
3. **STOP and VALIDATE**: VS-2001–VS-2003 + regression VS-1101–1103
4. Deploy with production env + webhook registration

### Incremental Delivery

1. Phase A → production deposits across 13 countries
2. Phase B (US4) → artist payouts in sandbox
3. Phase C (US5) → admin visibility
4. Each increment independently testable per quickstart

---

## Notes

- Never commit `PAWAPAY_PRODUCTION_API_TOKEN` — rotate if exposed
- Phase A requires **no migration**; US4 requires migration before service work
- Admin payout routes live under `api/src/modules/admin/admin.controller.ts` per existing admin pattern
- Reuse `pawapay.client.ts` for payout POST — do not duplicate HTTP client
