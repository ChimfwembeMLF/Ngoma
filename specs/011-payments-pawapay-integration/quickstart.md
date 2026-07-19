# Quickstart: 011-payments-pawapay-integration

**Purpose**: Validate full PawaPay sandbox integration for track purchase and tips.

**Prerequisites**:
- Features `001`, `006`, `007` implemented
- Postgres **5433**, API **4001**, client **5173**
- PawaPay sandbox token configured in `api/.env`
- Published SET_PRICE or PWYW track in catalog

---

## Environment setup

Copy payment block to `api/.env`:

```env
PAYMENTS_DEV_AUTO_COMPLETE=false
PAWAPAY_ENV=sandbox
PAWAPAY_API_TOKEN=<your sandbox token>
PAWAPAY_BASE_URL_SANDBOX=https://api.sandbox.pawapay.io/v2
PAWAPAY_BASE_URL_PROD=https://api.pawapay.io/v2
PAWAPAY_WEBHOOK_URL=http://localhost:4001/api/v1/payments/webhook
PAWAPAY_PRIVATE_KEY=
PAWAPAY_PUBLIC_KEY_ID=
```

Restart API after env changes.

---

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1101: Live track purchase

1. Sign in as listener.
2. Open priced track → Checkout.
3. Select MTN/Airtel/Zamtel, enter phone `0977123456`, pay.
4. **Expected**: Status PENDING, USSD message; after approval → COMPLETED, download enabled.

```bash
curl -s http://localhost:4001/api/v1/payments/config | jq .
```

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"currency":"ZMW","provider":"MTN_MOMO_ZMB","purpose":"TRACK_DOWNLOAD","itemId":"TRACK_ID","phone":"0977123456"}' \
  http://localhost:4001/api/v1/payments/deposit | jq .
```

### VS-1102: Webhook completion

Simulate PawaPay callback (replace DEPOSIT_ID):

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"depositId":"DEPOSIT_ID","status":"COMPLETED"}' \
  http://localhost:4001/api/v1/payments/webhook | jq .
```

**Expected**: Payment COMPLETED; duplicate POST does not duplicate earnings.

### VS-1103: Environment resolution

```bash
curl -s http://localhost:4001/api/v1/payments/config | jq '.data | {pawapayEnabled, environment, devAutoComplete}'
```

**Expected**: `pawapayEnabled: true`, `environment: sandbox`, `devAutoComplete: false`.

### VS-1104: Tip via PawaPay

1. Open `/tip/:artistId` from track page.
2. Send ZMW 10 tip with phone + provider.
3. **Expected**: Same pending → completed flow; tip in artist tips list.

### VS-1105: Client retry on failure

1. Initiate payment, cancel USSD or use invalid sandbox phone.
2. **Expected**: FAILED status shown; retry button returns to form.

### VS-1106: Signature verification (optional)

Only when `PAWAPAY_PUBLIC_KEY_ID` configured — invalid signature returns 401.

---

## Webhook tunnel (optional)

```bash
ngrok http 4001
export PAWAPAY_WEBHOOK_URL=https://YOUR.ngrok-free.app/api/v1/payments/webhook
```

Register URL in PawaPay merchant dashboard.

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Auto-completes without USSD | `PAYMENTS_DEV_AUTO_COMPLETE` must be `false`; token must be set |
| 400 Payment gateway not configured | Token missing in `.env`; restart API |
| 400 Phone required | Pass `phone` in deposit body |
| Stuck PENDING | Poll `/status/:depositId`; or send webhook manually |
| Provider rejected | Use `MTN_MOMO_ZMB`, `AIRTEL_OAPI_ZMB`, or `ZAMTEL_ZMB` |

---

## Validation results (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-1103 Config endpoint | ✓ PASS | `GET /api/v1/payments/config` → `pawapayEnabled: true`, `environment: sandbox`, `devAutoComplete: false` |
| VS-1102 Webhook (unknown deposit) | ✓ PASS | Returns `{"received":true}` without error |
| VS-1106 Signature (no keys) | ✓ PASS | Invalid signature header accepted when `PAWAPAY_PUBLIC_KEY_ID` unset |
| VS-1101 Live deposit | Manual | Requires listener JWT + priced track; sandbox USSD flow |
| VS-1104 Tip flow | Manual | Requires listener JWT + artist; same gateway path as deposit |
| VS-1105 Client retry | Manual | FAILED state shows retry in Checkout/Tip pages |
| SC-1103 Regression | ✓ PASS | Code verified: free track 400, PWYW min validation, self-tip 403 |

Build/lint: `yarn workspace @ngoma/api lint && build` and `yarn workspace @ngoma/client lint && build` — both pass.

---

## Contract references

- [pawapay-env.md](./contracts/pawapay-env.md)
- [payments-api.md](./contracts/payments-api.md)
- [payments-ui.md](./contracts/payments-ui.md)
- [data-model.md](./data-model.md)
