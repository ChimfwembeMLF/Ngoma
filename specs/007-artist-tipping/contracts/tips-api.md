# Contract: Tips API

**Module**: `api/src/modules/payments/`  
**Base paths**: `/api/v1/payments`, `/api/v1/tips`

---

## POST /api/v1/payments/tip

**Auth**: JWT (any authenticated user; typically LISTENER)

**Body**:

```json
{
  "artistId": "uuid",
  "amount": 10.0,
  "currency": "ZMW",
  "provider": "MTN_MOMO_ZMB",
  "phone": "0977123456",
  "message": "Keep going!",
  "trackId": "uuid-optional"
}
```

| Field | Rules |
|-------|-------|
| artistId | required, must exist, published artist |
| amount | ≥ 1.00 ZMW |
| provider | required mobile money code |
| phone | required for deposit |
| message | optional, max 500 chars |
| trackId | optional; if set, track must belong to artist |

**Success** (same shape as deposit):

```json
{
  "success": true,
  "data": {
    "depositId": "uuid",
    "paymentId": "uuid",
    "status": "COMPLETED|PENDING",
    "message": "..."
  }
}
```

**Errors**:

| HTTP | Condition |
|------|-----------|
| 400 | amount < 1, invalid artist, self-tip |
| 403 | User is the target artist |
| 404 | Artist not found |

---

## GET /api/v1/payments/status/:depositId

Unchanged — poll tip payment same as track purchase.

---

## GET /api/v1/tips/received

**Auth**: JWT + ARTIST role

**Query**: `limit` (default 20, max 50), `offset` (default 0)

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 10.0,
      "message": "Great track!",
      "trackId": null,
      "trackTitle": null,
      "tipperName": "Fan User",
      "createdAt": "2026-07-19T12:00:00Z"
    }
  ],
  "pagination": { "total": 1, "limit": 20, "offset": 0 }
}
```

---

## Payment completion side effects

On `COMPLETED` tip payment:

1. Insert `tips` row
2. Insert `earnings` row (`source: TIP`, 95% artist share)
3. No `download_access` row

---

## Regression

- `POST /api/v1/payments/deposit` for `TRACK_DOWNLOAD` unchanged
- PWYW and SET_PRICE validation unchanged
