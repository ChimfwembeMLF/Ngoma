# Feature Specification: Full PawaPay Payments Integration

**Feature Branch**: `011-payments-pawapay-integration`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Fully integrate payments — PawaPay mobile money sandbox/production with real API token, webhooks, env config, track purchase + tips end-to-end"

**Depends on**: `001-platform-mvp` (payments module, checkout), `006-pwyw-pricing`, `007-artist-tipping`, `009-shadcn-spotify-redesign`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Track Purchase via PawaPay (Priority: P1)

A signed-in listener buys a priced or PWYW track using mobile money. The API calls PawaPay sandbox with the configured token; the listener sees a USSD prompt message and payment status updates to COMPLETED when PawaPay confirms.

**Why this priority**: Core monetization path exists in stub/dev-auto-complete mode but does not exercise real PawaPay with the provided sandbox credentials.

**Independent Test**: VS-1101 — Initiate deposit for SET_PRICE track → PawaPay POST succeeds → status poll or webhook → download access granted.

**Acceptance Scenarios**:

1. **Given** `PAWAPAY_API_TOKEN` and sandbox env, **When** listener pays on checkout, **Then** API returns `PENDING` and message “Check your phone for USSD prompt”.
2. **Given** PawaPay reports COMPLETED, **When** status is polled, **Then** payment is COMPLETED and download access exists.
3. **Given** `PAYMENTS_DEV_AUTO_COMPLETE=false`, **When** token is configured, **Then** payment is NOT auto-completed without PawaPay confirmation.

---

### User Story 2 - Webhook-Driven Payment Completion (Priority: P1)

PawaPay sends deposit status callbacks to the Ngoma API webhook. Successful deposits complete payments idempotently (download access, earnings, tips).

**Why this priority**: Production relies on webhooks; polling alone is insufficient at scale.

**Independent Test**: VS-1102 — POST simulated PawaPay v2 callback → payment COMPLETED → side effects applied once.

**Acceptance Scenarios**:

1. **Given** a PENDING payment, **When** webhook payload status is COMPLETED, **Then** payment completes and side effects run once.
2. **Given** duplicate COMPLETED webhook, **When** received again, **Then** no duplicate earnings or download rows.
3. **Given** FAILED webhook, **When** received, **Then** payment status FAILED with error stored.

---

### User Story 3 - Standardized Payment Environment Config (Priority: P1)

Operators configure sandbox vs production using unified env vars: `PAWAPAY_ENV`, token, base URLs, webhook URL, and explicit dev auto-complete flag.

**Why this priority**: Current `.env` uses legacy names (`PAWAPAY_ENVIRONMENT`, `PAWAPAY_SANDBOX_API_TOKEN`) and dev auto-completes when token missing.

**Independent Test**: VS-1103 — Sandbox env resolves sandbox URL + token; production env resolves prod URL + prod token.

**Acceptance Scenarios**:

1. **Given** `PAWAPAY_ENV=sandbox`, **When** deposit initiated, **Then** requests go to `PAWAPAY_BASE_URL_SANDBOX`.
2. **Given** `PAWAPAY_ENV=production`, **When** deposit initiated, **Then** requests use production token and `PAWAPAY_BASE_URL_PROD`.
3. **Given** legacy `PAWAPAY_SANDBOX_API_TOKEN` only, **When** `PAWAPAY_API_TOKEN` unset, **Then** legacy var still works (backward compatible).

---

### User Story 4 - Artist Tips via Live PawaPay (Priority: P2)

Tips use the same PawaPay deposit flow as track purchases with TIP purpose and 95% artist earnings on completion.

**Independent Test**: VS-1104 — Tip artist → PawaPay pending → complete → tip row + earnings with source TIP.

**Acceptance Scenarios**:

1. **Given** valid tip payload, **When** initiated with PawaPay configured, **Then** deposit created with purpose TIP.
2. **Given** completed tip, **When** artist views tips received, **Then** tip appears with amount and message.

---

### User Story 5 - Payment Status Polling & Client UX (Priority: P2)

Checkout and tip pages poll payment status, show clear states (pending/completed/failed), and allow retry on failure.

**Independent Test**: VS-1105 — Failed payment shows error; user can retry without stale depositId.

**Acceptance Scenarios**:

1. **Given** initiated payment, **When** user waits on checkout, **Then** `PaymentStatusPanel` polls every 3s until terminal state.
2. **Given** FAILED status, **When** displayed, **Then** user sees retry affordance.
3. **Given** COMPLETED track purchase, **When** panel updates, **Then** user can navigate to download track.

---

### User Story 6 - Optional Webhook Signature Verification (Priority: P3)

When `PAWAPAY_PUBLIC_KEY_ID` and signature headers are present, webhook requests are verified; when keys unset, webhooks accepted in dev (logged warning).

**Independent Test**: VS-1106 — Valid signature passes; invalid signature returns 401.

**Acceptance Scenarios**:

1. **Given** keys configured, **When** webhook lacks valid signature, **Then** 401 Unauthorized.
2. **Given** keys not configured, **When** webhook received in development, **Then** processed with warning log.

---

### Edge Cases

- PawaPay returns NOT_FOUND on status poll → remain PENDING, do not fail immediately.
- Phone number normalization for Zambia (260 prefix).
- SET_PRICE amount must match track price; PWYW must meet minPrice.
- Gateway timeout → payment stays PENDING; user can poll.
- Self-tip forbidden (403).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-1101**: System MUST resolve PawaPay config from `PAWAPAY_ENV`, `PAWAPAY_API_TOKEN`, `PAWAPAY_PRODUCTION_API_TOKEN`, base URLs per research.md.
- **FR-1102**: System MUST use `PAYMENTS_DEV_AUTO_COMPLETE` (default `false`) instead of implicit `NODE_ENV=development` auto-complete when token absent.
- **FR-1103**: System MUST POST deposits to PawaPay v2 `/deposits` with Zambia MMO providers (`MTN_MOMO_ZMB`, `AIRTEL_OAPI_ZMB`, `ZAMTEL_ZMB`).
- **FR-1104**: System MUST handle webhooks at `POST /api/v1/payments/webhook` and align parsing with PawaPay v2 callback shape.
- **FR-1105**: System MUST persist `transactionId`, `errorCode`, `errorMessage` from PawaPay responses when available.
- **FR-1106**: System MUST complete TRACK_DOWNLOAD and TIP side effects idempotently on COMPLETED.
- **FR-1107**: Client checkout and tip flows MUST require phone + provider when PawaPay is configured.
- **FR-1108**: System MUST expose `GET /api/v1/payments/config` (auth optional/admin) returning `{ mode, webhookUrl, providersConfigured }` for ops validation.
- **FR-1109**: `.env.example` MUST document all payment env vars without secrets.

### Key Entities

- **Payment** (existing): extend usage of `transactionId`, `errorCode`, `errorMessage`
- No new tables required

## Success Criteria *(mandatory)*

- **SC-1101**: VS-1101–VS-1105 pass against PawaPay sandbox with provided token.
- **SC-1102**: No silent dev auto-complete when `PAYMENTS_DEV_AUTO_COMPLETE=false` and token set.
- **SC-1103**: Track purchase and tip flows unchanged for API contract consumers (backward compatible paths).
- **SC-1104**: Webhook + poll both complete payments; idempotent side effects.

## Assumptions

- PawaPay sandbox token provided by user is valid for sandbox API.
- Webhook URL registered in PawaPay dashboard: `{API_PUBLIC_URL}/api/v1/payments/webhook` (use ngrok for local dev).
- Signature verification deferred to optional when keys empty (common in sandbox).
- Album bulk pricing, subscriptions, payouts automation out of scope.

## Out of Scope

- PawaPay payouts/refunds
- Paystack or other gateways
- Saved payment methods / wallet balance
- Invoice PDF generation
- Production key provisioning (document only)
