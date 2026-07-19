# Implementation Plan: Payment Forms UX

**Branch**: `013-payment-forms-ux` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/013-payment-forms-ux/spec.md`

## Summary

Replace raw PawaPay correspondent codes in checkout/tip UI with a **user-friendly mobile money form**: country selector with **flag emoji**, **consumer operator names** (MTN Mobile Money, etc.), and **dial-code-aware phone input**. Extend **`payment-countries.ts`** with rich catalog + **`operatorId` → pawapayCode** mapping on the API. Extract shared **`MobileMoneyForm`** for `CheckoutPage` and `TipArtistPage`. No DB migration — catalog stays in code; Payment entity still stores resolved PawaPay code.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client)

**Primary Dependencies**:
- API: NestJS 11+, existing `payments` module, `payment-countries.ts`, PawaPay client
- Client: React 18, Vite, shadcn/ui Select/Radio/Card, TanStack Query (`usePaymentOptions`)

**Storage**: None — static catalog in `api/src/modules/payments/payment-countries.ts`

**Testing**: Manual VS-1301–VS-1305 per `quickstart.md`

**Target Platform**: Web SPA (mobile-first checkout/tip)

**Project Type**: Yarn monorepo — extend `api/src/modules/payments/` + `client/src/components/payments/`

**Performance Goals**: Options endpoint static; no extra DB queries

**Constraints**:
- Extend payments module only
- PawaPay codes never in client bundle catalog
- Backward compat: accept legacy `provider` (PawaPay code) on deposit/tip DTOs
- MVP: Zambia enabled; multi-country structure ready

**Scale/Scope**: 1 catalog refactor, 1 shared form component, 2 page refactors, DTO + service mapping, optional history label helper

**Reference**: `PROJECT REQUIREMENTS.md` §checkout wireframes, §5.3.2; `specs/011-payments-pawapay-integration/`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature extends `api/src/modules/payments/` + `client/src/components/payments/`
- [x] No schema migration required
- [x] Endpoints extend `/api/v1/payments/`; DTO validation updated
- [x] Client uses TanStack Query; shadcn components
- [x] PawaPay gateway mapping stays server-side per constitution IV

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/013-payment-forms-ux/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── payment-options-api.md
│   └── mobile-money-form-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/src/modules/payments/
├── payment-countries.ts           # REFACTOR: rich catalog + resolveOperator()
├── payments.service.ts            # map operatorId before submitToGateway
├── dto/
│   ├── initiate-payment.dto.ts    # + operatorId (optional, preferred)
│   └── initiate-tip.dto.ts        # + operatorId

client/src/
├── components/payments/
│   ├── MobileMoneyForm.tsx        # NEW shared form
│   └── OperatorOption.tsx         # NEW operator card/radio row
├── hooks/usePayments.ts           # extended types
├── pages/CheckoutPage.tsx         # use MobileMoneyForm
└── pages/TipArtistPage.tsx        # use MobileMoneyForm
```

**Structure Decision**: Catalog remains in `payment-countries.ts` (same as today); enrich types and add resolver functions rather than new module.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/payment-options-api.md](./contracts/payment-options-api.md)
- [contracts/mobile-money-form-ui.md](./contracts/mobile-money-form-ui.md)
- [quickstart.md](./quickstart.md)
