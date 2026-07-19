# Feature Specification: Artist Tipping

**Feature Branch**: `007-artist-tipping`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Phase 2 artist tipping — fans tip artists via mobile money with preset or custom amounts"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages`, `005-artist-analytics`, `006-pwyw-pricing` (payments, earnings, mobile money flow exist)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fan Sends a Tip (Priority: P1)

A signed-in listener tips an artist using mobile money, choosing a preset amount (ZMW 5 / 10 / 25 / 50) or a custom amount ≥ ZMW 1. Payment completes via existing PawaPay/sandbox flow.

**Why this priority**: Core Week 15–16 "Tipping system" deliverable (`PROJECT REQUIREMENTS.md` §3.6.1, §11.2).

**Independent Test**: Listener tips Demo Artist ZMW 10 → payment COMPLETED, tip record created, artist earnings increase.

**Acceptance Scenarios**:

1. **Given** a signed-in listener on the tip flow for a published artist, **When** they select ZMW 10 and pay via mobile money, **Then** payment completes and a tip row links artist, user, amount, and payment.
2. **Given** a custom amount ZMW 15 (≥ minimum), **When** submitted, **Then** deposit initiates for ZMW 15.
3. **Given** amount below ZMW 1, **When** submitted, **Then** API returns 400 with validation error.
4. **Given** a LISTENER tips an artist, **When** payment completes, **Then** artist receives 95% as net earnings (5% platform fee per requirements).

---

### User Story 2 - Tip from Track Page (Priority: P1)

A listener discovers an artist on a track detail page and opens a tip flow pre-associated with that artist (and optionally the track context).

**Why this priority**: Primary fan touchpoint in product wireframes (`PROJECT REQUIREMENTS.md` §4.1.3 "Tip Artist" on track page).

**Independent Test**: From `/tracks/:id`, "Tip artist" navigates to tip UI with correct artist; completed tip records optional track context.

**Acceptance Scenarios**:

1. **Given** a published track with artist info, **When** listener clicks "Tip artist", **Then** they land on tip page showing artist name and preset amounts.
2. **Given** tip initiated from track context, **When** payment completes, **Then** tip may store optional `trackId` for context; earnings created without requiring track purchase.

---

### User Story 3 - Artist Sees Tip Earnings in Analytics (Priority: P2)

Artist dashboard net earnings and unique supporters include tip revenue alongside download earnings.

**Why this priority**: Validates 005 analytics works with new earnings source without redesign.

**Independent Test**: After tip, artist `/artist/dashboard` net earnings increase by 95% of tip amount; unique supporters counts tipper if new.

**Acceptance Scenarios**:

1. **Given** a completed tip, **When** artist opens dashboard, **Then** summary `totalNetEarnings` includes tip artist share.
2. **Given** same user tipped and purchased, **When** supporters counted, **Then** they count once (`COUNT(DISTINCT user_id)`).

---

### User Story 4 - Optional Tip Message (Priority: P3)

A fan may attach a short optional message with their tip (stored on tip record, visible to artist in tip list).

**Why this priority**: Matches wireframe message field; lower priority than payment path.

**Independent Test**: Tip with message "Keep going!" → stored on tip; artist tip list shows message.

**Acceptance Scenarios**:

1. **Given** optional message ≤ 500 chars, **When** tip completes, **Then** message persisted on `tips.message`.
2. **Given** empty message, **When** tip completes, **Then** tip saves with null message.

---

### Edge Cases

- Tip self (artist tips own profile) → 400 Forbidden.
- Tip unpublished/non-existent artist → 404.
- Duplicate webhook completion → idempotent; no double earnings.
- Payment failure → no tip or earnings row.
- Anonymous tips → out of scope this slice (always linked to user_id server-side).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-701**: System MUST expose `POST /api/v1/payments/tip` to initiate artist tips via mobile money.
- **FR-702**: Tip amounts MUST be ≥ ZMW 1.00; presets 5 / 10 / 25 / 50 offered in UI.
- **FR-703**: Completed tips MUST create a `tips` record and an `earnings` row with `source: TIP`.
- **FR-704**: Tip platform fee MUST be 5% (artist receives 95%) per `PROJECT REQUIREMENTS.md` §3.6.1.
- **FR-705**: `PaymentPurpose` MUST include `TIP`; `itemId` on payment stores `artistId`.
- **FR-706**: Client MUST provide `/tip/:artistId` page with presets, custom amount, provider, phone, and optional message.
- **FR-707**: Track page MUST link to tip flow for the track's artist.
- **FR-708**: Artist MUST access `GET /api/v1/tips/received` listing recent tips (amount, date, message; fan name unless future anonymous support).
- **FR-709**: Analytics dashboard MUST include tip earnings in existing aggregates (no new analytics endpoints required).

### Key Entities

- **Tip** (new): `artistId`, `userId`, `amount`, `paymentId`, optional `message`, optional `trackId`
- **Payment** (extended): `purpose: TIP`, `itemId: artistId`
- **Earnings** (extended): `source: TIP`, nullable `trackId` for tip context

## Success Criteria *(mandatory)*

- **SC-701**: Listener completes sandbox tip end-to-end; artist earnings reflect 95% share.
- **SC-702**: VS-701–VS-704 quickstart scenarios pass.
- **SC-703**: Track purchase and PWYW flows unchanged (regression).
- **SC-704**: Artist tip list shows recent tips after payment.

## Assumptions

- Same mobile money providers and dev auto-complete as track checkout.
- Tips are ZMW only.
- No anonymous tips in this slice (`is_anonymous` column added but defaults false; UI toggle deferred).
- Public artist profile page enhancement is optional; tip entry from track page is sufficient for MVP.

## Out of Scope

- Anonymous tip toggle in UI.
- Push/email notifications to artist on new tip.
- Tipping from album purchase flow.
- Subscription/exclusive content (Week 15–16 remaining items).
- User playlists and share links (Week 17–18).
