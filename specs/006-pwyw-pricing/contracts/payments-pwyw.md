# Contract: PWYW Payment Deposit

**Module**: `api/src/modules/payments/`  
**Endpoint**: `POST /api/v1/payments/deposit`

---

## Existing behavior (unchanged)

- SET_PRICE: `amount` must match track fixed price (or current behavior: client sends track.price)
- FREE: deposit rejected — track is free

---

## PWYW extension

**When** `track.pricingType === 'PAY_WHAT_YOU_WANT'`:

| Rule | Detail |
|------|--------|
| Allowed | Initiate deposit with listener-chosen `amount` |
| Minimum | `amount >= track.minPrice` |
| Currency | ZMW (default) |
| Purpose | `TRACK_DOWNLOAD` |
| itemId | track UUID |

**Request example**:

```json
{
  "amount": 10.0,
  "currency": "ZMW",
  "provider": "MTN_MOMO_ZMB",
  "purpose": "TRACK_DOWNLOAD",
  "itemId": "track-uuid",
  "phone": "0977123456"
}
```

**Success**: Same response as SET_PRICE deposit (depositId, status, message).

**Errors**:

| HTTP | Message (example) |
|------|-------------------|
| 400 | `Amount must be at least ZMW 5.00` |
| 400 | `You already have download access` |
| 404 | `Track not found` |

---

## Completion & earnings

On `completePayment()`:

- `payment.amount` = listener-chosen amount
- Platform fee and artist earnings computed from that amount (same 30% rate as SET_PRICE)
- Download access granted for 7 days

No changes to webhook or status polling endpoints.
