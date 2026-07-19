# Tasks: Full PawaPay Payments Integration

**Input**: Design documents from `/specs/011-payments-pawapay-integration/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp` through `009-shadcn-spotify-redesign` (payments module, checkout, tips)

**Tests**: Not requested in spec — manual VS-1101–VS-1106 only.

---

## Phase 1: Setup — Environment Documentation

**Purpose**: Document payment env contract before code changes

- [X] T001 Update payment env block in `api/.env.example` per `specs/011-payments-pawapay-integration/contracts/pawapay-env.md` (PAYMENTS_DEV_AUTO_COMPLETE, PAWAPAY_ENV, tokens, base URLs, webhook URL, optional signature keys)

---

## Phase 2: Foundational — Config Resolution (User Story 3)

**Purpose**: Unified env resolution and ops config endpoint — blocks all PawaPay stories

**Independent Test**: VS-1103 — `GET /api/v1/payments/config` returns sandbox mode with pawapayEnabled true

- [X] T002 Create `api/src/common/payments.config.ts` with `resolvePawaPayEnvironment()`, `isPawapayEnabled()`, `isDevAutoCompleteEnabled()`, and `resolveWebhookUrl()` per research.md R1–R2
- [X] T003 Refactor `api/src/modules/payments/pawapay.client.ts` to resolve sandbox vs production token (`PAWAPAY_API_TOKEN`, `PAWAPAY_PRODUCTION_API_TOKEN`, legacy fallbacks) and base URLs per research.md R1
- [X] T004 Replace implicit `NODE_ENV=development` auto-complete with `PAYMENTS_DEV_AUTO_COMPLETE` flag in `api/src/modules/payments/payments.service.ts` (auto-complete only when flag true AND no token)
- [X] T005 Implement `getPaymentConfig()` returning non-secret ops payload in `api/src/modules/payments/payments.service.ts` per `contracts/payments-api.md`
- [X] T006 Add `GET /api/v1/payments/config` (no auth) to `api/src/modules/payments/payments.controller.ts` with Swagger docs

**Checkpoint**: Config endpoint works; legacy env vars still resolve; dev auto-complete gated by explicit flag

---

## Phase 3: User Story 1 — Live Track Purchase via PawaPay (Priority: P1)

**Goal**: Real PawaPay sandbox deposit for track purchase with metadata persistence

**Independent Test**: VS-1101 — POST deposit → PENDING → poll COMPLETED → download access

- [X] T007 [US1] Require non-empty `phone` when PawaPay enabled in `initiateDeposit()` in `api/src/modules/payments/payments.service.ts` per research.md R5
- [X] T008 [US1] Validate SET_PRICE `dto.amount` matches `track.price` in `initiateDeposit()` in `api/src/modules/payments/payments.service.ts`
- [X] T009 [US1] Persist `transactionId` from PawaPay deposit response and set status PENDING (not dev auto-complete) in `initiateDeposit()` in `api/src/modules/payments/payments.service.ts`
- [X] T010 [US1] Enhance `getStatus()` to persist gateway metadata and complete on remote COMPLETED without failing on NOT_FOUND lookup in `api/src/modules/payments/payments.service.ts` per research.md R4

---

## Phase 4: User Story 2 — Webhook-Driven Completion (Priority: P1)

**Goal**: PawaPay v2 webhook parsing with idempotent side effects and error storage

**Independent Test**: VS-1102 — Simulated webhook COMPLETED → side effects once; FAILED stores error

- [X] T011 [US2] Refactor `handleWebhook()` to parse via `parsePawaPayDepositStatus()` first with legacy eventType fallback in `api/src/modules/payments/payments.service.ts` per research.md R3
- [X] T012 [US2] On FAILED webhook, persist `errorCode` and `errorMessage` on Payment row in `handleWebhook()` in `api/src/modules/payments/payments.service.ts` per FR-1105
- [X] T013 [US2] On COMPLETED webhook, extract and save `transactionId` from payload before `completePayment()` in `api/src/modules/payments/payments.service.ts`
- [X] T014 [US2] Verify idempotent `completePayment()` prevents duplicate DownloadAccess and Earnings rows in `api/src/modules/payments/payments.service.ts` per data-model.md

---

## Phase 5: User Story 4 — Artist Tips via Live PawaPay (Priority: P2)

**Goal**: Tip initiation uses same hardened PawaPay flow as deposits

**Independent Test**: VS-1104 — Tip → PENDING → complete → earnings source TIP

- [X] T015 [US4] Apply phone requirement, PENDING status, and transaction metadata persistence to `initiateTip()` in `api/src/modules/payments/payments.service.ts` mirroring US1 deposit changes

---

## Phase 6: User Story 5 — Payment Status Polling & Client UX (Priority: P2)

**Goal**: Checkout/tip pages validate phone, poll status, retry on failure, navigate on success

**Independent Test**: VS-1105 — Failed payment shows retry; completed checkout links to track

- [X] T016 [US5] Add `usePaymentConfig()` hook calling `GET /api/v1/payments/config` in `client/src/hooks/usePayments.ts`
- [X] T017 [US5] Extend `usePaymentStatus()` response type to include `errorMessage` in `client/src/hooks/usePayments.ts`
- [X] T018 [US5] Add `onRetry` callback and retry button for FAILED state in `client/src/components/payments/PaymentStatusPanel.tsx` per `contracts/payments-ui.md`
- [X] T019 [US5] Add phone validation (when pawapayEnabled), completion download link, and retry wiring in `client/src/pages/CheckoutPage.tsx`
- [X] T020 [US5] Add retry wiring and completion confirmation in `client/src/pages/TipArtistPage.tsx` per `contracts/payments-ui.md`
- [X] T021 [US5] Display `errorMessage` for FAILED payments in `client/src/pages/PurchaseHistoryPage.tsx`

---

## Phase 7: User Story 6 — Optional Webhook Signature (Priority: P3)

**Goal**: Verify PawaPay webhook signatures when keys configured

**Independent Test**: VS-1106 — Invalid signature → 401; no keys → webhook accepted with warning

- [X] T022 [US6] Create `api/src/modules/payments/pawapay-webhook.util.ts` with optional signature verification using `PAWAPAY_PUBLIC_KEY_ID` per research.md R7
- [X] T023 [US6] Apply signature check in webhook handler in `api/src/modules/payments/payments.controller.ts` (401 when keys set and invalid; skip when unset)

---

## Phase 8: Polish & Cross-Cutting

- [X] T024 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`; run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T025 Document VS-1101–VS-1106 validation results in `specs/011-payments-pawapay-integration/quickstart.md`
- [X] T026 Regression-check free track checkout skip, PWYW min validation, and self-tip 403 in `api/src/modules/payments/payments.service.ts` (SC-1103)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (US3 config) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US4) → Phase 6 (US5) → Phase 7 (US6) → Phase 8
- US1 and US2 can partially parallelize after Phase 2 (different methods in same service file — sequential recommended)
- US5 client depends on US1 API behavior + config endpoint (T006, T016)
- US6 optional after US2 webhook refactor

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| After T006 | T016 | Client config hook while API deposit work proceeds |
| US5 client | T018, T021 | Different client files after T017 |
| Polish | T024 | After all feature tasks |

### Suggested MVP scope

Phases 1–4 + Phase 6 checkout only (T001–T014, T016–T019) — **19 tasks**

Delivers sandbox track purchase, webhook completion, env config, and checkout UX. Tips (US4), tip page UX (T020), signature (US6) can follow.

### Full feature

All phases — **26 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Live track purchase | VS-1101 | T007–T010 |
| US2 Webhook completion | VS-1102 | T011–T014 |
| US3 Env config | VS-1103 | T001–T006 |
| US4 Tips via PawaPay | VS-1104 | T015 |
| US5 Client UX | VS-1105 | T016–T021 |
| US6 Webhook signature | VS-1106 | T022–T023 |
| Regression | SC-1103 | T026 |

---

## Notes

- No database migration — uses existing Payment columns
- Put sandbox token in `api/.env` only (gitignored); never commit secrets
- Webhook URL for local dev: use ngrok per quickstart.md
- Legacy `PAWAPAY_SANDBOX_API_TOKEN` and `PAWAPAY_ENVIRONMENT` remain supported via T003
