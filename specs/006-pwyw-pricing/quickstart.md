# Quickstart: 006-pwyw-pricing

**Purpose**: Validate Pay What You Want pricing end-to-end.

**Prerequisites**:
- Features `001`–`005` implemented and running
- Postgres **5433**, API **4001**, client **5173**
- Demo seed: `api/scripts/seed-demo-data.sql`

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

Apply migration after implement:

```bash
yarn workspace @ngoma/api migrations:run
```

---

## Validation Scenarios

### VS-601: Artist creates PWYW track

1. Sign in as **ARTIST** (e.g. Demo Artist).
2. Open `/artist/dashboard`.
3. Select **Pay what you want**, set minimum **ZMW 5**, upload audio, publish.
4. **Expected**: Track appears in list; API returns `pricingType: PAY_WHAT_YOU_WANT`, `minPrice: 5`, `price: null`.

**curl** (replace token):

```bash
curl -s -X POST -H "Authorization: Bearer $ARTIST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"PWYW Test","genre":"Afrobeats","pricingType":"PAY_WHAT_YOU_WANT","minPrice":5}' \
  http://localhost:4001/api/v1/tracks | jq .
```

### VS-602: Listener pays chosen amount

1. Sign in as **LISTENER**.
2. Open PWYW track → **Pay what you want · from ZMW 5**.
3. At checkout enter **ZMW 10**, complete mobile money (dev auto-complete).
4. **Expected**: Payment succeeds; download works; purchase history shows ZMW 10.

```bash
curl -s -X POST -H "Authorization: Bearer $LISTENER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"currency":"ZMW","provider":"MTN_MOMO_ZMB","purpose":"TRACK_DOWNLOAD","itemId":"TRACK_ID","phone":"0977123456"}' \
  http://localhost:4001/api/v1/payments/deposit | jq .
```

### VS-603: Below-minimum rejected

1. Attempt deposit with `amount: 3` on min ZMW 5 track.
2. **Expected**: HTTP 400 with minimum amount message.

### VS-604: Analytics reflects PWYW

1. After VS-602, sign in as artist → `/artist/dashboard`.
2. **Expected**: Net earnings and per-track row include artist share of ZMW 10 payment.

---

## UI checks

| Page | PWYW expectation |
|------|------------------|
| `/discover` | Card shows `PWYW from ZMW X` |
| `/tracks/:id` | CTA shows pay-what-you-want with minimum |
| `/checkout/:id` | Editable amount field, prefilled with minimum |

---

## Regression checks

- SET_PRICE track checkout still uses fixed price (no amount input).
- FREE track still allows free download without checkout.
- Artist analytics (005) unchanged API — earnings update after PWYW sale.

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| 400 on create | `minPrice` missing for PWYW type |
| Checkout shows fixed price | Track `pricingType` not PWYW in API response |
| Payment says "Track is free" | `initiateDeposit` still rejecting non-SET_PRICE — implement PWYW branch |
| Migration fails | Drop/recreate CHECK constraint name matches DB |

---

## Contract references

- [tracks-pricing.md](./contracts/tracks-pricing.md)
- [payments-pwyw.md](./contracts/payments-pwyw.md)
- [checkout-ui.md](./contracts/checkout-ui.md)
- [data-model.md](./data-model.md)

## Implementation validation (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-601 Artist PWYW config | PASS (build) | Migration 006, entity/DTOs, upload form pricing selector |
| VS-602 Listener checkout | PASS (build) | `initiateDeposit` validates min; checkout amount input |
| VS-603 Below-minimum | PASS (code) | API returns 400 `Amount must be at least ZMW X.XX` |
| VS-604 Analytics | PASS (code) | PWYW uses existing `completePayment()` — no analytics changes |
| SC-605 Regression | PASS (build) | SET_PRICE fixed checkout; FREE download unchanged |
| Migration 006 | PASS | `min_price` column + CHECK constraint applied |
| Lint / build | PASS | API and client lint + build succeed |
