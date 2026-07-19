# Feature Specification: Admin Theme Swatches & Preset Patterns

**Feature Branch**: `012-admin-theme-swatches`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "I need swatches or patterns not what I have now" — replace per-token color pickers on `/admin/theme` with curated theme presets (visual swatches) admins can select and apply platform-wide.

**Depends on**: Platform theme customization (implemented: `platform_settings`, `ThemeProvider`, `/admin/theme`, `GET /api/v1/platform/theme`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Theme from Swatch Grid (Priority: P1)

An admin opens Theme settings and sees a grid of named preset palettes (e.g. Spotify Green, Ngoma Terracotta, Ocean, Violet). Each swatch shows a mini colour preview. Clicking a swatch previews the theme live; saving applies it for all users.

**Why this priority**: Core pain point — current UI exposes 19 individual token pickers; admins want one-click brand selection aligned with `PROJECT REQUIREMENTS.md` §5.3.3 (single primary colour / branding block).

**Independent Test**: VS-1201 — Admin selects "Ngoma Terracotta" swatch → saves → Discover page shows terracotta primary buttons.

**Acceptance Scenarios**:

1. **Given** admin on `/admin/theme`, **When** page loads, **Then** a swatch grid of ≥6 presets is shown with name and colour preview chips — not a wall of individual token inputs as the primary UI.
2. **Given** admin clicks a swatch, **When** not yet saved, **Then** app preview updates immediately (live preview).
3. **Given** admin clicks Save, **When** request succeeds, **Then** `theme_preset_id` persisted and all visitors receive the new palette on next load.

---

### User Story 2 - Active Preset Indicator (Priority: P1)

Admin sees which preset is currently active and can reset to the default Spotify palette.

**Why this priority**: Prevents confusion about current production theme.

**Independent Test**: VS-1202 — After applying preset, reload admin page → same swatch shows selected state.

**Acceptance Scenarios**:

1. **Given** a preset is active, **When** admin opens theme page, **Then** that swatch has visible selected/active styling.
2. **Given** admin clicks "Reset to default", **When** confirmed, **Then** Spotify default preset restored and overrides cleared.

---

### User Story 3 - Optional Advanced Customisation (Priority: P2)

Power users can expand an "Advanced" section to tweak individual tokens after choosing a base swatch, producing a custom variant.

**Why this priority**: Keeps escape hatch without cluttering default UX.

**Independent Test**: VS-1203 — Select Ocean preset → tweak primary in Advanced → save → custom overrides merged on top of preset base.

**Acceptance Scenarios**:

1. **Given** admin expanded Advanced, **When** they change one token, **Then** preset shows as "Custom" or base preset + overrides indicator.
2. **Given** admin picks a new swatch, **When** they confirm (or auto-clear), **Then** prior token overrides replaced by preset base unless explicitly merged.

---

### User Story 4 - Public Theme Resolution (Priority: P1)

All users receive the active preset theme via existing `ThemeProvider` without code changes on consumer pages.

**Why this priority**: Must not break 012's dependency on platform theme API.

**Independent Test**: VS-1204 — `GET /api/v1/platform/theme` returns resolved tokens + `activePresetId`.

**Acceptance Scenarios**:

1. **Given** preset "terracotta" active, **When** unauthenticated client fetches platform theme, **Then** response includes full resolved token map and `activePresetId: "terracotta"`.
2. **Given** no preset stored (legacy row), **When** theme fetched, **Then** defaults to `spotify` preset tokens.

---

## Functional Requirements

- **FR-1201**: System MUST ship ≥6 curated dark-theme presets as code-defined swatches (id, name, description, preview colours, full token map).
- **FR-1202**: Admin theme page MUST present presets as a visual swatch grid as the primary interaction — not per-token pickers alone.
- **FR-1203**: Selecting a swatch MUST live-preview theme via existing CSS variable application.
- **FR-1204**: Saving MUST persist `theme_preset_id` on `platform_settings` and resolve full token map server-side.
- **FR-1205**: Reset MUST restore default preset (`spotify`) and clear token overrides.
- **FR-1206**: Advanced token editor MAY remain in collapsible section for P2.
- **FR-1207**: Public `GET /api/v1/platform/theme` MUST include `activePresetId` and `presets` catalog (id, name, preview colours only — not full maps on public endpoint optional; full list on admin endpoint).
- **FR-1208**: Preset "Ngoma Terracotta" MUST use primary `#C0672E` per product requirements branding mockup.

## Non-Functional Requirements

- **NFR-1201**: Preset switch applies without page reload for admin preview; public users on next navigation/query refetch.
- **NFR-1202**: No new npm dependencies required for swatch UI (use existing shadcn Card/Button).

## Success Criteria

- **SC-1201**: Admin can change platform brand colour in ≤3 clicks (open theme → pick swatch → save).
- **SC-1202**: Zero regression — existing `ThemeProvider` and shadcn semantic classes continue to work.
- **SC-1203**: Per-token color inputs are not the default/primary view on `/admin/theme`.

## Out of Scope

- Light mode presets / theme toggle
- Logo/favicon upload (separate branding slice)
- User-per-user theme preferences
- CSS gradient/pattern backgrounds on surfaces (future "pattern" textures)
- Admin-editable preset catalog in DB

## Assumptions

- Dark-only platform (per spec 009)
- Presets defined in version-controlled TypeScript, not admin-created
- Existing `platform_settings.theme` JSONB retained for advanced overrides
