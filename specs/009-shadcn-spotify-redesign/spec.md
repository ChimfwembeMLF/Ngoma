# Feature Specification: shadcn/ui + Spotify Dark Redesign

**Feature Branch**: `009-shadcn-spotify-redesign`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Update the UI with new design requirements and add shadcn for all inputs, components etc."

**Depends on**: `001-platform-mvp` through `008-user-playlists` (all client pages and flows exist; this is a presentation-layer migration)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - shadcn/ui Foundation (Priority: P1)

A developer bootstraps shadcn/ui in the Ngoma client with Tailwind CSS variables, Radix primitives, and a standard `components/ui/` catalog so all forms and controls use accessible, composable components instead of bespoke one-offs.

**Why this priority**: Constitution mandates shadcn/ui + Radix; current client uses custom `Button`, `Input`, and `Card` without shadcn. Foundation must land before page migrations.

**Independent Test**: `components.json` exists; core shadcn components (`button`, `input`, `label`, `card`, `select`, `checkbox`, `textarea`, `badge`, `separator`) render in Storybook-free smoke test or a dev-only `/design-preview` route; `yarn workspace @ngoma/client build` passes.

**Acceptance Scenarios**:

1. **Given** the client workspace, **When** shadcn is initialized, **Then** `client/components.json`, updated `tailwind.config.cjs`, and CSS variables in `index.css` align with shadcn conventions.
2. **Given** a form page, **When** it uses shadcn `Input`, `Label`, and `Button`, **Then** focus rings, disabled states, and error styling work via Radix + Tailwind.
3. **Given** existing `@/*` path alias, **When** components import `@/components/ui/button`, **Then** TypeScript resolves without path errors.

---

### User Story 2 - Spotify Dark Theme Tokens (Priority: P1)

The entire app adopts the Spotify-inspired dark design system documented in `client/DESIGN.md`: near-black backgrounds (`#121212`–`#1f1f1f`), white/silver text hierarchy, Spotify Green (`#1ed760`) for functional accents only, pill buttons, and heavy elevation shadows.

**Why this priority**: `DESIGN.md` was updated from the light Airbnb tokens used in 003/004; visual identity must match the new reference before page-by-page polish.

**Independent Test**: Open any migrated page; background is `#121212`, cards are `#181818`/`#1f1f1f`, primary CTA/play uses green; no white canvas or `#ff385c` pink accent remains on migrated routes.

**Acceptance Scenarios**:

1. **Given** `tailwind.config.cjs`, **When** tokens are applied, **Then** semantic classes map to Spotify palette (background, surface, accent, muted, destructive, etc.).
2. **Given** shadcn CSS variables, **When** `dark` class is set on root, **Then** shadcn components inherit Spotify colors without per-component hex overrides.
3. **Given** typography rules in DESIGN.md, **When** headings and buttons render, **Then** compact 10–24px scale and uppercase pill button letter-spacing apply.

---

### User Story 3 - Core Listener Pages (Priority: P1)

Discover, Track detail, and Auth use shadcn components and Spotify dark styling end-to-end — search pill, track cards, player chrome, auth form, and navigation.

**Why this priority**: Discover is default landing; Track is conversion; Auth is trust gateway.

**Independent Test**: VS-901–VS-903 — browse Discover, open track, sign in/register; all match DESIGN.md dark immersive feel.

**Acceptance Scenarios**:

1. **Given** unauthenticated user on `/discover`, **When** page loads, **Then** dark grid layout, pill search, and track cards use shadcn + Spotify tokens.
2. **Given** track detail, **When** user views metadata and actions, **Then** pill/outline buttons, green primary CTA, and player sit on dark surfaces.
3. **Given** auth page, **When** user toggles login/register, **Then** shadcn form controls with inset input borders and error states render correctly.

---

### User Story 4 - Signed-In Library & Hub Pages (Priority: P2)

Dashboard, Playlists, Playlist detail, and Purchase history adopt the new shell layout (optional sidebar + bottom player bar pattern) and shadcn components consistently.

**Why this priority**: Post-auth journeys must not feel like a different product from Discover.

**Independent Test**: VS-904 — sign in, visit `/dashboard`, `/playlists`, `/playlists/:id`, `/purchases`; dark theme and shadcn controls throughout.

**Acceptance Scenarios**:

1. **Given** authenticated listener, **When** they open Dashboard, **Then** profile card and links use shadcn `Card` and `Button` variants on dark background.
2. **Given** playlists pages, **When** user creates or views playlists, **Then** forms use shadcn `Input`/`Checkbox`; lists use `Badge` for public/private.
3. **Given** purchase history, **When** listed, **Then** table or card rows use shadcn typography tokens — no legacy light-theme classes.

---

### User Story 5 - Artist, Checkout, Admin Flows (Priority: P2)

Artist dashboard/profile, checkout, tip artist, and admin user management migrate to shadcn + Spotify dark theme without breaking uploads, payments, or moderation.

**Why this priority**: Revenue and creator workflows must retain trust styling under the new dark brand.

**Independent Test**: VS-905 — artist upload, checkout deposit, tip flow, admin table — functional with new UI.

**Acceptance Scenarios**:

1. **Given** artist dashboard, **When** upload form renders, **Then** file inputs, selects, and submit use shadcn; analytics cards use dark elevated surfaces.
2. **Given** checkout, **When** user pays, **Then** `PaymentStatusPanel` uses shadcn `Alert`/`Card`; primary pay button is green pill.
3. **Given** admin users page, **When** table loads, **Then** shadcn `Table` or equivalent with dark row hover and outline filter controls.

---

### User Story 6 - Shared Components & Layout Shell (Priority: P2)

Replace `DesignSystemLayout` with a Spotify-style app shell: dark sidebar or top nav, persistent bottom player area hook point, and migrate `AudioPlayer`, `TrackCard`, `SearchPill`, and analytics subcomponents to shadcn primitives.

**Why this priority**: Shared components prevent drift across 15+ page files.

**Independent Test**: VS-906 — player and track cards look consistent on Discover and Track; layout shell wraps all routes.

**Acceptance Scenarios**:

1. **Given** any in-app route, **When** rendered, **Then** `AppShell` (or renamed layout) applies `#121212` background and consistent max-width content area.
2. **Given** `TrackCard`, **When** displayed in grid, **Then** 6–8px radius, dark hover lift shadow, green play affordance optional.
3. **Given** legacy custom `Button.tsx`/`Input.tsx`/`Card.tsx`, **When** migration completes, **Then** they are removed or re-export shadcn wrappers with zero remaining direct imports of old implementations.

---

### Edge Cases

- shadcn dark mode is default; no light-mode toggle required in MVP (DESIGN.md is dark-only).
- Spotify proprietary fonts unavailable — use Circular/system stack from DESIGN.md fallbacks.
- Mobile: sidebar collapses; bottom player bar maintained per DESIGN.md responsive table.
- Focus/accessibility: Radix focus traps on dialogs; WCAG contrast for `#b3b3b3` on `#121212` verified for body text.
- No API or routing changes — purely client presentation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-901**: Client MUST initialize shadcn/ui with `components.json`, Radix dependencies, and `tailwindcss-animate`.
- **FR-902**: Tailwind theme MUST map `client/DESIGN.md` Spotify palette to semantic CSS variables consumed by shadcn.
- **FR-903**: All form inputs across client pages MUST use shadcn `Input`, `Textarea`, `Select`, `Checkbox`, or `Label` — not legacy custom `Input.tsx`.
- **FR-904**: All buttons MUST use shadcn `Button` with variants mapped to Spotify pill styles (default, outline, ghost, destructive).
- **FR-905**: All card surfaces MUST use shadcn `Card` (or composition) on `#181818`/`#1f1f1f` backgrounds.
- **FR-906**: App shell MUST apply dark theme globally via `class="dark"` on `html` or root provider.
- **FR-907**: Legacy light tokens (`canvas`, `ink`, `primary` #ff385c) MUST be removed or remapped — no pink accent on migrated pages.
- **FR-908**: React Hook Form + Zod forms MUST integrate via `@hookform/resolvers` and shadcn `Form` pattern where forms exist.
- **FR-909**: `yarn workspace @ngoma/client lint` and `build` MUST pass after migration.
- **FR-910**: No backend, database, or API contract changes.

### Key Entities

- **Design Token Set**: Spotify semantic colors, typography scale, radius, shadows (UI-only, not DB)
- **shadcn Component Catalog**: button, input, label, card, select, checkbox, textarea, badge, separator, table, alert, form, dropdown-menu (as needed)

## Success Criteria *(mandatory)*

- **SC-901**: shadcn/ui bootstrapped; minimum 10 core components installed under `client/src/components/ui/`.
- **SC-902**: All client routes use Spotify dark theme — zero `#ffffff` page backgrounds on user-facing pages.
- **SC-903**: VS-901–VS-906 quickstart scenarios pass.
- **SC-904**: Legacy custom `Button`, `Input`, `Card` deleted or thin re-exports only; grep shows no `bg-canvas` / `text-ink` / `bg-primary` (#ff385c) on pages.
- **SC-905**: Discover, checkout, and playlist flows unchanged functionally (regression).

## Assumptions

- shadcn CLI run manually or documented in tasks; Vite + React 18 + Tailwind 3 compatible.
- Default theme is dark-only; light mode deferred.
- `DESIGN.md` is source of truth for Spotify visual spec.
- Page behavior, hooks, and API calls unchanged — markup and styling only.

## Out of Scope

- Backend/API changes
- New features (playlists logic, payments, etc.)
- Spotify font licensing / custom font files
- Full sidebar + now-playing bar playback queue (layout hook only; queue logic deferred)
- Storybook or visual regression CI
- Light mode / theme toggle
