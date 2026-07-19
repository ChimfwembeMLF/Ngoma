# Feature Specification: Dashboard Card Padding Fix

**Feature Branch**: `017-dashboard-card-padding`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "fix the padding on the dashboard cards"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent stat card spacing (Priority: P1)

A user viewing any dashboard (`/dashboard`, `/artist/dashboard`, `/admin`) sees stat and summary cards with even padding on all sides — label and value text are not flush against the card edges.

**Why this priority**: Stat cards are the most visible dashboard element; missing horizontal padding looks broken and reduces readability.

**Independent Test**: Open `/dashboard` and `/artist/dashboard` — every `StatCard` has visible inset on left and right matching top/bottom.

**Acceptance Scenarios**:

1. **Given** listener dashboard loaded, **When** user views playlist/purchase stat cards, **Then** card content has consistent horizontal and vertical padding (≥12px on sm cards).
2. **Given** artist dashboard loaded, **When** user views the 6-column KPI row, **Then** all stat cards share the same padding as other shadcn cards site-wide.
3. **Given** admin overview loaded, **When** user views platform KPI cards, **Then** trend badges and values are inset from card borders.

---

### User Story 2 - Dashboard widget cards aligned (Priority: P1)

Quick actions, recent purchases, activity feed, and chart wrapper cards on dashboards use the same padding pattern as stat cards.

**Why this priority**: Mixed padding (some cards with `p-4`, some with none) creates visual inconsistency across dashboard sections.

**Independent Test**: Scroll through all three dashboard routes — no card section has text touching left/right edges.

**Acceptance Scenarios**:

1. **Given** listener dashboard, **When** quick action cards render, **Then** label and description have horizontal inset.
2. **Given** listener dashboard, **When** recent purchase rows render, **Then** each purchase card has balanced padding.
3. **Given** admin overview, **When** activity feed items render, **Then** activity text is inset from card edges.
4. **Given** artist dashboard, **When** earnings chart card renders, **Then** chart uses design-token padding (not ad-hoc overrides only).

---

### User Story 3 - No regression on non-dashboard cards (Priority: P2)

Fixing dashboard padding does not alter media cards, auth forms, or other pages that already use correct Card/CardContent patterns.

**Why this priority**: Global Card changes could break layouts that rely on current behavior (e.g. full-bleed covers).

**Independent Test**: Spot-check `/discover`, `/playlists`, `/auth` — layouts unchanged.

**Acceptance Scenarios**:

1. **Given** discover page with track/playlist media cards, **When** page renders, **Then** cover art remains full-bleed with padded text below only.
2. **Given** existing pages using `Card` + `CardContent`, **When** padding fix ships, **Then** those pages look identical to before.

---

### Edge Cases

- Long stat values (e.g. large currency amounts) wrap without touching card edges.
- Mobile single-column grids maintain padding at narrow widths.
- Loading skeleton stat cards match loaded card dimensions/padding.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-1701**: All shared dashboard components (`StatCard`, `QuickActionGrid`, `ActivityFeed`, `RecentPurchases`) MUST apply horizontal padding consistent with shadcn `CardContent` (`px-(--card-spacing)`).
- **FR-1702**: Dashboard chart wrappers (`EarningsTimeline`, admin revenue chart) MUST use the same padding token instead of inconsistent ad-hoc classes alone.
- **FR-1703**: `TrackEarningsTable` on artist dashboard MUST inset table content from card edges.
- **FR-1704**: Fix MUST be scoped to dashboard-related components — do NOT change global `Card` root padding (avoids breaking full-bleed layouts).
- **FR-1705**: Padding for `size="sm"` cards MUST use `--card-spacing: --spacing(3)` (12px) per existing Card design tokens.

### Key Entities

- **Dashboard Card Shell**: shadcn `Card` with vertical padding on root; horizontal padding via `CardContent`.
- **Card spacing token**: CSS variable `--card-spacing` driven by `data-size` on Card.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-1701**: 100% of dashboard stat/widget cards on `/dashboard`, `/artist/dashboard`, and `/admin` show visible horizontal inset (manual visual check, 3 routes).
- **SC-1702**: No duplicate or excessive padding (content not double-padded vs adjacent cards on same page).
- **SC-1703**: Client lint and build pass with zero new padding-related layout regressions on `/discover` and `/playlists`.

## Assumptions

- Root cause is dashboard components rendering content directly inside `Card` without `CardContent` (016 introduced this pattern).
- DESIGN.md card guidance (8px radius, padded content) applies; no new design tokens required.
- Client-only change — no API or database work.

## Dependencies

- Builds on `016-dashboard-enhancements` shared dashboard components
- Uses existing `client/src/components/ui/card.tsx` primitives
