# Feature Specification: Ngoma Platform MVP

**Feature Branch**: `001-platform-mvp`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Ngoma music platform MVP: auth, artist profiles, track upload, PawaPay payments, listener discovery and playback"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Account Registration & Sign-In (Priority: P1)

A new user (artist or listener) creates an account with email, phone, and password, then signs in to access the platform. Artists can choose the artist role during registration and complete a basic profile.

**Why this priority**: No other feature works without authenticated users and role assignment.

**Independent Test**: Register a new user, sign in, receive a session/token, and view account details on a profile screen.

**Acceptance Scenarios**:

1. **Given** a visitor on the registration page, **When** they submit valid email, phone, password, full name, country, and role, **Then** an account is created and they can sign in.
2. **Given** a registered user, **When** they sign in with correct credentials, **Then** they receive access to role-appropriate areas (listener or artist).
3. **Given** invalid credentials, **When** they attempt sign-in, **Then** the system rejects access without revealing which field failed beyond a generic message.

---

### User Story 2 - Artist Profile & Track Publishing (Priority: P2)

An artist sets up their public profile (name, bio, genres) and uploads tracks with metadata, cover art, and a set price. They can publish, edit, and remove their tracks from a dashboard.

**Why this priority**: Supply-side content is required before listeners can discover or purchase music.

**Independent Test**: Sign in as an artist, create a profile, upload a track with price, publish it, and see it listed on the artist dashboard.

**Acceptance Scenarios**:

1. **Given** a signed-in artist without a profile, **When** they complete artist setup, **Then** their public artist page displays name, bio, and genres.
2. **Given** a signed-in artist, **When** they upload audio, cover art, title, genre, and price, **Then** the track appears as draft until published.
3. **Given** a published track, **When** the artist edits metadata or unpublishes, **Then** listener-facing listings reflect the change within one refresh cycle.

---

### User Story 3 - Mobile Money Purchase (Priority: P3)

A listener (or guest where allowed) pays for a priced track via mobile money (PawaPay). On successful payment, download access is granted and the artist earnings record is updated.

**Why this priority**: Monetization is core to Ngoma's value proposition for African artists.

**Independent Test**: Initiate payment for a priced track, complete sandbox mobile-money flow, and verify purchase appears in payment history with download access enabled.

**Acceptance Scenarios**:

1. **Given** a priced track and a user with a verified phone number, **When** they start checkout and confirm on mobile money, **Then** payment status moves to completed and download access is granted.
2. **Given** a failed mobile-money transaction, **When** the provider sends a failure webhook, **Then** payment status is failed and no download access is created.
3. **Given** a completed purchase, **When** the user opens purchase history, **Then** the transaction appears with amount, date, and track reference.

---

### User Story 4 - Music Discovery & Playback (Priority: P4)

Listeners browse and search published tracks, stream previews in-browser, and download tracks they own or that are free.

**Why this priority**: Completes the fan-facing loop after content and payments exist.

**Independent Test**: Browse published tracks without signing in, play a stream, purchase (or use free track), and download the audio file.

**Acceptance Scenarios**:

1. **Given** published tracks exist, **When** a visitor opens discovery, **Then** they see a paginated list with artist name, title, and price.
2. **Given** a track detail page, **When** the user presses play, **Then** audio streams without full page reload.
3. **Given** a user with download access, **When** they request download, **Then** they receive the audio file securely.

---

### Edge Cases

- Registration with duplicate email or phone is rejected with a clear validation message.
- Track upload exceeds size or unsupported format is rejected before save.
- Payment initiated but webhook delayed: user can poll payment status without duplicate charges.
- Artist deletes a track that was purchased: existing download access remains until expiry policy applies.
- Guest checkout (if enabled) still requires phone number for mobile money.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow registration with email, phone, password, full name, country, and role (Listener or Artist).
- **FR-002**: System MUST authenticate users and issue refreshable access tokens with role claims.
- **FR-003**: System MUST enforce role-based access (Artist, Listener, Admin) on protected actions.
- **FR-004**: Artists MUST be able to create and update a public artist profile.
- **FR-005**: Artists MUST be able to upload audio and cover art, set track metadata, price, and publish state.
- **FR-006**: System MUST integrate PawaPay for mobile-money deposits in ZMW (sandbox first).
- **FR-007**: System MUST process payment webhooks and grant download access on successful track purchases.
- **FR-008**: System MUST record artist earnings and platform fees per completed purchase.
- **FR-009**: Listeners MUST browse, search, stream, and download tracks per access rules.
- **FR-010**: System MUST expose payment and purchase history to authenticated users.
- **FR-011**: Admin role MUST access basic user listing and content moderation actions (MVP: list users, deactivate account).

### Key Entities

- **User**: Account holder with email, phone, role, country, verification flags.
- **Artist**: Public profile linked 1:1 to a User with artist-specific fields.
- **Album**: Optional grouping of tracks by an artist.
- **Track**: Audio asset with metadata, pricing, publish state, play/download counts.
- **Payment**: Mobile-money deposit with status lifecycle and purpose (e.g., track download).
- **DownloadAccess**: Grants a user rights to download a track for a period.
- **Earnings**: Artist revenue line item tied to a payment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: New users complete registration and first sign-in in under 3 minutes on mobile.
- **SC-002**: Artists publish a track end-to-end (upload + metadata + publish) in under 10 minutes.
- **SC-003**: 95% of sandbox mobile-money test payments resolve to a terminal status within 2 minutes.
- **SC-004**: Listeners can find, stream, and download a purchased track in under 5 taps from discovery.
- **SC-005**: API p95 latency under 500ms for read endpoints at MVP scale (≤1k concurrent users).

## Assumptions

- Initial market focus is Zambia (ZMW, +260 phone numbers, MTN/Airtel/Zamtel providers).
- PawaPay sandbox credentials are available for development and QA.
- MVP uses a single PostgreSQL database and object storage (Supabase or S3-compatible).
- Social OAuth (Google/Facebook) is deferred post-MVP; email/phone auth is sufficient for v1.
- Subscription tiers and payouts are out of MVP scope except schema hooks for future work.
- Admin moderation is basic (list/deactivate); advanced analytics dashboard is post-MVP.
