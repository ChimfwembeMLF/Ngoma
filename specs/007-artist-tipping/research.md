# Research: Artist Tipping

**Feature**: 007-artist-tipping | **Date**: 2026-07-19

## R1: Tip initiation endpoint

**Decision**: Add dedicated `POST /api/v1/payments/tip` with `InitiateTipDto` (artistId, amount, provider, phone, optional message, optional trackId).

**Rationale**: Tip payload differs from track purchase (artistId not track itemId, optional message). Separate endpoint keeps validation clear vs overloading `InitiatePaymentDto`.

**Alternatives considered**:
- Reuse `POST /payments/deposit` with `purpose: TIP` — viable but mixes track and artist validation in one handler; rejected for clarity

## R2: Payment and earnings linkage

**Decision**:
- `Payment.purpose = TIP`, `Payment.itemId = artistId`
- On completion: create `Tip` row + `Earnings` row with `source: TIP`
- `Earnings.trackId` nullable when tip has no track context

**Rationale**: Matches requirements schema; analytics already aggregates by `artist_id` on earnings.

**Alternatives considered**:
- Tips-only table without earnings — rejected; breaks 005 dashboard consistency

## R3: Platform fee for tips

**Decision**: `TIP_PLATFORM_FEE_RATE = 0.05` (artist gets 95%) in `payments.service.ts`, separate from download `0.30`.

**Rationale**: Explicit in `PROJECT REQUIREMENTS.md` pseudocode (`amountInZmw * 0.95` for TIP).

**Alternatives considered**:
- Same 30% as downloads — rejected; contradicts product spec "100% goes to artist (minus standard payment fees)" with lower platform take

## R4: Tips module placement

**Decision**: `Tip` entity + `TipsController` (`GET /api/v1/tips/received`) registered in `PaymentsModule`.

**Rationale**: Tips are payment-completed artifacts; avoids new top-level module for two endpoints.

**Alternatives considered**:
- `api/src/modules/tips/` — rejected for MVP scope; can extract later if tipping grows

## R5: Self-tip and authorization

**Decision**: Reject tip if `userId` owns the target `artistId` (403). Require JWT for initiation and tip list.

**Rationale**: Prevents fee arbitrage and fake supporter counts.

## R6: Artist tip list

**Decision**: `GET /api/v1/tips/received` — artist-only, last 20 tips with amount, createdAt, message, tipper display name (join users, exclude if future anonymous).

**Rationale**: Gives artists feedback beyond aggregate analytics; supports optional message US4.

**Alternatives considered**:
- Dashboard-only analytics — insufficient for message display

## R7: Client entry points

**Decision**: New route `/tip/:artistId?trackId=` query param; link from `TrackPage` as "Tip artist".

**Rationale**: Track page is primary fan surface; optional `trackId` query preserves context without requiring public artist profile page.

**Alternatives considered**:
- Modal on track page — rejected; checkout pattern uses dedicated page (consistent with `/checkout/:trackId`)

## R8: Preset amounts

**Decision**: UI presets ZMW 5, 10, 25, 50; custom input min 1.00; default selection ZMW 10.

**Rationale**: Matches wireframe §3.6.1 exactly.

## R9: Analytics impact

**Decision**: No changes to `analytics.service.ts` — `SUM(earnings.amount)` already includes all sources.

**Rationale**: Tip earnings rows use same table; verify in quickstart VS-703 only.
