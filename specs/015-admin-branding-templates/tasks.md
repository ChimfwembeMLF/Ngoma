# Tasks: Admin Branding, Backgrounds & Templates

**Input**: Design documents from `/specs/015-admin-branding-templates/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `012-admin-theme-swatches` (`platform_settings`, `ThemeProvider`, `/admin/theme`, `MediaService`)

**Tests**: Not requested in spec — manual VS-1501–VS-1505 only.

---

## Phase 1: Setup — Verify Platform Baseline

**Purpose**: Confirm extension points before branding work

- [X] T001 Verify existing files: `api/src/modules/platform/platform.service.ts`, `api/src/modules/admin/admin.controller.ts`, `api/src/modules/media/media.service.ts`, `client/src/providers/ThemeProvider.tsx`, `client/src/components/layout/AppShell.tsx`
- [X] T002 [P] Review contracts: `specs/015-admin-branding-templates/contracts/branding-api.md`, `contracts/branding-templates-ui.md`, `contracts/animated-backgrounds-ui.md`

---

## Phase 2: Foundational — Schema, Catalogs & Core Branding API

**Purpose**: Migration, entity, defaults, starter catalogs, and read/update branding endpoints — blocks all user stories

**Independent Test**: VS-1505 (partial) — `GET /api/v1/platform/branding` returns default config

- [X] T003 Create migration `api/database/migrations/1719000000012-PlatformBranding.ts` — add `branding JSONB DEFAULT '{}'`, `saved_branding_templates JSONB DEFAULT '[]'` to `platform_settings`
- [X] T004 Extend `PlatformSettings` entity in `api/src/modules/platform/entities/platform-settings.entity.ts` with `branding` and `savedBrandingTemplates` columns
- [X] T005 Create `api/src/common/branding.defaults.ts` — `DEFAULT_BRANDING`, `sanitizeBrandingInput()`, merge helpers, validation per data-model.md
- [X] T006 [P] Create `api/src/common/branding-templates.ts` — ≥5 starter templates (Spotify Default, Ngoma Terracotta Hero, Festival Night, Minimal Clean, Warm Poster) per research.md R5
- [X] T007 [P] Create `api/src/common/layout-templates.ts` — layout catalog (`default`, `minimal`, `hero`) + animated preset metadata (`gradient-drift`, `aurora`, `mesh-pulse`, `starfield`)
- [X] T008 [P] Create DTOs in `api/src/modules/platform/dto/update-branding.dto.ts`, `apply-branding-template.dto.ts`, `save-branding-template.dto.ts` with class-validator rules per `contracts/branding-api.md`
- [X] T009 Implement `getBranding()`, `getAdminBranding()`, `updateBranding()` in `api/src/modules/platform/platform.service.ts` — merge with defaults, return starter/saved/layout/animated catalogs on admin GET
- [X] T010 Add `GET /api/v1/platform/branding` in `api/src/modules/platform/platform.controller.ts`
- [X] T011 Add admin delegates `getBranding()`, `updateBranding()` in `api/src/modules/admin/admin.service.ts` and `GET`/`PUT settings/branding` routes in `api/src/modules/admin/admin.controller.ts`
- [X] T012 Import `MediaModule` into `api/src/modules/platform/platform.module.ts` and inject `MediaService` into `PlatformService` for upcoming upload tasks

**Checkpoint**: curl public branding returns defaults; admin PUT updates logoWidth/background/layout fields

---

## Phase 3: User Story 5 — Public Branding Delivery (Priority: P2)

**Goal**: All visitors receive branding via public API and client provider

**Independent Test**: VS-1505 — incognito `/discover` reflects saved branding after admin changes

- [X] T013 [P] [US5] Create `client/src/lib/branding-defaults.ts` — mirror API `BrandingConfig` types and defaults
- [X] T014 [P] [US5] Create `usePlatformBranding()` hook in `client/src/hooks/usePlatformBranding.ts` — query `GET /api/v1/platform/branding`
- [X] T015 [US5] Create `BrandingProvider` in `client/src/providers/BrandingProvider.tsx` — fetch branding, expose context, render children
- [X] T016 [US5] Wrap app with `BrandingProvider` in `client/src/App.tsx` (inside or beside `ThemeProvider`)

**Checkpoint**: Client fetches and exposes branding config app-wide

---

## Phase 4: User Story 1 — Logo Upload, Resize & Edit (Priority: P1) 🎯 MVP

**Goal**: Admin uploads logo, adjusts display width, removes logo; header shows image platform-wide

**Independent Test**: VS-1501 — Upload → resize → remove restores wordmark

- [X] T017 [US1] Implement `uploadLogo()` and `removeLogo()` in `api/src/modules/platform/platform.service.ts` using `MediaService.saveImage()` — persist `branding.logoUrl`
- [X] T018 [US1] Add `POST settings/branding/logo` (multipart `file`) and `DELETE settings/branding/logo` in `api/src/modules/admin/admin.controller.ts` with Swagger docs
- [X] T019 [P] [US1] Create `client/src/hooks/useAdminBranding.ts` — `useAdminBranding()`, `useUpdateBranding()`, `useUploadLogo()`, `useRemoveLogo()` with cache invalidation per contract
- [X] T020 [US1] Create `LogoEditor` in `client/src/components/admin/LogoEditor.tsx` — upload, width slider (48–320px), remove, preview per `contracts/branding-templates-ui.md`
- [X] T021 [US1] Update `client/src/components/layout/AppShell.tsx` — render logo image from branding context when `logoUrl` set; fallback "Ngoma" wordmark; apply `logoWidth` and `max-h-16`

**Checkpoint**: Logo visible in header on all AppShell pages (MVP deliverable with Phase 3)

---

## Phase 5: User Story 2 — Full-Page Background & Animated Backgrounds (Priority: P1)

**Goal**: Admin configures none, static image, or CSS animated full-viewport background with overlay

**Independent Test**: VS-1502 — Aurora preset animates behind shell; static image covers viewport; reduced-motion static

- [X] T022 [US2] Implement `uploadBackgroundImage()` in `api/src/modules/platform/platform.service.ts` — save to `images/` folder, set `background.type = 'image'`
- [X] T023 [US2] Add `POST settings/branding/background-image` multipart route in `api/src/modules/admin/admin.controller.ts`
- [X] T024 [P] [US2] Create `client/src/lib/animated-backgrounds.css` — keyframes for 4 presets + `@media (prefers-reduced-motion: reduce)` per `contracts/animated-backgrounds-ui.md`
- [X] T025 [US2] Create `AnimatedBackground` in `client/src/components/layout/AnimatedBackground.tsx` — image/animated/none modes, overlay opacity, `pointer-events-none`
- [X] T026 [US2] Create `BackgroundEditor` in `client/src/components/admin/BackgroundEditor.tsx` — type radio, image upload, animated preset grid, overlay slider
- [X] T027 [US2] Integrate `AnimatedBackground` in `BrandingProvider` or `AppShell` — fixed layer behind content; header `bg-background/80 backdrop-blur` when background active
- [X] T028 [US2] Import `animated-backgrounds.css` in `client/src/main.tsx`

**Checkpoint**: Full-page backgrounds render on Discover and Dashboard

---

## Phase 6: User Story 3 — Reusable Branding Templates (Priority: P1)

**Goal**: Apply starter templates; save/apply/delete custom templates (max 10)

**Independent Test**: VS-1503 — Apply starter updates theme + branding; save and re-apply custom template

- [X] T029 [US3] Implement `applyBrandingTemplate()`, `saveBrandingTemplate()`, `deleteSavedTemplate()` in `api/src/modules/platform/platform.service.ts` — atomic theme preset + branding update; max 10 saved; unique names
- [X] T030 [US3] Add admin routes `POST .../templates/apply`, `POST .../templates/save`, `DELETE .../templates/:id` in `api/src/modules/admin/admin.controller.ts`
- [X] T031 [P] [US3] Extend `useAdminBranding.ts` with `useApplyBrandingTemplate()`, `useSaveBrandingTemplate()`, `useDeleteBrandingTemplate()` — invalidate `platform/theme` on apply
- [X] T032 [US3] Create `BrandingTemplateGrid` in `client/src/components/admin/BrandingTemplateGrid.tsx` — starter cards + saved list + save dialog per `contracts/branding-templates-ui.md`

**Checkpoint**: One-click starter apply changes theme colours and background together

---

## Phase 7: User Story 4 — UI Layout Templates (Priority: P2)

**Goal**: Admin picks Default, Minimal, or Hero layout; AppShell adapts platform-wide

**Independent Test**: VS-1504 — Minimal compact header; Hero taller band with larger logo area

- [X] T033 [US4] Create `LayoutTemplatePicker` in `client/src/components/admin/LayoutTemplatePicker.tsx` — radio/card grid of 3 layouts from admin GET `layouts`
- [X] T034 [US4] Extend `AppShell` in `client/src/components/layout/AppShell.tsx` — apply `layoutTemplateId` variants (`default` py-4, `minimal` py-2 text-sm nav, `hero` py-8 max-h-24 logo) per `contracts/animated-backgrounds-ui.md`

**Checkpoint**: Layout switch visible on mobile and desktop without breaking nav

---

## Phase 8: Admin Page & Navigation Integration

**Purpose**: Compose admin UX and wire routes

- [X] T035 Create `AdminBrandingPage` in `client/src/pages/AdminBrandingPage.tsx` — sections Logo, Background, Layout, Templates; live preview panel; uses all admin editor components
- [X] T036 Add route `/admin/branding` with admin guard in `client/src/App.tsx`
- [X] T037 [P] Add "Branding" nav links in `client/src/pages/DashboardPage.tsx`, `client/src/pages/AdminUsersPage.tsx`, and `client/src/pages/AdminThemePage.tsx`

**Checkpoint**: Full admin branding workflow accessible from dashboard

---

## Phase 9: Polish & Cross-Cutting

- [X] T038 Run migration `1719000000012-PlatformBranding.ts` against dev database
- [X] T039 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T040 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T041 Validate VS-1501–VS-1505 from `specs/015-admin-branding-templates/quickstart.md` and document results in quickstart.md
- [X] T042 Regression-check `/admin/theme` swatch flow unchanged; non-admin gets 403 on branding admin routes

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (API foundation) → Phase 3 (US5 client provider) → Phase 4 (US1 logo)
- Phase 5 (US2 background) depends on Phase 3 provider + Phase 2 API
- Phase 6 (US3 templates) depends on Phase 2 service + Phase 4–5 editors (for meaningful save snapshots)
- Phase 7 (US4 layout) can run parallel with Phase 6 after Phase 3
- Phase 8 after US1–US4 components exist
- Phase 9 last

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contract review |
| Catalogs | T006, T007, T008 | Starters, layouts, DTOs while defaults written |
| US5 client | T013, T014 | Types + hook parallel |
| US1 client | T019, T020 | Hook + LogoEditor while API upload done |
| US2 CSS | T024, T028 | Styles independent of BackgroundEditor |
| US3 hook | T031 | Template mutations parallel to grid UI |
| Nav links | T037 | Three page link updates in parallel |
| Polish | T039, T040 | API and client lint/build in parallel |

### Suggested MVP scope

Phases 1–4 — **21 tasks** (T001–T021): Schema + public branding + logo upload/display

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational API | 10 | — |
| US5 Public delivery | 4 | P2 |
| US1 Logo | 5 | P1 |
| US2 Background | 7 | P1 |
| US3 Templates | 4 | P1 |
| US4 Layout | 2 | P2 |
| Admin integration | 3 | — |
| Polish | 5 | — |
| **Total** | **42** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1501 | Logo upload, resize, remove |
| US2 | VS-1502 | Static + animated backgrounds, overlay, reduced-motion |
| US3 | VS-1503 | Starter apply, save/apply/delete custom templates |
| US4 | VS-1504 | Default / Minimal / Hero layout variants |
| US5 | VS-1505 | Public API + incognito branding delivery |

---

## Implementation Strategy

### MVP First (Logo + public delivery)

1. Complete Phases 1–2 (schema + branding API)
2. Complete Phase 3 (BrandingProvider)
3. Complete Phase 4 (logo upload + header)
4. **STOP and VALIDATE**: VS-1501 + VS-1505 on `/discover`
5. Continue backgrounds → templates → layouts → admin page polish

### Incremental Delivery

1. Foundation + public API → client provider
2. Logo (header branding) → MVP demo
3. Backgrounds (visual impact) → animated presets
4. Templates (admin productivity) → starters + saved
5. Layout variants + full admin page + regression

---

## Notes

- Logo/background uploads reuse `MediaService.saveImage()` — no new storage stack
- Template apply MUST call existing `applyPreset()` logic for `themePresetId` — keep theme + branding in sync
- Do not merge branding into `ThemeProvider` — separate concerns per research.md R8
- SVG logo upload: verify `MediaService` allowed extensions; extend to `.svg` in service if needed for FR-1501
- Admin page can ship incrementally: logo section first, then wire remaining tabs
