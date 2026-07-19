# Feature Specification: Payments — Remaining Work

**Feature Branch**: `020-payments-remaining-work`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "What's remaining for payments"

**Depends on**: `011-payments-pawapay-integration`, `013-payment-forms-ux`, `006-pwyw-pricing`, `007-artist-tipping`, `018-break-down-long-forms`

## Current State (Completed)

The following payment capabilities are **implemented and specced as complete**:

| Area | Spec | Status |
|------|------|--------|
| PawaPay deposits (track + tip) | 011 | ✅ Tasks complete |
| Webhook + status polling | 011 | ✅ |
| Env config (`PAWAPAY_ENV`, tokens, dev auto-complete) | 011 | ✅ |
| Mobile money UX (flags, operators, shared form) | 013 | ✅ |
| PWYW + SET_PRICE validation | 006 | ✅ |
| Artist tipping + earnings | 007 | ✅ |
| Buy track wizard + payment status UX | 018 + recent polish | ✅ (uncommitted) |
| Purchase history friendly operator labels | 013 US5 | ✅ |

**In code but not yet specced/validated**: 13-country PawaPay catalog in `payment-countries.ts` (Benin → Zambia) added for production merchant account.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Production Mobile Money Go-Live (Priority: P1)

Platform operator deploys Ngoma with **production PawaPay** credentials, registers the webhook URL, and listeners in supported countries can buy tracks and tip artists with real mobile money.

**Why this priority**: Deposits work in dev/sandbox but production token + webhook + HTTPS are required for real money.

**Independent Test**: VS-2001 — Production deposit in Zambia completes via webhook → download access granted.

**Acceptance Scenarios**:

1. **Given** `PAWAPAY_ENV=production` and valid prod token, **When** deposit initiated, **Then** requests hit `api.pawapay.io/v2`.
2. **Given** PawaPay dashboard webhook URL configured, **When** COMPLETED callback received, **Then** payment completes without relying on poll alone.
3. **Given** invalid/expired token, **When** deposit attempted, **Then** user sees friendly error — not raw gateway stack trace.

---

### User Story 2 — Multi-Country Payment Catalog (Priority: P1)

Listeners in all **merchant-enabled countries** (Benin, Cameroon, Côte d'Ivoire, DRC CDF/USD, Gabon, Kenya, Congo, Rwanda, Senegal, Sierra Leone, Uganda, Zambia) see correct country, currency, operators, and dial prefix in checkout, tips, and registration.

**Why this priority**: Catalog expanded in code; 013 assumed Zambia-only MVP. Production merchant supports 13 markets.

**Independent Test**: VS-2002 — `GET /mobile-money/options` returns 14 country entries; checkout in Kenya shows M-Pesa.

**Acceptance Scenarios**:

1. **Given** Kenya selected, **When** user pays, **Then** API sends `MPESA_KEN` correspondent and KES currency.
2. **Given** XOF country (e.g. Senegal), **When** amount entered, **Then** whole-number amounts enforced (PawaPay no-decimal rule).
3. **Given** DR Congo USD selected, **When** paying, **Then** USD currency sent separately from CDF wallet.

---

### User Story 3 — Currency Amount Rules (Priority: P1)

Payment amounts respect PawaPay per-currency decimal rules so deposits are not rejected for fractional XOF/XAF/RWF amounts.

**Why this priority**: Many new markets do not support decimal deposit amounts.

**Independent Test**: VS-2003 — Checkout with XOF track price 500.50 rounds or validates to integer before POST.

**Acceptance Scenarios**:

1. **Given** currency with no decimal support, **When** deposit built, **Then** amount is integer string.
2. **Given** ZMW/KES/USD with decimal support, **When** PWYW amount 10.50, **Then** decimals preserved.

---

### User Story 4 — Artist Payouts (Priority: P2)

Artists request withdrawal of earned balance to their mobile money; admins approve and platform sends PawaPay **payout**.

**Why this priority**: PROJECT REQUIREMENTS §7 + `/payouts` API — **not built**; artists cannot receive accumulated earnings off-platform.

**Independent Test**: VS-2004 — Artist requests payout → admin approves → PawaPay payout COMPLETED → balance reduced.

**Acceptance Scenarios**:

1. **Given** artist with earnings above minimum, **When** payout requested, **Then** payout row created PENDING.
2. **Given** admin approval, **When** PawaPay payout succeeds, **Then** payout COMPLETED and ledger updated.
3. **Given** insufficient balance, **When** request submitted, **Then** 400 with clear message.

---

### User Story 5 — Admin Payment Operations (Priority: P3)

Admin views payment config health, pending payouts, and (future) country/operator enablement without editing code.

**Why this priority**: PRD §5.3.2 admin payment settings — only public config endpoint exists today.

**Independent Test**: VS-2005 — Admin page shows PawaPay environment, webhook URL, countries enabled count.

---

## Out of Scope (This Feature)

- Refunds / chargebacks
- Saved payment methods / wallet balance
- Paystack or alternate gateways
- Album bulk checkout, subscriptions
- Automated E2E against live PawaPay (manual quickstart only)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-2001**: Document and validate production env (`PAWAPAY_ENV=production`, `PAWAPAY_PRODUCTION_API_TOKEN`, public webhook URL).
- **FR-2002**: Formalize 13-country catalog in spec/contracts; validate correspondent codes against [PawaPay providers docs](https://docs.pawapay.io/v2/docs/providers).
- **FR-2003**: Enforce per-currency amount rules before `postPawaPayDeposit()`.
- **FR-2004**: Production smoke tests documented in quickstart (Zambia minimum; optional per-country).
- **FR-2005** (P2): Payouts module with TypeORM migration, artist request + admin approve + PawaPay payout API.
- **FR-2006** (P3): Admin payment ops dashboard section.

### Success Criteria

- **SC-2001**: At least one successful production deposit + webhook completion in staging/prod.
- **SC-2002**: All 14 catalog countries appear in mobile-money options API.
- **SC-2003**: No decimal amounts sent for XOF/XAF/RWF/UGX deposit currencies marked no-decimal.
- **SC-2004** (P2): Payout request → approve → complete path works in sandbox.

## Assumptions

- Merchant PawaPay account already enabled for listed countries.
- Production token stored in server env only; rotate if exposed in chat/logs.
- Payouts require new DB tables (per PROJECT REQUIREMENTS schema).
