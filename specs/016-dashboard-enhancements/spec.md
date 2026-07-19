# Feature Specification: Dashboard Enhancements

**Feature Branch**: `016-dashboard-enhancements`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Enhance the dashboards"

**Depends on**: `005-artist-analytics`, `009-shadcn-spotify-redesign`, existing `/dashboard`, `/artist/dashboard`, admin pages

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Listener Hub Dashboard (Priority: P1)

A signed-in listener opens `/dashboard` and sees a **personal hub**: welcome message, quick-action cards, library stats (playlists, purchases), and recent purchase activity — not just profile text and raw links.

**Why this priority**: `/dashboard` is the default post-login landing page but currently offers minimal value.

**Independent Test**: VS-1601 — Listener sees welcome, 3+ stat cards, quick actions, and last 3 purchases.

**Acceptance Scenarios**:

1. **Given** a listener with playlists and purchases, **When** they open `/dashboard`, **Then** they see playlist count, purchase count, and recent purchase rows.
2. **Given** a new listener with no activity, **When** they open `/dashboard`, **Then** empty states guide them to Discover with no errors.
3. **Given** quick-action cards, **When** clicked, **Then** they navigate to Discover, Playlists, and Purchase history.

---

### User Story 2 — Artist Dashboard KPI Trends (Priority: P1)

An artist sees **summary KPI cards with period trends** (e.g. ▲ 23% vs previous 30 days) for earnings, plays, downloads, and tips — matching PROJECT REQUIREMENTS §3.4.1 vision.

**Why this priority**: Artist dashboard has metrics but no comparative trends or visual chart polish.

**Independent Test**: VS-1602 — Summary cards show trend badge; earnings chart renders as bar/area chart for 7/30/90 days.

**Acceptance Scenarios**:

1. **Given** artist with earnings in last 30 days, **When** dashboard loads, **Then** net earnings card shows % change vs previous 30-day window.
2. **Given** earnings timeline, **When** artist selects 7d/30d/90d, **Then** a visual chart (not only a text list) displays daily buckets.
3. **Given** artist with tips, **When** dashboard loads, **Then** tips total appears in summary or dedicated stat card.

---

### User Story 3 — Admin Platform Overview Dashboard (Priority: P1)

An admin opens a dedicated **Admin overview** with platform KPIs: total users, tracks, platform revenue, active artists, revenue timeline, and recent activity feed — per PROJECT REQUIREMENTS §5.1.1.

**Why this priority**: Admin tools exist (users, theme, branding) but no unified overview dashboard.

**Independent Test**: VS-1603 — Admin at `/admin` sees 4 KPI cards, revenue chart, activity list, quick links.

**Acceptance Scenarios**:

1. **Given** admin user, **When** they open `/admin`, **Then** KPI cards show users, tracks, platform fees/revenue, active artists.
2. **Given** platform activity, **When** overview loads, **Then** recent activity lists new users, track uploads, and completed payments (last 7 days).
3. **Given** non-admin, **When** they visit `/admin`, **Then** 403/redirect (existing AdminRoute).

---

### User Story 4 — Unified Dashboard Components (Priority: P2)

Dashboards share reusable **StatCard**, **QuickActionGrid**, **TrendBadge**, and **MiniBarChart** components for consistent Spotify-style dark UI.

**Why this priority**: Prevents one-off styling across listener, artist, and admin dashboards.

**Independent Test**: VS-1604 — All three dashboards use shared `StatCard` with loading skeletons.

**Acceptance Scenarios**:

1. **Given** any dashboard loading, **When** data pending, **Then** skeleton placeholders match final card layout.
2. **Given** negative trend, **When** displayed, **Then** badge uses muted/down styling (not error red unless failure).

---

### User Story 5 — Role-Aware Dashboard Routing (Priority: P2)

Post-login and `/dashboard` surface **role-appropriate highlights**: admin sees admin overview link; artist sees earnings snapshot; listener sees library hub.

**Independent Test**: VS-1605 — Admin dashboard page links to full `/admin` overview; artist card shows link to artist dashboard with top earning stat.

**Acceptance Scenarios**:

1. **Given** ADMIN role on `/dashboard`, **When** page renders, **Then** prominent link/card to Admin overview (`/admin`) appears alongside existing admin links.
2. **Given** ARTIST on `/dashboard`, **When** page renders, **Then** mini earnings/plays snapshot or CTA to `/artist/dashboard` appears.

---

## Functional Requirements

- **FR-1601**: Listener dashboard MUST show welcome, quick actions, library stats, and recent purchases (limit 5).
- **FR-1602**: Artist analytics summary MUST include period-over-period % change for net earnings, plays, downloads (30d vs prior 30d).
- **FR-1603**: Artist earnings timeline MUST render as visual chart (CSS/SVG bars — no new chart library unless justified).
- **FR-1604**: Artist dashboard MUST surface tips total (sum of received tips).
- **FR-1605**: New admin overview page at `/admin` with KPI cards and activity feed.
- **FR-1606**: New `GET /api/v1/admin/dashboard` returning platform aggregates and recent activity.
- **FR-1607**: Extend `GET /api/v1/analytics/dashboard` (or companion endpoint) with `trends` and `tipsTotal` for artist KPI deltas.
- **FR-1608**: Shared dashboard UI components in `client/src/components/dashboard/`.
- **FR-1609**: All dashboards use `AppShell` max-width `6xl` for richer grid layouts where appropriate.
- **FR-1610**: Empty and error states MUST be user-friendly on all new widgets.

## Non-Functional Requirements

- **NFR-1601**: Admin dashboard queries MUST complete in <500ms p95 on seeded dev data (indexed aggregates).
- **NFR-1602**: No new npm chart dependencies for MVP — CSS/SVG bar chart only.
- **NFR-1603**: Mobile-responsive grids (1 col → 2 → 4 for stat cards).

## Success Criteria

- **SC-1601**: Listener, artist, and admin each have a materially richer dashboard vs current baseline.
- **SC-1602**: Artist summary shows at least one trend badge when seed data exists.
- **SC-1603**: Admin overview accessible from dashboard and nav.
- **SC-1604**: Zero regression on existing analytics API consumers.

## Out of Scope

- Fan demographics / country breakdown (PROJECT REQUIREMENTS §3.4.1 fan insights)
- CSV/PDF export, scheduled reports
- Real-time WebSocket updates
- Payout request workflow
- Content moderation queue on admin dashboard
- Subscription tier analytics

## Assumptions

- Existing `earnings`, `payments`, `tracks`, `users`, `tips` tables support aggregate queries
- Artist trends compare UTC 30-day windows
- Admin "platform revenue" = sum of `earnings.platform_fee` (or completed payment fees) in ZMW
