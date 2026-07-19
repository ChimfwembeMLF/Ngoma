# Research: Full PawaPay Payments Integration

**Feature**: 011-payments-pawapay-integration | **Date**: 2026-07-19

## R1: Environment variable contract

**Decision**: Standardize on user-provided names with legacy fallbacks:

| Primary | Legacy fallback |
|---------|-----------------|
| `PAWAPAY_ENV=sandbox\|production` | `PAWAPAY_ENVIRONMENT` |
| `PAWAPAY_API_TOKEN` (sandbox) | `PAWAPAY_SANDBOX_API_TOKEN` |
| `PAWAPAY_PRODUCTION_API_TOKEN` (prod) | — |
| `PAWAPAY_BASE_URL_SANDBOX` | `PAWAPAY_SANDBOX_API_URL` |
| `PAWAPAY_BASE_URL_PROD` | `PAWAPAY_API_URL` |
| `PAYMENTS_DEV_AUTO_COMPLETE=false` | (replaces implicit NODE_ENV dev bypass) |

**Rationale**: User supplied explicit contract; mako uses `PAWAPAY_API_TOKEN` + `PAWAPAY_ENV`; Ngoma already partially supports both naming schemes in `pawapay.client.ts`.

**Alternatives considered**:
- Single `PAWAPAY_API_TOKEN` for both envs — rejected; production needs separate secret

## R2: Dev auto-complete behavior

**Decision**: Auto-complete payments locally ONLY when `PAYMENTS_DEV_AUTO_COMPLETE=true` AND no PawaPay token configured. When token is set, always call PawaPay regardless of NODE_ENV.

**Rationale**: User set `PAYMENTS_DEV_AUTO_COMPLETE=false` to test real sandbox flow locally.

**Alternatives considered**:
- Always auto-complete in development — rejected; blocks sandbox validation

## R3: Webhook route and payload

**Decision**: Keep `POST /api/v1/payments/webhook`. Refactor handler to use `parsePawaPayDepositStatus()` first (mako pattern), then legacy `eventType` fallback. Register URL in PawaPay dashboard as `{API_PUBLIC_URL}/api/v1/payments/webhook`.

**Rationale**: Ngoma already exposes this path; changing would break any registered webhooks. Mako uses `/webhooks/deposit` but Ngoma 001 contract uses `/webhook`.

**Alternatives considered**:
- Add alias route `/webhooks/deposit` — optional future; document primary path only for MVP

## R4: Status completion paths

**Decision**: Dual path: (1) PawaPay webhook → `completePayment`, (2) client poll `GET /status/:depositId` → remote status check → complete. Both idempotent via `payment.status === COMPLETED` guard.

**Rationale**: Local dev without public webhook URL relies on polling; production uses webhooks.

## R5: Phone and provider validation

**Decision**: Require non-empty `phone` when PawaPay token configured. Normalize via existing `normalizeMobileMoneyPhone('260', phone)`. Providers: `MTN_MOMO_ZMB`, `AIRTEL_OAPI_ZMB`, `ZAMTEL_ZMB`.

**Rationale**: PawaPay v2 deposit payload requires payer phone; silent empty phone causes gateway errors.

## R6: Transaction metadata persistence

**Decision**: On deposit response and webhook, extract and save `transactionId` (financialTransactionId / provider ref if present), `errorCode`, `errorMessage` on FAILED.

**Rationale**: Payment entity columns exist but are unused; needed for support and purchase history.

## R7: Webhook signature verification

**Decision**: Optional — when `PAWAPAY_PUBLIC_KEY_ID` set, verify signature headers per PawaPay docs; when unset, accept webhooks with warning log in non-production.

**Rationale**: User provided empty key fields; sandbox often skips signatures. Implement hook point without blocking MVP.

**Alternatives considered**:
- Mandatory signature — rejected for sandbox MVP

## R8: Client UX on failure

**Decision**: `PaymentStatusPanel` accepts `onRetry` callback; checkout/tip reset `depositId` on retry. On COMPLETED track purchase, link to track download.

**Rationale**: Minimal diff; improves failed-payment recovery without new pages.

## R9: Config health endpoint

**Decision**: `GET /api/v1/payments/config` returns `{ pawapayEnabled, environment, webhookUrl, devAutoComplete }` — no secrets.

**Rationale**: Ops validation (VS-1103) without reading `.env` manually.

## R10: Database changes

**Decision**: No migration. Existing `payments.transaction_id`, `error_code`, `error_message` sufficient.

**Rationale**: Schema already supports metadata from 001 MVP.
