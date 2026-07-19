# Quickstart: 013-payment-forms-ux

**Purpose**: Validate user-friendly payment forms with countries, flags, and operator labels on checkout and tip flows.

**Prerequisites**:
- Feature 011 PawaPay integration working
- Postgres **5433**, API **4001**, client **5173**
- Priced or PWYW track; artist profile for tips
- Listener JWT

---

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1301: Country with flag

1. Sign in → open `/checkout/:trackId`
2. **Expected**: Country shows **🇿🇲 Zambia · ZMW** (not raw `ZMB` or `[0]` hardcode)
3. Phone field shows **+260** prefix hint

### VS-1302: Friendly operator names

1. On checkout or tip form, view operator list
2. **Expected**: "MTN Mobile Money", "Airtel Money", "Zamtel Kwacha" — **not** `MTN_MOMO_ZMB`
3. Select MTN → complete payment flow (sandbox)
4. DevTools → deposit request body contains `"operatorId":"zm-mtn"` (not pawapay code)

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:4001/api/v1/payments/mobile-money/options | jq '.data.countries[0]'
```

**Expected**: `flag`, `name`, `operators[].displayName` — no `pawapayCode`

### VS-1303: Shared form on Tip

1. Open `/tip/:artistId`
2. **Expected**: Same country/operator/phone UI as checkout

### VS-1304: API mapping

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"operatorId":"zm-mtn","countryId":"ZM","phone":"0977123456","purpose":"TRACK_DOWNLOAD","itemId":"TRACK_ID"}' \
  http://localhost:4001/api/v1/payments/deposit | jq '.data.status'
```

**Expected**: `PENDING` or `COMPLETED` (dev mode); payment row `provider = MTN_MOMO_ZMB`

### VS-1305: History friendly label (P2)

1. Complete a payment → `/purchases`
2. **Expected**: Operator shown as "MTN Mobile Money" (not raw code)

---

## Regression

- PWYW min validation still works on checkout
- Self-tip 403 unchanged
- Free track checkout skip unchanged
- Legacy `provider` field in API still works for scripts

---

## Validation results (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-1304 API catalog shape | ✓ PASS | `listPaymentCountryOptions()` returns `{ countries, defaultCountryId }`; operators have `displayName` only |
| VS-1301 Country + flag | Manual | Checkout/tip show 🇿🇲 Zambia · ZMW badge |
| VS-1302 Friendly operators | Manual | MTN Mobile Money cards; client sends `operatorId` |
| VS-1303 Shared form | ✓ PASS | `MobileMoneyForm` used on CheckoutPage + TipArtistPage |
| VS-1305 History labels | ✓ PASS | `providerDisplayName` in history API + PurchaseHistoryPage |

Build/lint: API and client pass.

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Still see MTN_MOMO_ZMB in UI | Client not migrated to MobileMoneyForm |
| 400 Invalid operator | operatorId slug vs catalog in payment-countries.ts |
| Options 401 | JWT required on mobile-money/options |
| Wrong phone format | dialCode normalization in API |

---

## Contract references

- [payment-options-api.md](./contracts/payment-options-api.md)
- [mobile-money-form-ui.md](./contracts/mobile-money-form-ui.md)
- [data-model.md](./data-model.md)
