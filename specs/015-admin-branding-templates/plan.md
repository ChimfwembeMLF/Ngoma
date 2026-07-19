# Implementation Plan: Admin Branding, Backgrounds & Templates

**Branch**: `015-admin-branding-templates` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-admin-branding-templates/spec.md`

## Summary

Extend **platform branding** beyond colour swatches: admin can **upload/resize a logo**, set **full-page static or CSS-animated backgrounds**, pick **UI layout templates** for `AppShell`, and **apply or save reusable branding templates** (starter + custom snapshots). Persist on `platform_settings.branding` JSONB + `saved_branding_templates` JSONB; deliver publicly via `GET /api/v1/platform/branding` and `BrandingProvider` on the client. Reuse `MediaService` for logo/background image uploads.

## Technical Context

**Language/Version**: TypeScript, Node 20+, React 18, Vite

**Primary Dependencies**: NestJS platform/admin modules, TypeORM, MediaService/S3, TanStack Query, shadcn/ui, existing ThemeProvider

**Storage**: PostgreSQL — migration adds `branding JSONB`, `saved_branding_templates JSONB` to `platform_settings`

**Testing**: Manual VS-1501–VS-1505 per quickstart.md

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — extend `api/src/modules/platform/`, `api/src/modules/admin/`, `client/src/`

**Constraints**:
- CSS-only animated backgrounds (no video/WebGL)
- Logo resize = display dimensions in config, not image processing
- Max 10 saved custom templates
- Respect `prefers-reduced-motion`

**Scale/Scope**: 1 migration, ~8 API endpoints, 1 admin page, 3–4 client components, AppShell refactor

**Reference**: `012-admin-theme-swatches`, `PROJECT REQUIREMENTS.md` §2 Brand Identity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Extends `api/src/modules/platform/` — no alternate backend root
- [x] TypeORM migration for schema change
- [x] Admin routes: `/api/v1/admin/...`, JwtAuthGuard + ADMIN role, Swagger
- [x] Public read: `/api/v1/platform/branding`
- [x] Client: TanStack Query hooks, pages in `client/src/pages/`
- [x] Reuses MediaService — no new storage dependency

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/015-admin-branding-templates/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── branding-api.md
│   ├── branding-templates-ui.md
│   └── animated-backgrounds-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
api/
├── database/migrations/1719000000012-PlatformBranding.ts
├── src/common/
│   ├── branding.defaults.ts          # defaults + validation
│   ├── branding-templates.ts         # starter template catalog
│   └── layout-templates.ts           # UI layout metadata
├── src/modules/platform/
│   ├── entities/platform-settings.entity.ts
│   ├── dto/update-branding.dto.ts
│   ├── dto/save-branding-template.dto.ts
│   ├── platform.service.ts           # + getBranding, updateBranding, templates
│   └── platform.controller.ts        # + GET branding
└── src/modules/admin/
    └── admin.controller.ts           # + branding admin routes + logo upload

client/src/
├── providers/BrandingProvider.tsx
├── lib/branding-defaults.ts
├── lib/animated-backgrounds.css      # CSS preset keyframes
├── hooks/useAdminBranding.ts
├── hooks/usePlatformBranding.ts
├── components/admin/
│   ├── LogoEditor.tsx
│   ├── BackgroundEditor.tsx
│   ├── BrandingTemplateGrid.tsx
│   └── LayoutTemplatePicker.tsx
├── components/layout/
│   ├── AppShell.tsx                  # layout variants + logo + background
│   └── AnimatedBackground.tsx
└── pages/AdminBrandingPage.tsx
```

**Structure Decision**: Extend platform module (not new module) — branding is sibling to theme on same singleton settings row.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/branding-api.md](./contracts/branding-api.md)
- [contracts/branding-templates-ui.md](./contracts/branding-templates-ui.md)
- [contracts/animated-backgrounds-ui.md](./contracts/animated-backgrounds-ui.md)
- [quickstart.md](./quickstart.md)
