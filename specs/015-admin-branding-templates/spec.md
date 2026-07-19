# Feature Specification: Admin Branding, Backgrounds & Templates

**Feature Branch**: `015-admin-branding-templates`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "I want to be able to add, resize or edit a logo. I also want to be able to add full background animated background. Add templates that I can reuse. Can we also have some UI templates."

**Depends on**: `012-admin-theme-swatches` (`platform_settings`, `ThemeProvider`, `/admin/theme`, `MediaService` uploads)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Logo Upload, Resize & Edit (Priority: P1)

An admin uploads a platform logo (PNG/SVG/WebP), adjusts its display size, and replaces or removes it. All users see the logo in the app header instead of the text "Ngoma" when configured.

**Why this priority**: Core branding request; header is visible on every page.

**Independent Test**: VS-1501 — Upload logo → header shows image at configured width; resize slider updates preview; remove restores wordmark.

**Acceptance Scenarios**:

1. **Given** admin on branding settings, **When** they upload a valid image, **Then** logo appears in live preview and persists after save.
2. **Given** a saved logo, **When** admin adjusts width (e.g. 80–240px), **Then** preview and public header reflect new size without re-uploading the file.
3. **Given** a saved logo, **When** admin clicks Remove logo, **Then** platform reverts to default text wordmark.
4. **Given** invalid file (>5 MB or wrong type), **When** upload attempted, **Then** friendly validation error shown.

---

### User Story 2 — Full-Page Background & Animated Backgrounds (Priority: P1)

An admin sets a full-viewport page background: none (theme default), static uploaded image, or a curated **CSS animated** background (gradient drift, aurora, subtle mesh). Content remains readable via optional dark overlay.

**Why this priority**: User explicitly requested full and animated backgrounds.

**Independent Test**: VS-1502 — Select animated preset → all pages show motion background behind shell; static image works; overlay keeps text legible.

**Acceptance Scenarios**:

1. **Given** admin selects animated preset "Aurora drift", **When** saved, **Then** all public pages render CSS animation behind `AppShell` without layout shift.
2. **Given** admin uploads background image, **When** saved, **Then** image covers viewport (`background-size: cover`) with configurable overlay opacity.
3. **Given** admin sets background to None, **When** saved, **Then** only theme `bg-background` applies (current behaviour).
4. **Given** `prefers-reduced-motion`, **When** animated background active, **Then** animation is disabled or replaced with static frame.

---

### User Story 3 — Reusable Branding Templates (Priority: P1)

An admin applies a **starter branding template** (bundles theme preset + logo slot + background + layout) or **saves the current configuration** as a named template to reuse later.

**Why this priority**: User asked for reusable templates; reduces repetitive admin work.

**Independent Test**: VS-1503 — Apply "Festival Night" starter → theme, background, and layout update together; Save custom template → appears in My templates list → re-apply restores settings.

**Acceptance Scenarios**:

1. **Given** starter template grid, **When** admin applies "Ngoma Terracotta Hero", **Then** theme preset, background, and UI layout update atomically.
2. **Given** current branding configured, **When** admin saves as "Summer Launch", **Then** template appears in saved list (max 10).
3. **Given** saved template, **When** admin applies it, **Then** all branding fields match saved snapshot.
4. **Given** admin deletes saved template, **When** confirmed, **Then** it is removed without affecting active branding until another template is applied.

---

### User Story 4 — UI Layout Templates (Priority: P2)

An admin picks a **UI layout template** that changes shell structure: Default (current top nav), Minimal (compact header), Hero (taller branded header band). Works alongside theme and background.

**Why this priority**: User asked for UI templates; extends branding beyond colours.

**Independent Test**: VS-1504 — Switch to Minimal layout → header height and nav density change on Discover and Dashboard.

**Acceptance Scenarios**:

1. **Given** layout template picker, **When** admin selects "Minimal", **Then** `AppShell` uses compact header variant platform-wide.
2. **Given** layout template "Hero", **When** applied, **Then** header shows larger logo area suitable for festival/event branding.
3. **Given** any layout, **When** on mobile, **Then** navigation remains usable (responsive).

---

### User Story 5 — Public Branding Delivery (Priority: P2)

All visitors receive active logo, background, and layout via a public config endpoint and client providers — no admin auth required to **read** settings.

**Why this priority**: End-user visibility of admin choices; mirrors existing `ThemeProvider` pattern.

**Independent Test**: VS-1505 — `GET /api/v1/platform/branding` returns logo URL, sizes, background, layoutId; incognito user sees configured branding.

**Acceptance Scenarios**:

1. **Given** branding saved, **When** unauthenticated user loads `/discover`, **Then** logo and background match admin configuration.
2. **Given** branding API cached, **When** admin saves changes, **Then** clients invalidate cache and refresh within one query cycle.

---

## Functional Requirements

- **FR-1501**: Admin MUST upload/replace/remove platform logo via authenticated endpoint using existing `MediaService`.
- **FR-1502**: Logo display size MUST be configurable (width 48–320px) without re-uploading image bytes.
- **FR-1503**: Admin MUST configure full-page background: `none`, `image`, or `animated` (CSS preset id).
- **FR-1504**: Animated backgrounds MUST be CSS-only presets (no video/WebGL in MVP).
- **FR-1505**: Background MUST support overlay opacity (0–80%) for text legibility.
- **FR-1506**: System MUST provide ≥4 starter branding templates combining theme + background + layout.
- **FR-1507**: Admin MUST save up to 10 custom branding templates with name + full snapshot.
- **FR-1508**: Admin MUST apply/delete saved templates.
- **FR-1509**: System MUST provide ≥3 UI layout templates applied via `layoutTemplateId`.
- **FR-1510**: Branding settings MUST persist on `platform_settings` (JSONB migration).
- **FR-1511**: Public `GET /api/v1/platform/branding` MUST expose non-secret branding config.
- **FR-1512**: Admin branding routes MUST require `ADMIN` role under `/api/v1/admin/settings/branding`.
- **FR-1513**: Animated backgrounds MUST respect `prefers-reduced-motion`.

## Non-Functional Requirements

- **NFR-1501**: Logo/background uploads reuse S3/local `MediaService` — no new storage stack.
- **NFR-1502**: Background animations MUST not block main thread (CSS only); target 60fps on mid-range mobile.
- **NFR-1503**: Branding page loads in <2s on admin connection (excluding large uploads).

## Success Criteria

- **SC-1501**: Admin can configure logo, background, and apply a template in under 5 minutes without developer help.
- **SC-1502**: Zero regression to existing theme swatch flow on `/admin/theme`.
- **SC-1503**: All pages using `AppShell` reflect logo, background, and layout template.
- **SC-1504**: Saved templates round-trip correctly (save → apply → identical public config).

## Out of Scope

- Per-user or per-artist branding (platform-wide only)
- Server-side image cropping/resizing (display-size via CSS config only)
- Video or Lottie animated backgrounds
- Drag-and-drop logo positioning beyond header slot (MVP: centered in header)
- Custom CSS injection by admin
- Multi-logo variants (favicon auto-generation) — future

## Assumptions

- Branding extends existing `platform` module and `platform_settings` singleton row
- `/admin/branding` is a new admin page; theme swatches remain on `/admin/theme` but templates may include theme preset
- Starter templates are code-defined; saved templates stored in DB JSONB array
