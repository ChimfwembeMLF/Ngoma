# Research: Pay What You Want Pricing

**Feature**: 006-pwyw-pricing | **Date**: 2026-07-19

## R1: Pricing type enum extension

**Decision**: Add `PAY_WHAT_YOU_WANT = 'PAY_WHAT_YOU_WANT'` to `PricingType` enum in `track.entity.ts` and expand DB CHECK constraint via migration.

**Rationale**: Matches `PROJECT REQUIREMENTS.md` schema intent (`pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE', ...)`). Keeps parity between TypeORM enum and PostgreSQL CHECK.

**Alternatives considered**:
- Store PWYW as SET_PRICE with flag — rejected; obscures semantics in analytics and UI
- Add `EXCLUSIVE` in same migration — rejected; out of scope for this slice

## R2: Price vs minPrice field mapping

**Decision**:
| pricingType | `price` | `minPrice` |
|-------------|---------|------------|
| SET_PRICE | required fixed amount | null |
| PAY_WHAT_YOU_WANT | null | required minimum |
| FREE | null | null |

**Rationale**: Aligns with requirements doc `min_price` column. Avoids overloading `price` for two meanings.

**Alternatives considered**:
- Use `price` as minimum for PWYW — rejected; breaks existing SET_PRICE semantics and client display logic

## R3: Migration strategy for CHECK constraint

**Decision**: Migration `1719000000006-TrackPwywPricing.ts`:
1. `ALTER TABLE tracks ADD COLUMN min_price DECIMAL(10,2)`
2. Drop existing `tracks_pricing_type_check` (or inline CHECK from create migration)
3. Re-add CHECK: `pricing_type IN ('SET_PRICE', 'PAY_WHAT_YOU_WANT', 'FREE')`

**Rationale**: PostgreSQL requires dropping/recreating CHECK to add enum value. No data backfill needed — existing rows remain SET_PRICE/FREE.

**Alternatives considered**:
- Remove CHECK, rely on app validation only — rejected; constitution prefers DB constraints for enum integrity

## R4: Payment initiation validation

**Decision**: In `payments.service.initiateDeposit()`:
- Allow `track.pricingType === PAY_WHAT_YOU_WANT`
- Validate `dto.amount >= Number(track.minPrice)`
- Reject with `BadRequestException('Amount must be at least ZMW {min}')`
- Use `dto.amount` (not `track.price`) for payment record

**Rationale**: Listener-chosen amount is the payment source of truth; earnings already derive from `payment.amount`.

**Alternatives considered**:
- Separate `/payments/pwyw/deposit` endpoint — rejected; unnecessary duplication

## R5: Client pricing selector pattern

**Decision**: Radio group in `TrackUploadForm`: Set price | Pay what you want | Free. Show price input for SET_PRICE, min price input for PWYW, hide both for FREE.

**Rationale**: Matches wireframe in `PROJECT REQUIREMENTS.md` §3.3.1. Minimal change to existing form.

**Alternatives considered**:
- Dedicated pricing page — rejected; over-scoped for dashboard upload flow

## R6: Checkout amount UX

**Decision**: `CheckoutPage` shows editable amount field when `pricingType === 'PAY_WHAT_YOU_WANT'`, prefilled with `minPrice`, `min={minPrice}`, step 0.01. Client validates before API call; server re-validates.

**Rationale**: Double validation prevents bad requests; prefilled minimum reduces friction.

**Alternatives considered**:
- Slider UI — rejected; adds complexity without spec requirement

## R7: Display labels

**Decision**:
- TrackCard / discover: `"PWYW from ZMW X"` or `"Pay what you want · from ZMW X"`
- TrackPage CTA: `"Pay what you want · from ZMW {minPrice}"`
- SET_PRICE / FREE: unchanged

**Rationale**: Clear differentiation at browse and detail stages.

## R8: Analytics impact

**Decision**: No analytics module changes. PWYW payments create standard `earnings` rows via existing `completePayment()`.

**Rationale**: 005 analytics aggregates by payment amount already.

**Alternatives considered**:
- Tag earnings source as PWYW — deferred; optional future column not needed for MVP slice
