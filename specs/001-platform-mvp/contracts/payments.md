# API Contract: Payments

**Base path**: `/api/v1/payments`  
**Module**: `api/src/modules/payments/`  
**Reference**: `mako/api/src/modules/payments/payments.controller.ts`

## GET /mobile-money/options

**Auth**: Bearer

Returns available mobile money providers for Zambia region.

---

## POST /deposit

Initiate track purchase payment.

**Auth**: Bearer

### Request

```json
{
  "amount": 10,
  "currency": "ZMW",
  "provider": "MTN_MOMO_UGA",
  "purpose": "TRACK_DOWNLOAD",
  "itemId": "track-uuid"
}
```

### Response 200

```json
{
  "success": true,
  "data": {
    "depositId": "DEP-...",
    "paymentId": "uuid",
    "status": "INITIATED",
    "message": "Check your phone for USSD prompt"
  }
}
```

---

## GET /status/:depositId

**Auth**: Bearer

Poll payment status.

---

## GET /history

**Auth**: Bearer

**Query**: `limit`, `offset`

User payment history.

---

## POST /webhook

**Auth**: None (PawaPay callback, excluded from Swagger)

Handles `deposit.success`, `deposit.failed`, `deposit.pending`.

Side effects on success (TRACK_DOWNLOAD):
- Update Payment → COMPLETED
- Create DownloadAccess (7-day expiry)
- Create Earnings row for artist

---

## Errors

| Code | HTTP | Description |
|------|------|-------------|
| PAY_001 | 400 | Payment initiation failed |
| PAY_003 | 503 | PawaPay unavailable |
| AUTH_001 | 401 | Missing or invalid token |
