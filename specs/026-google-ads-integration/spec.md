# Feature Specification: Google Ads Integration

**Feature Branch**: `026-google-ads-integration`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "fully integrate and implement Google Ads based on the model in Recommended Architecture.md and Ngoma Future.md"

---

## Overview

Ngoma generates revenue by helping African artists earn money while giving fans free access to quality music. This feature introduces Google Ads (AdSense) as a **platform revenue stream** by embedding real display advertisements across high-traffic surfaces of the Ngoma application.

The integration follows the product vision defined in the architecture documents:
- Artists may choose to offer songs as free downloads, gated behind an ad countdown.
- The platform keeps the advertising revenue from those interactions.
- Ambient display ads on discovery, track, and artist profile pages provide additional passive income for the platform.

This is distinct from — and additive to — the existing internal ad-creative system, which supports custom promotional banners uploaded by the Ngoma admin team. Google Ads serves alongside or inside the same surfaces where custom creatives appear.

---

## Clarifications

### Session 2026-08-01

- Q: Should Ngoma use Google Auto ads or manually placed ad units? → A: **Hybrid** — Enable Google Auto ads globally (Google fills and optimizes remaining page space) AND add manual ad units at the ad-gate modal and the three defined ambient positions (discover, track, artist profile).
- Q: What should the default ad-gate countdown duration be when Google Ads is serving? → A: **30 seconds** (maximum viewability / highest CPM potential), AND it remains fully admin-configurable via the existing `gateSeconds` platform setting so operators can tune it at any time.
- Q: Should AdSense Experiments (A/B testing of ad placements) be in scope? → A: **Out of scope entirely.** Revenue optimisation is delegated entirely to Google Auto ads automatic optimisation. No AdSense Experiments feature will be implemented.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Fan Watches Ad Before Downloading Free Track (Priority: P1)

A fan visits a track page for a free song. Instead of downloading immediately, they are shown a timed ad countdown (the existing gate). During the countdown, a real Google display advertisement is rendered inside the gate. Once the countdown completes, the download is unlocked.

**Why this priority**: This is the primary monetisation mechanism documented in the architecture — "Fan watches 20-second advertisement → Download unlocked → Platform keeps advertising revenue." It delivers value without charging the fan and rewards artists with maximised reach.

**Independent Test**: Can be fully tested by navigating to any free track page, triggering the download gate, and confirming that a Google Ad unit renders inside the countdown modal before the download button appears.

**Acceptance Scenarios**:

1. **Given** a free track with the ad gate enabled, **When** a fan clicks the download button, **Then** the ad gate countdown modal opens with a Google display advertisement visible inside it.
2. **Given** the ad gate is open, **When** the countdown timer reaches zero, **Then** the download is unlocked and the Google ad is no longer blocking the action.
3. **Given** Google AdSense is unavailable or not configured, **When** the gate opens, **Then** the system falls back to displaying the existing custom creative (or a blank space) and the countdown still works correctly.

---

### User Story 2 — Fan Sees Ambient Ads While Browsing Music (Priority: P2)

A fan browses the Discover page, views an artist profile, or reads a track detail page. Google display ad units (banner, rectangle) appear in non-intrusive positions on these pages — above the music grid, in the sidebar, or between the artist header and tracklist.

**Why this priority**: Passive display ads on high-traffic discovery pages are the second-largest revenue stream after ad-gated downloads. They require no user interaction and generate impressions continuously.

**Independent Test**: Can be tested by navigating to `/discover`, `/artists/:id`, and `/tracks/:id` pages and confirming ad unit elements are rendered at their designated positions.

**Acceptance Scenarios**:

1. **Given** a signed-out or signed-in fan on the Discover page, **When** the page loads, **Then** a leaderboard or horizontal ad banner appears between the hero section and the music grid.
2. **Given** a fan on any Track detail page, **When** the page loads, **Then** a rectangle display ad appears below the download/stream action area.
3. **Given** a fan on an Artist Profile page, **When** the page loads, **Then** a leaderboard ad appears between the artist header and the song list.
4. **Given** the platform admin has disabled Google Ads, **When** any page loads, **Then** no Google Ad unit slots render anywhere in the application.

---

### User Story 3 — Platform Admin Configures Google Ads Settings (Priority: P2)

The Ngoma platform admin can view the current Google AdSense configuration status in the admin panel and toggle Google Ads on or off for the entire platform without a code deployment.

**Why this priority**: Operational control ensures the team can respond to AdSense policy changes, apply for new ad units, or temporarily disable ads without downtime.

**Independent Test**: Can be tested by navigating to the admin Ads panel and toggling the Google Ads enabled setting, then confirming ad units appear or disappear on fan-facing pages accordingly.

**Acceptance Scenarios**:

1. **Given** the admin is on the Ads configuration panel, **When** they view the Google AdSense section, **Then** they see the publisher status (configured / not configured) and whether ads are enabled.
2. **Given** Google Ads is enabled, **When** a platform admin disables it via the admin panel, **Then** all Google ad unit slots are hidden on subsequent page navigations.
3. **Given** a publisher ID has not been configured, **When** the admin views the Google AdSense panel, **Then** a clear setup guide is shown explaining how to configure the publisher ID and slot IDs.

---

### User Story 4 — Artist Sees Ad-Supported Label on Free Tracks (Priority: P3)

An artist who has set their track to "Free" sees a label on their dashboard indicating that free tracks are ad-supported and that the platform uses ad revenue to sustain free distribution.

**Why this priority**: Transparency about the ad model builds trust with artists. It is lower priority because it is informational and does not block monetisation.

**Independent Test**: Can be tested by uploading a free track, viewing the artist dashboard track list, and confirming the "Ad-supported" label is visible.

**Acceptance Scenarios**:

1. **Given** an artist has at least one free track, **When** they view their track list in the dashboard, **Then** each free track shows an "Ad-supported" label.
2. **Given** an artist views the free track label, **When** they hover or tap on the indicator, **Then** they see a short explanation: "This track is free for fans. Ad revenue helps sustain the platform."

---

### Edge Cases

- What happens when the AdSense script is blocked by an ad-blocker? The ad slot must fail silently — no JavaScript errors, no broken layout, the gate countdown and download still function normally.
- What happens when Google AdSense serves no fill (no ad available)? The slot collapses gracefully or shows a blank area; the rest of the page and gate flow are unaffected.
- What happens on mobile screen widths? Ad units must be responsive and MUST NOT overflow the viewport or break the layout on screens from 320px wide.
- What happens if both Google Ads and the custom creative system are active? Google Ads takes priority in the ad-gate modal; custom creatives serve as the fallback.
- What happens if a fan uses an older browser that does not support the AdSense script? The script load fails silently; the rest of the page renders normally.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The platform MUST display a Google AdSense display advertisement inside the existing ad-gate countdown modal for free tracks when AdSense is enabled and configured.
- **FR-002**: The platform MUST display manually placed Google AdSense ad units at four defined positions: the ad-gate modal, the Discover page, the Track detail page, and the Artist Profile page.
- **FR-012**: The platform MUST additionally enable Google Auto ads globally, allowing Google to automatically identify and fill additional ad positions across fan-facing pages beyond the four manually defined placements.
- **FR-003**: The platform MUST gracefully degrade — with zero errors and no broken layouts — when the AdSense script is blocked, fails to load, or returns no fill.
- **FR-004**: The existing ad-gate countdown timer MUST continue functioning correctly regardless of whether a Google Ad renders successfully. When Google Ads is active, the default gate duration MUST be 30 seconds to maximise ad viewability and CPM revenue; the value MUST remain admin-configurable via the platform settings panel.
- **FR-005**: The platform admin MUST be able to enable or disable all Google Ad unit rendering globally via the admin panel without a code deployment.
- **FR-006**: The Google AdSense publisher ID and per-placement ad slot IDs MUST be configurable via environment variables, not hardcoded.
- **FR-007**: All ad unit placements MUST be responsive and MUST NOT overflow or break the layout on any screen width from 320px to 1920px.
- **FR-008**: The admin panel Ads section MUST display the current AdSense configuration status (publisher configured / not configured, ads enabled / disabled).
- **FR-009**: Free tracks in the artist dashboard MUST display an "Ad-supported" label visible to the artist.
- **FR-010**: Google Ads MUST NOT appear on admin-only pages or within authenticated artist management views.
- **FR-011**: When Google Ads are disabled, existing custom creatives uploaded by the admin MUST continue to serve in the ad-gate modal as the fallback.

### Key Entities

- **Ad Unit Placement**: A named position on a page (e.g., "discover-leaderboard", "track-sidebar", "ad-gate-modal") associated with a Google AdSense slot ID and format (leaderboard, rectangle, responsive).
- **AdSense Configuration**: Platform-level settings controlling whether Google Ads are enabled globally. Stored as part of the existing platform ads config alongside gate settings.
- **Ad-Gate Session** *(existing)*: The timed interaction where a fan watches an ad before unlocking a free download. This entity is unchanged; only the advertisement content rendered inside the gate is enhanced.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A fan can complete the full free-track ad-gate flow (trigger gate → ad renders → 30-second countdown completes → download) in under 90 seconds total on a standard broadband connection.
- **SC-002**: Google ad unit elements are present in the HTML on 100% of Discover, Track, and Artist Profile page loads when AdSense is enabled and the AdSense script is not blocked.
- **SC-003**: Zero JavaScript console errors occur on any fan-facing page load when an ad-blocker is active or when AdSense returns no fill.
- **SC-004**: A platform admin can toggle Google Ads on/off and the change takes effect on fan-facing pages within one page navigation — no server restart or deployment required.
- **SC-005**: Ad unit containers do not cause horizontal scroll or overflow on any screen width between 320px and 1920px.
- **SC-006**: 100% of free tracks in the artist dashboard track list display the "Ad-supported" label.

---

## Assumptions

- The Ngoma platform will obtain an approved Google AdSense publisher account. Without an approved account, ad slots render as blank space until approval; this does not block the implementation.
- Individual ad slot IDs will be created in the AdSense dashboard for each of the four manual placements (discover page, track page, artist profile page, ad-gate modal) — 4 slots needed. Auto ads use a single publisher-level script and require no additional slot IDs.
- The existing ad-gate countdown timer logic, ad session lifecycle, and admin creative management are **not replaced** — they remain fully functional as a fallback layer when Google Ads is disabled.
- Mobile support is in scope using responsive/auto-sizing ad formats.
- Fans are shown ads regardless of login state on all public-facing pages; no personalisation of ads based on Ngoma user data is implemented.
- AdSense revenue reporting is handled entirely within the Google AdSense dashboard; Ngoma does not need to build a revenue reporting UI for this feature.
- AdSense Experiments (A/B testing of ad formats and placements) are explicitly **out of scope**. Revenue performance optimisation is delegated to Google Auto ads' automatic machine-learning optimisation.
- Compliance with Google AdSense program policies (placement rules, content policies) is the responsibility of the platform operator.
