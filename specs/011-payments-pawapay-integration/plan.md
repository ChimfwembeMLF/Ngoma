# Implementation Plan: Full PawaPay Payments Integration

**Branch**: `011-payments-pawapay-integration` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-payments-pawapay-integration/spec.md`

## Summary

Harden the existing **`payments`** module to use **real PawaPay v2 sandbox/production** with the user's env contract (`PAWAPAY_ENV`, `PAWAPAY_API_TOKEN`, base URLs, `PAYMENTS_DEV_AUTO_COMPLETE=false`). Align **webhook parsing** with mako patterns, persist **transaction/error metadata**, add **config health endpoint**, and polish **checkout/tip client UX** (retry, completion navigation). No new database tables — extend `Payment` field usage and env resolution in `pawapay.client.ts`.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client)

**Primary Dependencies**:
- API: NestJS 11+, existing `PaymentsService`, `pawapay.client.ts`, axios
- Client: React 18, TanStack Query, shadcn/ui checkout/tip pages

**Storage**: PostgreSQL 15+ — **no migration required** (Payment entity already has `transactionId`, `errorCode`, `errorMessage`)

**Testing**: Manual VS-1101–VS-1106 per `quickstart.md`; optional curl webhook simulation

**Target Platform**: Web SPA + REST API + PawaPay mobile money (Zambia)

**Project Type**: Yarn monorepo — extend `api/src/modules/payments/` + client hooks/pages

**Performance Goals**: Status poll 3s interval; webhook processing < 500ms

**Constraints**:
- Extend existing payments module — no duplicate gateway client
- Webhook route stays `POST /api/v1/payments/webhook` (document PawaPay dashboard URL)
- Backward compatible env: legacy `PAWAPAY_SANDBOX_API_TOKEN`, `PAWAPAY_ENVIRONMENT`
- Constitution: payment patterns from `mako/api/src/modules/payments/`

**Scale/Scope**: ~8 API file touches, 3 client file touches, env docs — no new modules

**Reference**: `PROJECT REQUIREMENTS.md` §7; `mako/api/src/modules/payments/`; `specs/001-platform-mvp/contracts/payments.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature extends `api/src/modules/payments/` + `client/src/hooks/usePayments.ts`
- [x] No schema migration required (uses existing Payment columns)
- [x] Endpoints use `/api/v1/`, DTOs, JwtAuthGuard, Swagger tags
- [x] Client uses TanStack Query; shadcn checkout/tip UI
- [x] Payment/webhook patterns align with mako payments module

**Post-design re-check**: PASS — extends existing module; constitution satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/011-payments-pawapay-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── pawapay-env.md
│   ├── payments-api.md
│   └── payments-ui.md
└── tasks.md             # /speckit-tasks output
```

### Source Code (repository root)

```text
api/
├── .env.example                    # + payment env block
├── src/modules/payments/
│   ├── pawapay.client.ts           # env resolution, v2 parsing
│   ├── pawapay-webhook.util.ts     # NEW optional signature verify
│   ├── payments.service.ts         # auto-complete flag, webhook, metadata
│   ├── payments.controller.ts      # + GET config
│   └── payment-countries.ts        # unchanged Zambia providers

client/
├── src/hooks/usePayments.ts        # + usePaymentConfig
├── src/pages/CheckoutPage.tsx      # retry, completion nav
├── src/pages/TipArtistPage.tsx     # retry, completion
└── src/components/payments/PaymentStatusPanel.tsx  # failed retry callback
```

**Structure Decision**: Single payments module extension; env config centralized in `pawapay.client.ts` + `api/src/common/payments.config.ts`.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/pawapay-env.md](./contracts/pawapay-env.md)
- [contracts/payments-api.md](./contracts/payments-api.md)
- [contracts/payments-ui.md](./contracts/payments-ui.md)
- [quickstart.md](./quickstart.md)
