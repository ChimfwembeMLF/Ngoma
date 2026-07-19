# Contract: Payments API (PawaPay Integration)

**Module**: `api/src/modules/payments/`  
**Base path**: `/api/v1/payments`

Extends [001 payments contract](../../001-platform-mvp/contracts/payments.md).

---

## GET /api/v1/payments/config

**Auth**: None (public ops probe; no secrets)

**Response**:

```json
{
  "success": true,
  "data": {
    "pawapayEnabled": true,
    "environment": "sandbox",
    "webhookUrl": "http://localhost:4001/api/v1/payments/webhook",
    "devAutoComplete": false,
    "baseUrl": "https://api.sandbox.pawapay.io/v2"
  }
}
```

---

## POST /api/v1/payments/deposit

**Changes**:
- Requires `phone` when PawaPay enabled (400 if missing)
- Returns `PENDING` after successful PawaPay POST (not dev auto-complete when token set)
- Response may include `transactionId` when returned by gateway

**Errors**:

| HTTP | Condition |
|------|-----------|
| 400 | Missing phone, invalid provider, PawaPay gateway error |
| 400 | Track free / already has access |
| 503 | Production without token configured |

---

## POST /api/v1/payments/tip

Same PawaPay flow as deposit with `purpose: TIP`.

---

## GET /api/v1/payments/status/:depositId

**Behavior**:
- Polls PawaPay `GET /deposits/:depositId` when local status not terminal
- On COMPLETED → runs `completePayment` idempotently
- Returns updated `status`, `completedAt`, optional `errorMessage`

---

## POST /api/v1/payments/webhook

**Auth**: Optional PawaPay signature (when keys configured)

**Payload** (PawaPay v2 callback — primary):

```json
{
  "depositId": "uuid",
  "status": "COMPLETED"
}
```

Or wrapped:

```json
{
  "status": "FOUND",
  "data": {
    "depositId": "uuid",
    "status": "COMPLETED",
    "financialTransactionId": "..."
  }
}
```

**Legacy fallback**: `{ "eventType": "deposit.success", "depositId": "..." }`

**Side effects on COMPLETED**:
- TRACK_DOWNLOAD → DownloadAccess + Earnings (70% artist)
- TIP → Earnings (95% artist)

**Response**: `{ "received": true }`

---

## PawaPay client mapping

| Ngoma | PawaPay v2 |
|-------|------------|
| depositId | depositId |
| provider | payer.accountDetails.provider |
| phone | payer.accountDetails.phoneNumber |
| amount | amount (string decimal) |
| currency | currency (ZMW) |

---

## Swagger

**Tag**: `Payments`
