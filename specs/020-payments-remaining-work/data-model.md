# Data Model: Payments — Remaining Work

**Feature**: 020-payments-remaining-work

## Existing entities (unchanged for Phase A)

### Payment (`payments`)

Used by deposits — no schema change for go-live.

| Field | Notes |
|-------|-------|
| depositId | PawaPay deposit UUID |
| amount | Normalized per currency rules (Phase A logic) |
| currency | From country catalog |
| provider | PawaPay correspondent code |
| status | INITIATED → PENDING → COMPLETED/FAILED |
| purpose | TRACK_DOWNLOAD, TIP |

### Earnings, Tip, DownloadAccess

Unchanged — created on payment COMPLETED.

---

## Catalog extension (code-only, Phase A)

### PaymentCountryDefinition (extended)

| Field | Type | Notes |
|-------|------|-------|
| decimalsInAmount | `'NONE' \| 'TWO'` | NEW — drives amount normalization |
| enabled | boolean | All 14 production countries true |

No database table — remains in `payment-countries.ts`.

---

## New entity (Phase B — Payouts)

### Payout (`payouts`) — **NOT YET MIGRATED**

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| artist_id | uuid | FK artists |
| amount | decimal(10,2) | Requested amount |
| currency | varchar(3) | From artist country/wallet |
| status | enum | PENDING, APPROVED, PROCESSING, COMPLETED, FAILED, REJECTED |
| payment_method | varchar | PawaPay correspondent |
| phone | varchar | Normalized MSISDN |
| pawapay_payout_id | varchar | Gateway reference |
| error_message | text | nullable |
| requested_at | timestamptz | |
| processed_at | timestamptz | nullable |
| processed_by | uuid | Admin user FK, nullable |

### Artist balance (computed or materialized — TBD in tasks)

Option A: `SUM(earnings.amount) - SUM(completed_payouts.amount)`  
Option B: `artists.available_balance` column updated on earnings/payout events

**Recommendation**: Computed query for MVP payouts; materialized balance if performance issues.

---

## State transitions

### Deposit (existing)

```
INITIATED → PENDING → COMPLETED | FAILED
```

### Payout (new, Phase B)

```
PENDING → APPROVED → PROCESSING → COMPLETED | FAILED
PENDING → REJECTED
```

---

## Phase A vs Phase B migrations

| Phase | Migration needed? |
|-------|-----------------|
| A — go-live + amount rules | No |
| B — payouts | Yes — `payouts` table |
