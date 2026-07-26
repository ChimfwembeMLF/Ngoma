# Feature Specification: Ad-Supported Free Track Downloads

**Feature Branch**: `023-ad-supported-free-downloads`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User confirmed ad-supported monetization on free track downloads; update product requirements per `PROJECT REQUIREMENTS.md` §3.3.1 and §11.2.

**Depends on**: `022-free-track-downloads` (FREE download path + `canDownload`), `001-platform-mvp`, `016-dashboard-enhancements`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ad gate before free download (Priority: P1)

A signed-in listener clicks **Download free** on a `pricingType: FREE` track and must view a short sponsored message before the file downloads.

**Why this priority**: Core monetization for free content; aligns with product wireframe "Free Download (Ad-supported)".

**Independent Test**: VS-2301 — FREE track → Download free → ad modal with countdown → file downloads after completion.

**Acceptance Scenarios**:

1. **Given** a published FREE track and authenticated listener, **When** they click Download free, **Then** an ad gate modal appears before download starts.
2. **Given** the ad gate is showing, **When** the required view duration elapses and user confirms, **Then** download proceeds and file saves.
3. **Given** FREE track download API is called without a valid completed ad session, **When** request is made, **Then** API returns `403` with message indicating ad completion required.

---

### User Story 2 - Admin manages ad creatives (Priority: P1)

Platform admin uploads or configures house ad creatives (image, optional link, active flag) shown in the free-download gate.

**Why this priority**: Without creatives, ad gate is empty; admin must control messaging and campaigns.

**Independent Test**: VS-2302 — Admin adds creative → listener sees it in ad gate on free download.

**Acceptance Scenarios**:

1. **Given** admin user, **When** they open ad settings, **Then** they can add/edit/disable ad creatives.
2. **Given** at least one active creative, **When** listener opens ad gate, **Then** a random active creative is displayed.
3. **Given** no active creatives, **When** listener opens ad gate, **Then** platform default placeholder + countdown still allows download (graceful fallback).

---

### User Story 3 - Ad impressions & platform revenue tracking (Priority: P2)

Each completed ad gate records an impression linked to track and user for admin analytics and future revenue reporting.

**Why this priority**: Enables "how does the company make money" reporting; not blocking MVP gate UX.

**Independent Test**: VS-2303 — Complete ad gate → row in `ad_impressions`; admin overview shows ad impression count.

**Acceptance Scenarios**:

1. **Given** completed ad gate, **When** download succeeds, **Then** an `ad_impressions` record exists with `trackId`, `userId`, `creativeId`, `completedAt`.
2. **Given** admin overview, **When** loaded, **Then** ad impression metric is visible (count last 30 days).

---

### User Story 4 - Paid tracks unchanged (Priority: P1)

SET_PRICE and PAY_WHAT_YOU_WANT downloads never show the ad gate; purchase flow unchanged.

**Why this priority**: Ads apply only to free tier; paid downloads already generate platform fees.

**Independent Test**: VS-2304 — Paid track with `canDownload` → Download with no ad modal.

**Acceptance Scenarios**:

1. **Given** paid track with download access, **When** listener downloads, **Then** no ad gate is shown.
2. **Given** paid track without access, **When** TrackPage loads, **Then** behavior matches feature 022 (Buy only).

---

### Edge Cases

- User closes ad modal before countdown completes → download does not start; no impression recorded as completed.
- User refreshes during ad gate → new ad session required.
- Ad session expires (e.g. 2 min TTL) before download → must complete ad again.
- FREE track but `adsEnabled: false` in platform settings → direct download (admin kill switch).
- Mobile: modal is scroll-safe; countdown visible without layout shift.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-2301**: FREE track downloads MUST require a server-validated completed ad session unless platform `adsEnabled` is false.
- **FR-2302**: Ad gate MUST display for a configurable minimum duration (default **5 seconds**) before enabling download.
- **FR-2303**: Admin MUST manage house ad creatives (image URL, title, optional click-through URL, active flag).
- **FR-2304**: System MUST record completed ad impressions for analytics.
- **FR-2305**: Paid track downloads MUST NOT require ad sessions.
- **FR-2306**: Artist upload UI MUST label FREE pricing as **"Free download (ad-supported)"** per product requirements.
- **FR-2307**: Platform revenue model MUST document ad-supported downloads as a revenue source alongside track sales (30% fee) and tips (5% fee).

### Key Entities

- **AdCreative** — house banner/content shown in gate
- **AdSession** — short-lived token proving user started/completed ad view
- **AdImpression** — completed view record for analytics
- **PlatformSettings.ads** — `adsEnabled`, `gateSeconds`, creative list or FK

## Success Criteria *(mandatory)*

- **SC-2301**: FREE download cannot bypass ad gate via API alone (VS-2301, VS-2303).
- **SC-2302**: Admin can rotate creatives (VS-2302).
- **SC-2303**: Paid downloads regression-free (VS-2304).
- **SC-2304**: `PROJECT REQUIREMENTS.md` updated to define ad-supported free downloads and revenue attribution.

## Out of Scope

- Third-party ad networks (Google AdSense, programmatic RTB) — future integration
- Artist revenue share from ads — MVP: **100% platform**; configurable split in later phase
- Video/audio ads — display + countdown only in MVP
- Ads on streaming (only on FREE **download**)
- Subscription "ad-free" tier
