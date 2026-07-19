# Feature Specification: Client Design System Rollout

**Feature Branch**: `003-client-design-system`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Apply client/DESIGN.md design system to Discover, Track, Dashboard, and Auth pages"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening` (functional pages exist)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover Music with a Cohesive Marketplace Feel (Priority: P1)

A listener opens the Discover page and immediately recognizes a clean, photography-forward marketplace layout: white canvas, ink typography, a single bold accent for primary actions, pill-shaped search, and soft-rounded track cards with cover art, title, artist, duration, and price.

**Why this priority**: Discover is the default landing experience; visual consistency here sets the brand tone for the entire product.

**Independent Test**: Open Discover without signing in; browse Trending and New Releases, run a search, and confirm layout, hierarchy, and interactive states match the design reference.

**Acceptance Scenarios**:

1. **Given** an unauthenticated visitor, **When** they open Discover, **Then** they see a white page background, ink headings, muted secondary text, and a prominent pill-shaped search control.
2. **Given** published tracks with cover art, **When** the user scrolls Trending or New Releases, **Then** each track appears in a photo-first card with rounded corners, title, artist, duration (when available), and price or “Free” label.
3. **Given** the user types a search query, **When** results load, **Then** results use the same card pattern and visual hierarchy as curated sections.
4. **Given** a track has no cover art, **When** it appears in a card, **Then** a neutral placeholder surface is shown without breaking card layout.
5. **Given** a section has no tracks, **When** the page renders, **Then** an empty-state message is shown in muted text without layout collapse.

---

### User Story 2 - Track Detail as a Focused Listening Experience (Priority: P1)

A listener opens a track detail page and sees a clear content hierarchy: back navigation, large title and artist metadata, cover art or hero area, duration and genre, playback controls, and purchase/download actions styled consistently with the design system.

**Why this priority**: Track detail is the conversion point for playback and purchase; it must feel trustworthy and polished.

**Independent Test**: Open any published track; verify metadata, player area, and action buttons match design tokens and remain usable on mobile width.

**Acceptance Scenarios**:

1. **Given** a published track, **When** the user opens its detail page, **Then** title uses display typography, artist and genre use secondary muted styles, and duration displays when available.
2. **Given** a priced track, **When** the user is signed in, **Then** primary purchase action uses the brand accent color with white label text; secondary actions use outline or ghost styles per the design reference.
3. **Given** the user taps “Back to discover”, **When** navigation occurs, **Then** the link is visually identifiable as a text/tertiary action in brand-consistent styling.
4. **Given** a loading or not-found state, **When** the page renders, **Then** feedback uses the same color and type scale as other pages (no legacy dark-theme remnants).

---

### User Story 3 - Sign In and Register with a Professional Auth Experience (Priority: P2)

A new or returning user opens the Auth page and completes login or registration in a centered, card-based layout with clear labels, accessible inputs, primary submit button, mode toggle, and inline error feedback.

**Why this priority**: Auth is the trust gateway; inconsistent styling here undermines confidence in payments and downloads.

**Independent Test**: Toggle login/register, submit valid and invalid forms, and confirm visual states (focus, error, disabled, loading) align with the design system.

**Acceptance Scenarios**:

1. **Given** the Auth page, **When** it loads, **Then** the page uses the white canvas background with a bordered, rounded form card and ink headings.
2. **Given** the user focuses an input field, **When** the field is active, **Then** border and label states follow the design reference text-input pattern.
3. **Given** invalid credentials, **When** submission fails, **Then** an error message appears in the semantic error color without breaking layout.
4. **Given** the user switches between login and register, **When** the mode changes, **Then** the toggle and form headings update while preserving consistent spacing and button styles.

---

### User Story 4 - Dashboard as a Consistent Signed-In Hub (Priority: P2)

A signed-in user opens the Dashboard and sees their profile summary and navigation links presented with the same tokens, button variants, and card surfaces as Discover and Track pages.

**Why this priority**: Dashboard is the post-auth home; visual drift here signals an unfinished product.

**Independent Test**: Sign in as LISTENER, ARTIST, and ADMIN (where applicable); confirm profile card, links, and role-specific actions match the design system.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they open Dashboard, **Then** profile information appears in a bordered card with ink primary text and muted labels.
2. **Given** a user with role LISTENER, **When** they view action links, **Then** primary and secondary button styles match those on Discover and Track pages.
3. **Given** an ADMIN user, **When** they view the page, **Then** the admin link is visually distinct but uses the same component variants (not legacy colors).
4. **Given** an ARTIST user, **When** they view the page, **Then** artist actions use the primary accent for the main CTA and outline style for secondary actions.

---

### User Story 5 - Shared Design Language Across the Four Pages (Priority: P1)

Any user moving between Discover, Track, Auth, and Dashboard perceives one product: shared colors, typography scale, spacing rhythm, button variants, card surfaces, and interactive states sourced from `client/DESIGN.md`.

**Why this priority**: Without shared tokens and components, per-page polish will diverge and require rework.

**Independent Test**: Walk Discover → Track → Auth → Dashboard in one session; no page should retain the previous dark indigo/cream theme or mismatched corner radii.

**Acceptance Scenarios**:

1. **Given** all four in-scope pages, **When** compared side by side, **Then** primary accent, ink text, muted secondary text, hairline borders, and page canvas color are consistent.
2. **Given** any primary call-to-action on an in-scope page, **When** rendered, **Then** it uses the single brand accent with on-primary (white) label text and soft corner radius per the design reference.
3. **Given** viewport width 375px, **When** each in-scope page is viewed, **Then** content remains readable without horizontal scroll and touch targets meet minimum 44px height where interactive.

---

### Edge Cases

- Very long track or artist names truncate gracefully in cards without overlapping price or duration.
- Missing cover art shows a neutral placeholder maintaining card aspect ratio.
- Empty discovery sections (no trending/new releases) show helpful empty copy.
- Auth form validation errors persist until corrected; multiple errors do not stack off-screen.
- Slow network: loading placeholders on Discover and Track use muted text or skeleton surfaces consistent with the light theme.
- User prefers reduced motion: hover/focus transitions remain functional without relying solely on animation for affordance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-201**: The Discover page MUST adopt the visual language defined in `client/DESIGN.md` including white canvas, ink typography, pill search bar, and photo-first track cards.
- **FR-202**: The Track detail page MUST adopt the same tokens for headings, metadata, action buttons, and playback area styling.
- **FR-203**: The Auth page MUST use design-system form inputs, primary submit button, mode toggle, and error messaging.
- **FR-204**: The Dashboard MUST use design-system cards, typography, and button variants for profile summary and navigation links.
- **FR-205**: All four pages MUST share a single set of design tokens (colors, typography scale, spacing, corner radii) derived from `client/DESIGN.md`.
- **FR-206**: Primary actions on in-scope pages MUST use the brand accent color; secondary actions MUST use outline or ghost variants per the design reference.
- **FR-207**: Track cards on Discover MUST display title, artist, duration (when > 0), and price or free indicator without losing layout on narrow viewports.
- **FR-208**: In-scope pages MUST remove legacy dark-theme color usage (indigo/cream palette) so no visual regression to the pre-redesign appearance remains on those routes.
- **FR-209**: Interactive elements on in-scope pages MUST provide visible hover and focus states consistent with the design reference.
- **FR-210**: Empty, loading, and error states on in-scope pages MUST use muted text and surfaces from the design token set.

### Key Entities

- **Design token set**: Canonical colors, typography roles, spacing units, radii, and shadow tier from `client/DESIGN.md`.
- **UI component variants**: Primary button, secondary/outline button, text input, track card, profile card, search pill — mapped from design reference components (e.g., property-card, text-input, button-primary).
- **In-scope routes**: Discover, Track detail, Auth, Dashboard only.

## Success Criteria *(mandatory)*

- **SC-201**: A reviewer walking Discover → Track → Auth → Dashboard in one session reports zero pages still using the legacy dark indigo/cream theme.
- **SC-202**: 100% of primary CTAs on in-scope pages use the single brand accent with sufficient contrast for label readability.
- **SC-203**: At 375px viewport width, all four pages render without horizontal overflow and primary actions remain tappable (minimum 44px touch target).
- **SC-204**: Existing functional flows (search, track playback trigger, login, register, dashboard navigation) complete successfully with no increase in user-visible errors compared to pre-redesign behavior.
- **SC-205**: Visual consistency checklist (colors, type scale, button/card radii) passes for all four pages against `client/DESIGN.md` reference tokens.

## Assumptions

- `client/DESIGN.md` is the authoritative design reference; Airbnb-inspired light theme (white canvas, Rausch #ff385c accent, ink text) replaces the current dark theme on the four named pages only.
- Out of scope for this feature: Artist dashboard, Admin users, Checkout, Purchase history, and global app shell beyond what those four pages require.
- Custom font “Airbnb Cereal VF” may use licensed web font or acceptable fallback stack (Circular, system UI) without changing layout intent.
- No API, data model, or routing changes; this is a presentation-layer update preserving existing behavior.
- Audio player component may be restyled but playback behavior remains unchanged.
- Dark mode is not required; public pages in the design reference use light canvas only.

## Out of Scope

- Redesign of pages not listed (Artist dashboard, Admin, Checkout, Purchase history, Artist profile).
- New discovery features (recommendations, playlists, social sharing).
- Backend or payment flow changes.
- Full design-system documentation site or Storybook (optional follow-up).
- Logo or brand mark design beyond applying existing Ngoma naming in nav/header areas.
