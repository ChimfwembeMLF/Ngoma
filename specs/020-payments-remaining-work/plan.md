# Implementation Plan: Payments — Remaining Work

**Branch**: `020-payments-remaining-work` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/020-payments-remaining-work/spec.md`

## Summary

Payment **deposits** (track purchase, tips, PWYW) are implemented under specs **011**, **013**, **006**, **007**, and **018**. Remaining work closes the gap to **production go-live** and **multi-country merchant support**, then delivers **artist payouts** and **admin payment ops** per `PROJECT REQUIREMENTS.md`.

**Phase A (P1 — go-live)**: Production env + webhook registration, currency amount normalization, validate 14-country catalog, quickstart smoke tests. **No DB migration.**

**Phase B (P2 — payouts)**: New `payouts` module, migration, PawaPay payout integration, artist request + admin approve flows.

**Phase C (P3 — admin ops)**: Admin dashboard section for payment health and payout queue.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, existing `payments` module, `pawapay.client.ts`, TypeORM
- Client: React 18, TanStack Query, `usePayments`, checkout/tip pages

**Storage**: PostgreSQL 15+ — Phase A: no migration; Phase B: `payouts` table

**Testing**: Manual quickstart (VS-2001–2005); optional unit tests for `normalizePaymentAmount()`

**Target Platform**: Web SPA + REST API + PawaPay mobile money (13 countries, 14 catalog entries)

**Project Type**: Yarn monorepo — extend `api/src/modules/payments/` (Phase A); add `api/src/modules/payouts/` (Phase B)

**Performance Goals**: Status poll 3s; webhook < 500ms; payout processing async acceptable

**Constraints**:
- Extend existing payments module — no duplicate gateway client
- Webhook: `POST /api/v1/payments/webhook`
- Production token in env only — never committed
- Constitution: payment patterns from `mako/api/src/modules/payments/`

**Scale/Scope**:
- Phase A: ~5 API files, ~2 client files, docs/contracts
- Phase B: new module (~8 files), migration, 2 client pages/hooks
- Phase C: admin page section (~3 files)

**Reference**: `PROJECT REQUIREMENTS.md` §7, payouts §6; specs 011/013 complete

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Phase A extends `api/src/modules/payments/` + `client/src/hooks/usePayments.ts`
- [x] Phase B adds `api/src/modules/payouts/` — standard module layout
- [x] No alternate backend/frontend roots
- [x] Phase A: no migration; Phase B: TypeORM migration required
- [x] Endpoints under `/api/v1/`, DTOs, JwtAuthGuard, Swagger
- [x] Client uses TanStack Query; existing checkout/tip UI patterns
- [x] Payment/webhook patterns align with mako payments module

**Post-design re-check**: PASS — Phase A is extension-only; Phase B follows module-first pattern.

## Project Structure

### Documentation (this feature)

```text
specs/020-payments-remaining-work/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── production-rollout.md
│   ├── multi-country-catalog.md
│   ├── amount-normalization.md
│   └── payouts-api.md
└── tasks.md             # /speckit-tasks (not created by plan)
```

### Source Code (Phase A)

```text
api/src/modules/payments/
├── payment-countries.ts      # add decimalsInAmount per country
├── payment-amount.util.ts    # NEW normalizePaymentAmount()
├── payments.service.ts       # call normalizer before deposit
└── pawapay.client.ts         # unchanged unless prod URL fix

client/src/
├── hooks/usePayments.ts
├── pages/CheckoutPage.tsx
└── pages/TipArtistPage.tsx
```

### Source Code (Phase B)

```text
api/src/modules/payouts/
├── payouts.module.ts
├── payouts.controller.ts
├── payouts.service.ts
├── entities/payout.entity.ts
└── dto/

api/database/migrations/*-CreatePayouts.ts

client/src/
├── hooks/usePayouts.ts
├── pages/ArtistPayoutsPage.tsx   # or section on ArtistDashboard
└── pages/AdminPayoutsPage.tsx
```

**Structure Decision**: Go-live work stays in payments module. Payouts is a separate bounded context with its own module per PRD routes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New `payouts` module (Phase B) | PRD defines distinct lifecycle from deposits | Embedding in payments conflates deposit vs disbursement |

## Phase 0: Research ✅

See [research.md](./research.md) — gap analysis, three-phase delivery, amount normalization, payouts layout.

## Phase 1: Design ✅

- [data-model.md](./data-model.md) — catalog extension + future Payout entity
- [contracts/](./contracts/) — rollout, catalog, amounts, payouts API
- [quickstart.md](./quickstart.md) — VS-2001–2005 validation scenarios

## Implementation Phases (for tasks.md)

### Phase A — Production go-live (P1)

1. Add `decimalsInAmount` to catalog entries (XOF/XAF/RWF/UGX → `NONE`)
2. Implement `normalizePaymentAmount()` + unit tests
3. Wire normalizer in `PaymentsService.createDeposit()`
4. Document production env in quickstart + `production-rollout.md`
5. Validate `GET /mobile-money/options` returns 14 countries
6. Client: show integer-only input hint for no-decimal currencies (optional UX)

### Phase B — Payouts (P2)

1. Migration + `Payout` entity
2. Artist balance query from earnings
3. `POST /api/v1/payouts/request`, `GET /api/v1/payouts`
4. Admin `GET/PUT /api/v1/admin/payouts/:id`
5. PawaPay payout POST in `pawapay.client.ts`
6. Client artist + admin UI

### Phase C — Admin payment ops (P3)

1. Extend admin overview with payment config health
2. Pending payout count badge
3. Link to payout approval queue

## Out of Scope (this feature)

Refunds, saved payment methods, Paystack, album bulk checkout, automated E2E against live PawaPay.
