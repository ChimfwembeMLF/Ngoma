# Feature Specification: Artist Analytics Dashboard

**Feature Branch**: `005-artist-analytics`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Phase 2 artist analytics — earnings summary, per-track breakdown, download and play stats on artist dashboard"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`, `004-design-system-legacy-pages` (payments, earnings, tracks, and styled artist dashboard exist)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - At-a-Glance Performance Summary (Priority: P1)

An artist opens their dashboard and immediately sees total net earnings, total downloads, total plays, and published track count in summary cards — without exporting reports or using admin tools.

**Why this priority**: Transparency on earnings and reach is the core Phase 2 promise (`PROJECT REQUIREMENTS.md` §3.4, §11.2 Week 13–14).

**Independent Test**: Sign in as ARTIST with seeded purchases → `/artist/dashboard` shows four summary metrics matching API aggregates.

**Acceptance Scenarios**:

1. **Given** an authenticated artist with completed track purchases, **When** they open the dashboard, **Then** they see total net earnings (sum of `earnings.amount`), total downloads (sum of track `downloads`), total plays (sum of track `plays`), and published track count.
2. **Given** an artist with no sales yet, **When** they open the dashboard, **Then** summary cards show zero values with muted empty-state copy — not errors.
3. **Given** a LISTENER user, **When** they call analytics APIs, **Then** they receive 403 Forbidden.

---

### User Story 2 - Earnings Breakdown by Track (Priority: P1)

An artist reviews which tracks generate revenue and compares downloads and plays per track in a sortable table.

**Why this priority**: “Earnings breakdown by track” is explicitly listed in Phase 2 Week 13–14 scope.

**Independent Test**: Artist with multiple tracks and at least one sale sees per-track rows with title, plays, downloads, gross/net revenue.

**Acceptance Scenarios**:

1. **Given** an artist with multiple tracks, **When** they view the earnings-by-track section, **Then** each row shows track title, play count, download count, and net earnings for that track.
2. **Given** a free track with plays but no purchases, **When** displayed, **Then** revenue shows ZMW 0.00 while plays/downloads still appear.
3. **Given** tracks are ranked by net earnings descending, **When** the table renders, **Then** highest-earning tracks appear first (top 10 by default).

---

### User Story 3 - Recent Earnings Timeline (Priority: P2)

An artist sees how earnings accrued over the last 30 days in a simple daily timeline (table or bar list) sourced from `earnings.created_at`.

**Why this priority**: Supports “real-time dashboard” intent without requiring chart libraries or projections in the first slice.

**Independent Test**: After sandbox purchases on different days (or seeded earnings), timeline shows non-zero daily buckets.

**Acceptance Scenarios**:

1. **Given** earnings records in the last 30 days, **When** the artist views the timeline, **Then** daily totals sum to the same net earnings as the summary card (within rounding).
2. **Given** a day with no earnings, **When** the timeline renders, **Then** that day shows ZMW 0.00 or is omitted — layout remains stable.
3. **Given** a `days` query parameter (7, 30, 90), **When** passed to the API, **Then** the timeline window adjusts accordingly (default 30).

---

### User Story 4 - Unique Supporters Count (Priority: P3)

An artist sees how many unique listeners have purchased their tracks (distinct payers from `earnings.user_id`) as a proxy for “active fans” until full demographics exist.

**Why this priority**: Lightweight engagement signal using existing payment data; avoids building fan profiling in this slice.

**Independent Test**: Two purchases by same user count as one supporter; two different users count as two.

**Acceptance Scenarios**:

1. **Given** multiple earnings from the same user, **When** summary loads, **Then** unique supporters count uses `COUNT(DISTINCT user_id)`.
2. **Given** no earnings, **When** summary loads, **Then** unique supporters shows 0.

---

### Edge Cases

- Artist with no `artistId` on JWT (corrupt account) → 403 with clear message.
- Decimal earnings amounts display with two fractional digits (ZMW).
- Very large play/download counts format with locale grouping (e.g. 1,234).
- Analytics queries scoped strictly to requesting artist — never leak other artists’ data.
- Unpublished/draft tracks appear in per-track stats only if they have plays/downloads/earnings.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-401**: System MUST expose `GET /api/v1/analytics/dashboard` returning summary metrics and top tracks for the authenticated artist.
- **FR-402**: System MUST expose `GET /api/v1/analytics/earnings/timeline` with optional `days` (7–90, default 30) returning daily net earnings buckets.
- **FR-403**: Analytics endpoints MUST require JWT auth and `ARTIST` role; data MUST be filtered by `artistId` from the token.
- **FR-404**: Net earnings MUST aggregate `earnings.amount` (artist share after platform fee already stored).
- **FR-405**: Per-track breakdown MUST join `tracks` with aggregated earnings and include `plays` and `downloads` from track columns.
- **FR-406**: Client MUST display analytics on `/artist/dashboard` using design-system `Card` components (from 003/004).
- **FR-407**: Client MUST fetch analytics via TanStack Query hooks in `client/src/hooks/useAnalytics.ts`.
- **FR-408**: Empty and loading states MUST use muted text on canvas per design system.
- **FR-409**: Platform fee totals MAY be included in dashboard response as optional `totalPlatformFees` for transparency.

### Key Entities

- **Earnings** (existing): `artist_id`, `track_id`, `user_id`, `amount`, `platform_fee`, `created_at`
- **Track** (existing): `plays`, `downloads`, `title`, `price`, `is_published`
- **AnalyticsSummary** (computed): totals + unique supporters
- **TrackAnalyticsRow** (computed): per-track metrics
- **EarningsTimelineBucket** (computed): `{ date, netEarnings }`

## Success Criteria *(mandatory)*

- **SC-401**: Artist dashboard shows summary + per-track table populated from live API data after a sandbox purchase.
- **SC-402**: Analytics API p95 < 300ms for artists with ≤100 tracks (indexed query on `earnings.artist_id`).
- **SC-403**: No cross-artist data leakage in manual or automated authorization tests.
- **SC-404**: VS-401–VS-404 quickstart scenarios pass.
- **SC-405**: Existing upload/track flows on artist dashboard remain functional (no regression).

## Assumptions

- `earnings` rows are created on completed track payments (existing `payments.service.ts` behavior).
- `track.plays` increments on stream; `track.downloads` on download — used as source of truth for engagement counts.
- Fan demographics, CSV/PDF export, charts with projections, and automated payouts are **out of scope** (later Phase 2 slices).
- No new charting library required — timeline rendered as table or CSS bar list.
- Currency is ZMW only for MVP analytics display.

## Out of Scope

- Fan demographics by country/age (`/analytics/fans`).
- Report export (`/analytics/download` CSV/PDF).
- Payout request UI and payout history (Week 21–22).
- Real-time WebSocket updates; polling/refetch on page load is sufficient.
- Admin platform-wide analytics.
