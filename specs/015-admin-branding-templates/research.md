# Research: 015-admin-branding-templates

**Date**: 2026-07-19

## R1: Logo resize approach

**Decision**: Store **display width** (px, 48–320) in branding config; height `auto` to preserve aspect ratio. Optional max-height cap via CSS `max-h-16`.

**Rationale**: No image processing library needed; admin adjusts size instantly in preview slider.

**Alternatives considered**:
- Server-side sharp resize — rejected; over-engineering for MVP
- Canvas crop UI — rejected; out of scope per spec

---

## R2: Logo upload pipeline

**Decision**: `POST /api/v1/admin/settings/branding/logo` multipart → `MediaService.saveImage()` → store URL in `branding.logoUrl`. Separate `PUT` for size/remove without re-upload.

**Rationale**: Identical pattern to track cover uploads; S3/local already works.

**Alternatives considered**:
- Base64 in JSONB — rejected; bloats DB, bypasses media module

---

## R3: Animated background technology

**Decision**: **CSS-only preset catalog** (~4 presets): `gradient-drift`, `aurora`, `mesh-pulse`, `starfield`. Implemented as a fixed class map in `AnimatedBackground.tsx` + shared keyframes in CSS file.

**Rationale**: Performant, no assets to host, works offline, respects reduced-motion via media query.

**Alternatives considered**:
- MP4/WebM video backgrounds — rejected; bandwidth, autoplay policies
- Three.js particles — rejected; bundle size, maintenance
- Lottie — rejected; new dependency

---

## R4: Static background image

**Decision**: Upload via `MediaService` to `images/backgrounds/` folder; apply as `fixed inset-0 bg-cover bg-center` layer behind content with rgba overlay from `overlayOpacity`.

**Rationale**: Full-bleed festival poster backgrounds match user request.

**Alternatives considered**:
- CSS `url()` to external CDN only — rejected; want admin upload

---

## R5: Branding template composition

**Decision**: Template snapshot includes:
- `themePresetId` (optional — applies via existing `PlatformService.applyPreset`)
- `branding` object (logo, background, layoutTemplateId)
- `name`, `id`, `createdAt`

**Starter templates** (code-defined in `branding-templates.ts`):
1. **Spotify Default** — no logo, no background, default layout
2. **Ngoma Terracotta Hero** — terracotta preset + hero layout + gradient-drift
3. **Festival Night** — violet preset + aurora + hero layout
4. **Minimal Clean** — ocean preset + no background + minimal layout
5. **Warm Poster** — amber preset + static warm gradient animated preset

**Saved templates**: JSONB array on `platform_settings`, max 10 entries, admin CRUD.

**Rationale**: Bundles match user "reuse templates" intent; starters ship value day one.

**Alternatives considered**:
- DB table per template — rejected; singleton platform, JSONB sufficient

---

## R6: UI layout templates

**Decision**: Code-defined `layoutTemplateId` enum applied in `AppShell`:

| ID | Description |
|----|-------------|
| `default` | Current top nav bar |
| `minimal` | Shorter header, smaller nav text |
| `hero` | Taller header band (96px), larger logo area |

**Rationale**: Structural JSX variants, not runtime CSS hacks; 3 templates sufficient for MVP.

**Alternatives considered**:
- Sidebar layout — deferred; major nav restructure
- Fully custom HTML — rejected; security/maintenance

---

## R7: Public vs admin API split

**Decision**:
- Public: `GET /api/v1/platform/branding` — logo, background, layout (no saved templates list)
- Admin: `GET/PUT /api/v1/admin/settings/branding`, logo/background upload, template CRUD

**Rationale**: Mirrors theme public/admin split from 012.

---

## R8: Provider architecture

**Decision**: New `BrandingProvider` wraps app beside `ThemeProvider`; fetches `/platform/branding`, renders `AnimatedBackground` + passes config to `AppShell` via context.

**Rationale**: Separation of concerns; theme tokens stay in ThemeProvider.

**Alternatives considered**:
- Merge into ThemeProvider — rejected; bloated single provider

---

## R9: Admin page structure

**Decision**: New `/admin/branding` page with sections/tabs: **Logo** | **Background** | **Layout** | **Templates**. Link from Dashboard and Admin Users alongside Theme.

**Rationale**: Theme page stays focused on colour swatches; branding is richer media UX.

---

## R10: Reduced motion

**Decision**: `@media (prefers-reduced-motion: reduce)` disables animation classes; show static first frame (gradient snapshot).

**Rationale**: Accessibility requirement (FR-1513).
