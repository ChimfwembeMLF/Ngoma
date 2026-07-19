# Contract: Payouts API (Phase B)

**Feature**: 020-payments-remaining-work  
**Phase**: B (P2) — **NOT YET IMPLEMENTED**

## Entity

`Payout` — see [data-model.md](../data-model.md)

## Artist routes

All require `JwtAuthGuard` + artist role.

### List payouts

**GET** `/api/v1/payouts`

Query: `?status=PENDING&page=1&limit=20`

Response:

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "amount": "150.00",
        "currency": "ZMW",
        "status": "PENDING",
        "requestedAt": "2026-07-19T12:00:00Z"
      }
    ],
    "total": 1
  }
}
```

### Request payout

**POST** `/api/v1/payouts/request`

Body:

```json
{
  "amount": 150.00,
  "phone": "260977123456",
  "provider": "MTN_MOMO_ZMB"
}
```

Validation:
- `amount` ≤ available balance
- `amount` ≥ platform minimum (e.g. 50 ZMW — TBD in tasks)
- Artist must have completed KYC if over threshold (future)

Response: `201` with payout object, status `PENDING`.

### Get payout

**GET** `/api/v1/payouts/:id`

Artist may only read own payouts.

## Admin routes

Require admin role.

### List pending payouts

**GET** `/api/v1/admin/payouts?status=PENDING`

### Process payout

**PUT** `/api/v1/admin/payouts/:id`

Body:

```json
{
  "action": "approve" | "reject",
  "note": "optional"
}
```

- `approve` → call PawaPay payout API → status `PROCESSING` → `COMPLETED` on webhook/callback
- `reject` → status `REJECTED`

## PawaPay integration

Reuse `pawapay.client.ts`:

- `POST /payouts` (PawaPay v2 payout endpoint)
- Webhook or poll for payout status (align with deposit patterns)

## Balance calculation

```
available = SUM(earnings.amount WHERE artist_id = X)
          - SUM(payouts.amount WHERE status IN (PENDING, APPROVED, PROCESSING, COMPLETED))
```

## Client UI (Phase B)

- Artist: "Request payout" on dashboard with balance display
- Admin: payout queue with approve/reject actions

See [quickstart.md](../quickstart.md) VS-2004.
