# Research: Payments — Remaining Work

**Feature**: 020-payments-remaining-work  
**Date**: 2026-07-19

## Gap Analysis Summary

| Bucket | Spec status | Code status | Remaining |
|--------|-------------|-------------|-----------|
| Deposits (track/tip) | 011 ✅ | ✅ | Production deploy + webhook |
| Payment form UX | 013 ✅ | ✅ | Multi-country validation |
| Country catalog | 013 MVP Zambia | ✅ 14 countries in code | Spec, amount rules, smoke tests |
| Buy track flow | 018 ✅ | ✅ recent UX | Document in quickstart |
| Payouts | PRD only | ❌ none | Full module (P2) |
| Admin payment UI | PRD only | ❌ partial (`/payments/config`) | Admin page (P3) |
| Refunds / saved cards | Out of scope | ❌ | Future |

## Decision: Three-phase delivery

**Decision**: Split remaining work into **Phase A (go-live)**, **Phase B (payouts)**, **Phase C (admin ops)**.

**Rationale**: Deposits are code-complete; production config and multi-country validation unblock revenue. Payouts need schema + new module — larger scope. Admin UI depends on payouts.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Single mega-feature for everything | Payouts need migration; delays go-live |
| Dynamic PawaPay active-config API only | Static catalog already matches merchant dashboard; adds runtime dependency |
| Skip amount rounding | PawaPay rejects decimal XOF/XAF deposits |

## Decision: Static catalog + currency metadata

**Decision**: Keep `payment-countries.ts` as source of truth; add optional `decimalsInAmount: 'NONE' | 'TWO'` per country/currency entry.

**Rationale**: Matches PawaPay provider table; no runtime API call on every checkout; 013 NFR-1302 already prefers static catalog.

## Decision: Amount normalization in PaymentsService

**Decision**: Before gateway POST, normalize `payment.amount` via `normalizePaymentAmount(currency, amount)` — floor to integer for `NONE`, round 2dp for `TWO`.

**Rationale**: Centralizes rules; client can still show decimals for ZMW PWYW but API enforces gateway contract.

## Decision: Payouts module layout

**Decision**: New `api/src/modules/payouts/` with `Payout` entity, migration, artist `POST /payouts/request`, admin `PUT /admin/payouts/:id/process`, reuse `pawapay.client.ts` for payout POST.

**Rationale**: Constitution module-first; separate from deposit flow; matches PROJECT REQUIREMENTS routes.

## Production checklist (ops)

1. Set `PAWAPAY_ENV=production`, `PAWAPAY_PRODUCTION_API_TOKEN` in server env (rotate if leaked).
2. Set `PAWAPAY_WEBHOOK_URL=https://<api-host>/api/v1/payments/webhook` in env **and** PawaPay dashboard.
3. Enable `PAWAPAY_PUBLIC_KEY_ID` + signature verification in production.
4. Set `PAYMENTS_DEV_AUTO_COMPLETE=false`.
5. Smoke: deposit + approve USSD (or sandbox test MSISDN per country docs).

## References

- [PawaPay providers](https://docs.pawapay.io/v2/docs/providers)
- `specs/011-payments-pawapay-integration/` — complete
- `specs/013-payment-forms-ux/` — complete (Zambia MVP assumption superseded)
- `PROJECT REQUIREMENTS.md` §7, payouts routes §6
