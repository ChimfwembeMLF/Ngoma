# Data Model: Full PawaPay Payments Integration

**Feature**: 011-payments-pawapay-integration | **Date**: 2026-07-19

## Entity: Payment (existing — extended usage)

No schema migration. Ensure fields populated on PawaPay integration:

| Field | Type | Rules |
|-------|------|-------|
| transactionId | varchar | Set from PawaPay financialTransactionId / provider ref on COMPLETED |
| errorCode | varchar | Set on FAILED from PawaPay error payload |
| errorMessage | text | Set on FAILED — user-visible gateway message |
| status | enum | INITIATED → PENDING → COMPLETED \| FAILED |
| depositId | varchar unique | UUID sent to PawaPay as depositId |
| provider | varchar | PawaPay correspondent code (e.g. MTN_MOMO_ZMB) |

## Related entities (unchanged)

| Entity | Relationship | On COMPLETED |
|--------|--------------|--------------|
| DownloadAccess | paymentId, userId, trackId | Created/extended 7-day expiry (TRACK_DOWNLOAD) |
| Earnings | paymentId | Created once — DOWNLOAD (70% artist) or TIP (95% artist) |
| Tip | paymentId | Created at initiate; earnings on complete |

## State transitions

```text
INITIATED → (PawaPay POST ok) → PENDING
PENDING → (webhook/poll COMPLETED) → COMPLETED + side effects
PENDING → (webhook/poll FAILED) → FAILED + error fields
(dev only) INITIATED → COMPLETED when PAYMENTS_DEV_AUTO_COMPLETE=true and no token
```

## Idempotency rules

- `completePayment`: no-op if already COMPLETED
- `completeTrackDownload`: skip duplicate earnings by paymentId
- `completeTip`: skip duplicate earnings by paymentId

## Validation rules

- Phone required when PawaPay enabled
- Provider must be in Zambia provider list
- SET_PRICE: amount must equal track.price
- PWYW: amount >= track.minPrice
- TIP: amount >= 1 ZMW; artistId !== userId
