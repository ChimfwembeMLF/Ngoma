# Implementation Plan: Admin Theme Swatches & Preset Patterns

**Branch**: `012-admin-theme-swatches` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-admin-theme-swatches/spec.md`

## Summary

Replace the **per-token color picker wall** on `/admin/theme` with a **visual swatch grid** of curated dark-theme presets (Spotify, Ngoma Terracotta, Ocean, etc.). Extend **`platform_settings`** with `theme_preset_id`, add a **code-defined preset catalog** in `api/src/common/theme-presets.ts`, resolve presets server-side in **`PlatformService`**, and rebuild **`ThemeEditor`** as swatch-first with optional Advanced collapsible. No breaking changes to `ThemeProvider` — it still applies resolved CSS variables from `GET /api/v1/platform/theme`.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM (extend `PlatformSettings` entity), existing `PlatformModule` + admin theme routes
- Client: React 18, Vite, TanStack Query, shadcn/ui, existing `ThemeProvider` + `applyTheme`

**Storage**: PostgreSQL 15+ — migration adds `theme_preset_id VARCHAR(50)` to `platform_settings`

**Testing**: Manual VS-1201–VS-1204 per `quickstart.md`

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — extend `api/src/modules/platform/` + `client/src/components/admin/`

**Performance Goals**: Preset catalog is static (~6 items); no extra DB queries beyond existing settings row

**Constraints**:
- Extend existing platform theme feature — no new module
- Presets in code (not DB-editable)
- Dark-only; semantic CSS variable keys unchanged
- Swatch grid is primary UI; token pickers demoted to Advanced section

**Scale/Scope**: 1 migration, preset catalog file (api + client share or duplicate), ThemeEditor rewrite, API response extensions

**Reference**: `PROJECT REQUIREMENTS.md` §5.3.3; `client/DESIGN.md`; `specs/009-shadcn-spotify-redesign/contracts/design-tokens.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature extends `api/src/modules/platform/` + `admin/` + `client/src/`
- [x] Schema change via TypeORM migration in `api/database/migrations/`
- [x] Endpoints extend existing `/api/v1/platform/theme` and `/api/v1/admin/settings/theme`
- [x] Client uses TanStack Query + shadcn; no new state library
- [x] No payment/webhook changes

**Post-design re-check**: PASS — extends platform module; constitution satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/012-admin-theme-swatches/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── theme-presets-api.md
│   └── theme-swatches-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
├── database/migrations/
│   └── 1719000000011-PlatformThemePreset.ts
├── src/
│   ├── common/
│   │   ├── theme.defaults.ts          # unchanged keys
│   │   └── theme-presets.ts           # NEW preset catalog + resolvePreset()
│   └── modules/platform/
│       ├── entities/platform-settings.entity.ts  # + themePresetId
│       ├── platform.service.ts        # preset resolution, applyPreset()
│       └── dto/update-theme.dto.ts    # + presetId field

client/
├── src/
│   ├── lib/
│   │   ├── theme-presets.ts           # mirror preset metadata + preview chips
│   │   └── theme-defaults.ts          # unchanged
│   ├── components/admin/
│   │   ├── ThemeEditor.tsx            # REWRITE: swatch grid primary
│   │   └── ThemeSwatchGrid.tsx        # NEW
│   ├── hooks/useAdminTheme.ts         # + applyPreset mutation
│   └── pages/AdminThemePage.tsx       # wire swatch UX
```

**Structure Decision**: Preset catalog lives in `api/src/common/theme-presets.ts` (source of truth); client mirrors preset id/name/preview for UI only — full token maps resolved via API to avoid drift.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/theme-presets-api.md](./contracts/theme-presets-api.md)
- [contracts/theme-swatches-ui.md](./contracts/theme-swatches-ui.md)
- [quickstart.md](./quickstart.md)
