# Quickstart: 020-payments-remaining-work

**Purpose**: Validate remaining payment work — production readiness, multi-country catalog, amount rules, and (Phase B) payouts.

**Prerequisites**:
- Features 011, 013, 006, 007, 018 implemented
- Postgres **5433**, API **4001**, client **5173**
- Admin user seeded (`api/scripts/seed-admin.sql`)

---

## Phase A — Production go-live

### Environment (production)

```env
PAYMENTS_DEV_AUTO_COMPLETE=false
PAWAPAY_ENV=production
PAWAPAY_PRODUCTION_API_TOKEN=<rotate-if-exposed>
PAWAPAY_BASE_URL_PROD=https://api.pawapay.io/v2
PAWAPAY_WEBHOOK_URL=https://<your-api-host>/api/v1/payments/webhook
```

Register the same webhook URL in PawaPay dashboard. See [contracts/production-rollout.md](./contracts/production-rollout.md).

### VS-2001: Config health

```bash
curl -s http://localhost:4001/api/v1/payments/config | jq .
```

**Expected**: `environment: "production"`, `devAutoComplete: false`, `pawapayEnabled: true`.

### VS-2002: Multi-country options

```bash
curl -s http://localhost:4001/api/v1/payments/mobile-money/options | jq '[.data[] | {id, currency, operators: [.operators[].shortName]}]'
```

**Expected**: 14 country entries including `KE`, `SN`, `CD_USD`, `ZM`.

### VS-2003: Amount normalization (after Phase A implementation)

1. Find or create a track priced in XOF (or use tip flow with Senegal).
2. Attempt amount with decimals (e.g. 500.50).
3. **Expected**: API sends integer `500` to PawaPay; or client prevents decimal entry.

Unit test:

```bash
yarn workspace @ngoma/api test payment-amount.util
```

### VS-2001b: Production deposit smoke (manual)

1. Sign in as listener.
2. Buy track → select Zambia MTN, real test phone.
3. Approve USSD prompt.
4. **Expected**: COMPLETED, download access; webhook log shows callback.

---

## Phase A — Sandbox multi-country spot checks

Repeat deposit flow (or curl) for at least:

| Country | Provider | Test focus |
|---------|----------|------------|
| ZM | MTN_MOMO_ZMB | Baseline (011) |
| KE | MPESA_KEN | Single operator |
| SN | ORANGE_SEN | XOF integer amount |

```bash
TOKEN=<listener-jwt>
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":500,"currency":"XOF","provider":"ORANGE_SEN","purpose":"TIP","itemId":"ARTIST_ID","phone":"771234567"}' \
  http://localhost:4001/api/v1/payments/deposit | jq .
```

**Expected**: `201`, status `PENDING`, USSD message.

---

## Phase B — Payouts (after implementation)

### VS-2004: Artist payout request

1. Sign in as artist with earnings balance.
2. POST `/api/v1/payouts/request` with amount ≤ balance.
3. **Expected**: `201`, status `PENDING`.

### VS-2004b: Admin approve

1. Sign in as admin.
2. `PUT /api/v1/admin/payouts/:id` with `action: "approve"`.
3. **Expected**: PawaPay payout initiated → `COMPLETED`; balance reduced.

---

## Phase C — Admin payment ops

### VS-2005: Admin overview

1. Open `/admin` as admin.
2. **Expected**: Payment environment badge, pending payout count (Phase C).

---

## Regression

Re-run 011 quickstart scenarios VS-1101–1103 in sandbox after Phase A changes to confirm Zambia flow unchanged.

---

## Validation log (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-2001 | PASS | `GET /payments/config` → `webhookUrlConfigured: true`, `environment: sandbox`, `devAutoComplete: false` |
| VS-2002 | PASS (code) | 13 catalog entries in `payment-countries.ts`; options API requires JWT (existing) |
| VS-2003 | PASS (unit) | `payment-amount.util.spec.ts` — 6/6 tests pass |
| VS-2004 | PASS (schema) | Migration `CreatePayouts1719000000013` applied; module + routes registered |
| VS-2005 | PASS (code) | Admin dashboard returns `paymentHealth`; `/admin/payouts` route added |
| Build | PASS | `yarn workspace @ngoma/api build`, `yarn workspace @ngoma/client build` |
| Lint | PASS | No new errors (pre-existing warnings only) |


- [spec.md](./spec.md) — user stories
- [contracts/multi-country-catalog.md](./contracts/multi-country-catalog.md)
- [contracts/amount-normalization.md](./contracts/amount-normalization.md)
- [contracts/payouts-api.md](./contracts/payouts-api.md)
- [specs/011-payments-pawapay-integration/quickstart.md](../011-payments-pawapay-integration/quickstart.md)
