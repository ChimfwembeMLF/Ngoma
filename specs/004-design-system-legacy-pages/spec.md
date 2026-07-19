# Feature Specification: Design System — Legacy Pages Rollout

**Feature Branch**: `004-design-system-legacy-pages`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Complete design system rollout on remaining legacy client pages after 003-client-design-system"

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system` (UI primitives and four core pages migrated)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Artist Dashboard with Consistent Upload Experience (Priority: P1)

An artist opens the dashboard, sees their track list and upload form styled with the same light canvas, ink typography, and primary accent as Discover and Dashboard. Upload, pricing, and publish controls remain fully functional.

**Why this priority**: Artist dashboard is the primary creator workflow; visual drift signals an unfinished product and erodes trust before checkout.

**Independent Test**: Sign in as ARTIST, open `/artist/dashboard`, upload a track, confirm list refresh — all UI uses design-system tokens with no indigo/cream/terracotta remnants.

**Acceptance Scenarios**:

1. **Given** an authenticated artist, **When** they open `/artist/dashboard`, **Then** the page uses `DesignSystemLayout`, ink headings, muted secondary text, and primary/outline buttons.
2. **Given** the track upload form, **When** displayed, **Then** inputs match the Auth page `Input` pattern and submit uses primary `Button`.
3. **Given** tracks in the artist library, **When** listed, **Then** each row appears in a bordered card with title, status, price, and a text link styled as ghost/outline — not legacy terracotta.
4. **Given** a loading or empty track list, **When** rendered, **Then** feedback uses muted text on canvas without layout collapse.

---

### User Story 2 - Artist Profile Editing (Priority: P2)

An artist updates their public profile (name, bio, genres) in a form that matches the design system card and input patterns.

**Why this priority**: Profile is linked from Dashboard; inconsistent styling breaks the signed-in journey.

**Independent Test**: Open `/artist/profile`, edit fields, save — success message and form use design tokens.

**Acceptance Scenarios**:

1. **Given** an artist on `/artist/profile`, **When** the page loads, **Then** it uses `DesignSystemLayout` and a bordered `Card` for the form.
2. **Given** profile fields, **When** focused or filled, **Then** `Input` / textarea styling matches Auth page patterns.
3. **Given** a successful save, **When** feedback appears, **Then** confirmation uses muted or success-appropriate ink text (not green-on-dark legacy styling).

---

### User Story 3 - Checkout and Payment Status (Priority: P1)

A listener initiates mobile-money checkout for a priced track on a page that feels as trustworthy as Track detail — clear hierarchy, primary pay action, and payment status panel on canvas.

**Why this priority**: Checkout is the revenue conversion point; legacy dark styling undermines payment confidence.

**Independent Test**: Sign in, open `/checkout/:trackId` for a priced track, initiate deposit — page and `PaymentStatusPanel` use design system.

**Acceptance Scenarios**:

1. **Given** a priced track, **When** the user opens checkout, **Then** track summary, phone input, and pay button use design-system typography and button variants.
2. **Given** payment in progress, **When** status panel renders, **Then** it uses `Card` with hairline border and ink/muted text (not indigo-900 overlay).
3. **Given** navigation back to track, **When** the user clicks back, **Then** the link is a ghost or outline action consistent with Track page.

---

### User Story 4 - Admin User Management (Priority: P2)

An admin manages users on `/admin/users` with the same visual language as the rest of the signed-in product — readable table, role filter, pagination, and deactivate affordances.

**Why this priority**: Admin was built in 002 with legacy styling; admins should not feel they are on a different product.

**Independent Test**: Sign in as ADMIN, open `/admin/users`, filter by role, paginate, deactivate — table and controls match design system.

**Acceptance Scenarios**:

1. **Given** an admin on `/admin/users`, **When** the page loads, **Then** it uses `DesignSystemLayout` with ink headings and outline/ghost navigation links.
2. **Given** the user table, **When** rendered, **Then** header row uses `surface-soft`, rows use hairline dividers, and text is ink/muted — no cream-on-indigo table.
3. **Given** role filter and pagination, **When** used, **Then** controls use `Input`/`Button` variants from `components/ui/`.
4. **Given** admin route loading state, **When** auth resolves, **Then** loading UI uses canvas/muted text (not `LegacyLayout`).

---

### User Story 5 - Global Theme Consistency & Legacy Removal (Priority: P1)

Any user navigating across all client routes perceives one product. Legacy `LegacyLayout`, dark-theme tokens, and split body styles are removed after migration.

**Why this priority**: 003 intentionally scoped four pages; this feature closes the visual gap and enables global `index.css` defaults.

**Independent Test**: Walk Discover → Dashboard → Artist dashboard → Checkout → Admin → Purchases in one session — zero legacy color classes in rendered UI.

**Acceptance Scenarios**:

1. **Given** all client routes, **When** visited, **Then** no route wraps content in `LegacyLayout`.
2. **Given** migration complete, **When** `index.css` body styles are inspected, **Then** default is `bg-canvas text-ink font-sans`.
3. **Given** a repo-wide grep for legacy classes (`text-cream`, `bg-indigo-950`, `text-terracotta`, `LegacyLayout`), **When** run on `client/src/`, **Then** zero matches remain (excluding archived docs if any).

---

### Edge Cases

- Long artist or track names in dashboard rows truncate without breaking action links.
- Checkout with missing track shows not-found/loading on canvas with muted text.
- Admin table with zero users shows empty state in muted copy.
- Payment status polling errors display in `text-error` without breaking card layout.
- Deactivate confirmation (if present) uses accessible button variants.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-301**: Artist dashboard MUST use `DesignSystemLayout` and shared UI primitives (`Button`, `Input`, `Card`).
- **FR-302**: `TrackUploadForm` MUST be restyled to design tokens; upload/publish behavior unchanged.
- **FR-303**: Artist profile page MUST use design-system form inputs and primary save action.
- **FR-304**: Checkout page MUST use design-system layout, inputs, and primary pay button.
- **FR-305**: `PaymentStatusPanel` MUST use design-system card surfaces and typography.
- **FR-306**: Admin users page and `UserTable` MUST use design-system table styling and controls.
- **FR-307**: `AdminRoute` loading state MUST use design-system layout (no legacy wrapper).
- **FR-308**: All routes MUST remove `LegacyLayout` usage after migration.
- **FR-309**: Global `index.css` body MUST default to canvas/ink once all pages migrated.
- **FR-310**: No functional regression in artist upload, profile save, checkout/deposit, or admin deactivate flows.

### Key Entities

- **Reused UI model**: Tokens and components from `003-client-design-system` (`DesignSystemLayout`, `Button`, `Input`, `Card`).
- **In-scope routes**: `/artist/dashboard`, `/artist/profile`, `/checkout/:trackId`, `/admin/users`.
- **In-scope shared components**: `TrackUploadForm`, `PaymentStatusPanel`, `UserTable`, `AdminRoute` loading shell.
- **Out of scope**: New API endpoints, payment logic changes, new admin features, Storybook, dark mode.

## Success Criteria *(mandatory)*

- **SC-301**: Reviewer walking all primary routes reports zero pages using legacy indigo/cream/terracotta styling.
- **SC-302**: `LegacyLayout` component deleted; no imports remain in `client/src/`.
- **SC-303**: `yarn workspace @ngoma/client build` and `lint` pass after migration.
- **SC-304**: VS-301–VS-306 quickstart scenarios pass (see quickstart.md).
- **SC-305**: Existing flows (upload, profile save, checkout, admin deactivate) complete without new user-visible errors.

## Assumptions

- `003-client-design-system` primitives are stable and reused — no new token definitions unless a gap is found (e.g., table-specific utilities).
- `PurchaseHistoryPage` was migrated early; used as reference implementation for list/card patterns.
- Legacy Tailwind color keys (`cream`, `indigo`, `terracotta`) may be removed from `tailwind.config.cjs` after grep confirms zero usage.
- Client-only feature; no database or API changes.

## Out of Scope

- Phase 2 product features (analytics, PWYW pricing, recommendations) from `PROJECT REQUIREMENTS.md` §11.2.
- New admin capabilities beyond existing list/filter/deactivate.
- Payment provider or webhook changes.
- Global app shell / persistent nav header (future feature).
