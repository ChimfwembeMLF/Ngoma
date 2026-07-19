# Feature Specification: Pay What You Want Pricing

**Feature Branch**: `006-pwyw-pricing`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Phase 2 Pay What You Want pricing — artists set minimum price, listeners choose amount at checkout"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics` (tracks, payments, checkout, and earnings exist)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Artist Sets PWYW Minimum (Priority: P1)

An artist uploading or editing a track can choose **Pay What You Want** pricing and set a minimum amount (e.g. ZMW 1.00). The track is stored with that pricing model and minimum.

**Why this priority**: Artists must configure PWYW before listeners can use it — core Week 15–16 capability (`PROJECT REQUIREMENTS.md` §3.3.1, §11.2).

**Independent Test**: Artist creates a PWYW track with min ZMW 5 → track detail and API show `pricingType: PAY_WHAT_YOU_WANT` and `minPrice: 5`.

**Acceptance Scenarios**:

1. **Given** an authenticated artist on upload/edit, **When** they select Pay What You Want and enter a minimum ≥ ZMW 0.01, **Then** the track saves with PWYW pricing and the minimum stored.
2. **Given** an artist selects Set Price or Free, **When** they save, **Then** `minPrice` is not required and PWYW rules do not apply.
3. **Given** an artist enters min price below ZMW 0.01, **When** they submit, **Then** validation rejects with a clear error.

---

### User Story 2 - Listener Chooses Amount at Checkout (Priority: P1)

A listener purchasing a PWYW track enters how much they want to pay (at or above the artist's minimum), completes mobile money checkout, and receives download access.

**Why this priority**: PWYW only delivers value when listeners can pay a chosen amount end-to-end.

**Independent Test**: Listener pays ZMW 10 for a track with min ZMW 5 → payment completes, download works, artist earnings reflect ZMW 10 gross (minus platform fee).

**Acceptance Scenarios**:

1. **Given** a published PWYW track with min ZMW 5, **When** a listener enters ZMW 10 at checkout and pays, **Then** payment initiates for ZMW 10 and completes via existing flow.
2. **Given** a listener enters ZMW 3 for min ZMW 5, **When** they submit, **Then** API returns 400 with minimum-not-met message.
3. **Given** a completed PWYW payment, **When** earnings are recorded, **Then** `earnings.amount` uses the listener's chosen amount (after platform fee split).

---

### User Story 3 - Discovery and Track Detail Display (Priority: P2)

Listeners browsing discover or track pages see clear PWYW labeling (minimum price, not a fixed price).

**Why this priority**: Prevents confusion between fixed-price and PWYW tracks before checkout.

**Independent Test**: PWYW track on `/discover` and `/tracks/:id` shows "Pay what you want" with minimum; SET_PRICE tracks unchanged.

**Acceptance Scenarios**:

1. **Given** a PWYW track, **When** shown on track detail, **Then** CTA reads "Pay what you want · from ZMW {minPrice}" instead of fixed "Buy · ZMW X".
2. **Given** a PWYW track on discover cards, **When** rendered, **Then** price label indicates PWYW minimum.
3. **Given** a SET_PRICE or FREE track, **When** displayed, **Then** existing labels remain unchanged.

---

### User Story 4 - Analytics Reflects PWYW Earnings (Priority: P3)

Artist dashboard analytics include PWYW purchases in net earnings and per-track breakdown using the amount the listener paid.

**Why this priority**: Confirms 005 analytics work without changes; regression validation only.

**Independent Test**: After PWYW purchase, dashboard summary and per-track net earnings increase by artist share of chosen amount.

**Acceptance Scenarios**:

1. **Given** a PWYW sale at ZMW 20, **When** artist opens dashboard, **Then** net earnings include artist share of ZMW 20.
2. **Given** multiple PWYW sales at different amounts, **When** per-track table loads, **Then** net earnings sum correctly per track.

---

### Edge Cases

- PWYW track with no `minPrice` in DB (legacy corrupt row) → treat as validation error on publish; API rejects payment.
- Listener pays exactly minimum → allowed.
- Very large chosen amount (e.g. ZMW 9999.99) → allowed if within payment provider limits; no artificial cap beyond DTO max.
- Artist changes min price after sales → existing purchases and earnings unchanged; new checkouts use new minimum.
- Unpublished PWYW track → not purchasable (same as SET_PRICE).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-601**: System MUST support `PAY_WHAT_YOU_WANT` as a track `pricingType` alongside `SET_PRICE` and `FREE`.
- **FR-602**: PWYW tracks MUST store `minPrice` (decimal, ≥ 0.01 ZMW); `price` field MUST remain null for PWYW.
- **FR-603**: Track create/update APIs MUST validate `minPrice` when `pricingType` is PWYW and reject invalid combinations.
- **FR-604**: Payment initiation MUST accept PWYW tracks when `amount >= track.minPrice`.
- **FR-605**: Payment initiation MUST reject amounts below `minPrice` with HTTP 400.
- **FR-606**: Client upload form MUST let artists select pricing type (Set price / Pay what you want / Free) with conditional fields.
- **FR-607**: Checkout page MUST show amount input for PWYW tracks, prefilled with minimum, validated client-side before submit.
- **FR-608**: Track detail and discover UI MUST display PWYW labeling with minimum price.
- **FR-609**: Existing SET_PRICE and FREE flows MUST remain unchanged (regression).

### Key Entities

- **Track** (extended): `pricingType` adds `PAY_WHAT_YOU_WANT`; new `minPrice` column for minimum listener payment
- **Payment** (existing): `amount` stores listener-chosen PWYW amount
- **Earnings** (existing): derived from payment amount — no schema change

## Success Criteria *(mandatory)*

- **SC-601**: Artist can publish a PWYW track and listener completes checkout at or above minimum in dev/sandbox.
- **SC-602**: Payment rejected when amount < minPrice with clear error message.
- **SC-603**: PWYW earnings appear in artist analytics dashboard (005) without API changes.
- **SC-604**: VS-601–VS-604 quickstart scenarios pass.
- **SC-605**: SET_PRICE and FREE checkout/upload flows unchanged.

## Assumptions

- Currency remains ZMW only; same platform fee rate as SET_PRICE (30% in current `payments.service.ts`).
- No suggested/default amount above minimum beyond prefilling checkout with `minPrice`.
- `EXCLUSIVE`, tipping, album bulk pricing, and ad-supported free are **out of scope** (later Week 15–16 items).
- PWYW uses same mobile money flow as SET_PRICE (`initiateDeposit` + PawaPay/sandbox).

## Out of Scope

- Subscription-gated exclusive content (`EXCLUSIVE` pricing type).
- Tipping artists independent of track purchase.
- Bulk/album bundle pricing.
- Ad-supported free downloads (FREE type already covers zero-cost downloads).
- PWYW on albums (tracks only in this slice).
