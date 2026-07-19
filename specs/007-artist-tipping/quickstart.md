# Quickstart: 007-artist-tipping

**Purpose**: Validate artist tipping end-to-end.

**Prerequisites**:
- Features `001`–`006` implemented and running
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

### VS-701: Send tip with preset amount

1. Sign in as **LISTENER** (`listener@ngoma.test`).
2. Open a published track → click **Tip artist**.
3. Select **ZMW 10**, enter phone, pay (dev auto-complete).
4. **Expected**: Payment COMPLETED; tip row in DB; artist earnings +ZMW 9.50 (95% of 10).

```bash
curl -s -X POST -H "Authorization: Bearer $LISTENER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"artistId":"ARTIST_ID","amount":10,"provider":"MTN_MOMO_ZMB","phone":"0977123456"}' \
  http://localhost:4001/api/v1/payments/tip | jq .
```

### VS-702: Custom amount and message

1. Tip with custom **ZMW 15** and message `"Great music"`.
2. **Expected**: Tip stored with message; earnings reflect 95% of 15.

### VS-703: Analytics includes tips

1. After VS-701, sign in as **ARTIST** → `/artist/dashboard`.
2. **Expected**: Net earnings increased; unique supporters includes tipper.

### VS-704: Artist tip list

1. As artist, call `GET /api/v1/tips/received`.
2. **Expected**: Recent tip with amount, message, tipper name.

```bash
curl -s -H "Authorization: Bearer $ARTIST_TOKEN" \
  http://localhost:4001/api/v1/tips/received | jq .
```

### VS-705: Validation errors

| Action | Expected |
|--------|----------|
| Tip amount ZMW 0.50 | 400 |
| Artist tips self | 403 |
| Invalid artistId | 404 |

---

## Regression checks

- SET_PRICE and PWYW track checkout still work.
- Purchase history shows TRACK_DOWNLOAD payments; tips appear in tip list (not mixed confusingly).

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| 404 on tip | Artist UUID from track `artistId` field |
| Earnings missing | `completePayment` TIP branch; earnings.track_id nullable migration |
| Analytics unchanged | Confirm earnings row with `source = TIP` for artist |

---

## Contract references

- [tips-api.md](./contracts/tips-api.md)
- [tip-ui.md](./contracts/tip-ui.md)
- [data-model.md](./data-model.md)

## Implementation validation (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-701 Send tip | PASS (build) | `POST /api/v1/payments/tip`; presets + custom on `/tip/:artistId` |
| VS-702 Message | PASS (build) | Optional message stored on `tips.message` |
| VS-703 Analytics | PASS (code) | `analytics.service` sums all earnings — TIP included |
| VS-704 Tip list | PASS (build) | `GET /api/v1/tips/received`; Recent tips on dashboard |
| VS-705 Validation | PASS (code) | Self-tip 403; min ZMW 1 via DTO |
| SC-703 Regression | PASS (build) | Checkout unchanged |
| Migration 007 | PASS | `tips` table + TIP enums applied |
| Lint / build | PASS | API and client lint + build succeed |
