# Tasks: Admin Theme Swatches & Preset Patterns

**Input**: Design documents from `/specs/012-admin-theme-swatches/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: Platform theme customization (012 predecessor: `platform_settings`, `ThemeProvider`, `/admin/theme`)

**Tests**: Not requested in spec — manual VS-1201–VS-1204 only.

---

## Phase 1: Setup — Verify Existing Platform Theme Baseline

**Purpose**: Confirm extension points before preset work

- [X] T001 Verify existing platform theme files: `api/src/modules/platform/`, `client/src/providers/ThemeProvider.tsx`, `client/src/pages/AdminThemePage.tsx` — no new module registration needed

---

## Phase 2: Foundational — Preset Catalog & API Resolution (User Story 4)

**Purpose**: Server-side preset catalog, DB column, and extended theme API — blocks all client swatch work

**Independent Test**: VS-1204 — `GET /api/v1/platform/theme` returns `activePresetId`, `presets[]`, and fully resolved `theme`

- [X] T002 Create migration `api/database/migrations/1719000000011-PlatformThemePreset.ts` adding `theme_preset_id VARCHAR(50) NOT NULL DEFAULT 'spotify'` to `platform_settings`
- [X] T003 Create preset catalog with 6 presets + `resolvePresetTheme()` in `api/src/common/theme-presets.ts` per research.md R6 (spotify, terracotta `#C0672E`, ocean, violet, amber, rose)
- [X] T004 [P] Add `themePresetId` column to `api/src/modules/platform/entities/platform-settings.entity.ts`
- [X] T005 [P] Create `ApplyThemePresetDto` in `api/src/modules/platform/dto/apply-theme-preset.dto.ts` with `presetId` validation
- [X] T006 [P] Extend `UpdateThemeDto` in `api/src/modules/platform/dto/update-theme.dto.ts` with optional `presetId` field
- [X] T007 Refactor `getTheme()`, `updateTheme()`, `resetTheme()`, and add `applyPreset()` in `api/src/modules/platform/platform.service.ts` — resolve preset base + overrides; set `custom` when advanced overrides differ from preset base per data-model.md
- [X] T008 Extend `getTheme()` response in `api/src/modules/platform/platform.service.ts` with `activePresetId` and `presets[]` metadata (id, name, description, preview) per `contracts/theme-presets-api.md`
- [X] T009 Add `applyPreset()`, extended `updateTheme()`, and `resetTheme()` delegations in `api/src/modules/admin/admin.service.ts`
- [X] T010 Add `PUT /api/v1/admin/settings/theme/preset` and extend existing theme routes in `api/src/modules/admin/admin.controller.ts` with Swagger docs
- [X] T011 Run `yarn workspace @ngoma/api migrations:run` to apply `1719000000011-PlatformThemePreset.ts`

**Checkpoint**: Public theme API returns presets; admin can apply preset via curl — client not required yet

---

## Phase 3: User Story 1 — Select Theme from Swatch Grid (Priority: P1) 🎯 MVP

**Goal**: Replace per-token picker wall with visual swatch grid; click to preview, save to apply platform-wide

**Independent Test**: VS-1201 — Admin selects "Ngoma Terracotta" swatch → saves → Discover shows terracotta primary buttons

- [X] T012 [P] [US1] Create display-only preset metadata mirror in `client/src/lib/theme-presets.ts` (id, name, description, preview — no token maps)
- [X] T013 [P] [US1] Create `ThemeSwatchGrid` component in `client/src/components/admin/ThemeSwatchGrid.tsx` per `contracts/theme-swatches-ui.md` (Card grid, 4 colour chips, name, description, click handler)
- [X] T014 [US1] Add `useApplyThemePreset()` mutation calling `PUT /api/v1/admin/settings/theme/preset` in `client/src/hooks/useAdminTheme.ts`
- [X] T015 [US1] Refactor `ThemeEditor` in `client/src/components/admin/ThemeEditor.tsx` — swatch grid as primary section; draft preset state; live `applyTheme()` on swatch click
- [X] T016 [US1] Wire save flow in `ThemeEditor` — call `useApplyThemePreset` when preset changed; invalidate `['platform','theme']` query on success
- [X] T017 [US1] Update `AdminThemePage` in `client/src/pages/AdminThemePage.tsx` — subtitle copy for swatches; pass `presets` and `activePresetId` from API to `ThemeEditor`
- [X] T018 [US1] Extend theme response types in `client/src/hooks/useAdminTheme.ts` and `client/src/providers/ThemeProvider.tsx` for `activePresetId` and `presets[]` (ThemeProvider continues applying `data.theme` only)

**Checkpoint**: Admin can pick swatch, preview live, save — ≤3 clicks per SC-1201

---

## Phase 4: User Story 2 — Active Preset Indicator & Reset (Priority: P1)

**Goal**: Show which preset is active; reset restores Spotify default

**Independent Test**: VS-1202 — After applying preset, reload admin page → same swatch shows selected ring; reset restores spotify

- [X] T019 [US2] Add selected vs active styling in `client/src/components/admin/ThemeSwatchGrid.tsx` — `ring-2 ring-primary` when `selectedPresetId === id`; distinguish saved `activePresetId` with checkmark or label per contracts
- [X] T020 [US2] Implement "Revert draft" in `client/src/components/admin/ThemeEditor.tsx` — restore draft from last fetched `activePresetId` + resolved theme
- [X] T021 [US2] Wire "Reset to defaults" in `ThemeEditor` to existing `useResetAdminTheme()` — verify API sets `theme_preset_id = 'spotify'` and clears overrides; update draft swatch selection on success

**Checkpoint**: Active preset visible after reload; reset returns to Spotify Green

---

## Phase 5: User Story 3 — Optional Advanced Customisation (Priority: P2)

**Goal**: Collapsible per-token editor for power users; custom overrides merge on preset base

**Independent Test**: VS-1203 — Select Ocean → tweak primary in Advanced → save → custom overrides applied

- [X] T022 [US3] Extract existing per-token color inputs into collapsible "Advanced customization" section in `client/src/components/admin/ThemeEditor.tsx` (collapsed by default per FR-1206)
- [X] T023 [US3] Show "Custom" indicator in `ThemeEditor` when `activePresetId === 'custom'` or draft overrides differ from selected preset base
- [X] T024 [US3] On swatch select in `ThemeEditor`, clear prior token overrides and apply preset base tokens (confirm or auto-clear per spec acceptance scenario 2)
- [X] T025 [US3] Save advanced overrides via `useUpdateAdminTheme()` with `{ theme: changes }` path in `ThemeEditor` when only token overrides changed

**Checkpoint**: Advanced section works without cluttering primary swatch UX

---

## Phase 6: Polish & Cross-Cutting

- [X] T026 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T027 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T028 Validate VS-1201–VS-1204 scenarios from `specs/012-admin-theme-swatches/quickstart.md` and document results in quickstart.md

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (US4 API) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6
- US1 client depends on Phase 2 API (`presets[]`, `activePresetId`, preset apply endpoint)
- US2 builds on US1 `ThemeSwatchGrid` and `ThemeEditor` draft state
- US3 extends US1 `ThemeEditor` — sequential on same file
- US4 is fully delivered in Phase 2; Phases 3–5 are client UX on top

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| After T003 | T004, T005, T006 | Entity + DTOs while migration file reviewed |
| US1 client | T012, T013 | Different client files before T015 refactor |
| Polish | T026, T027 | API and client lint/build in parallel |

### Suggested MVP scope

Phases 1–4 — **21 tasks** (T001–T021)

Delivers swatch grid, save, active indicator, reset, and public API resolution. Advanced customization (US3) can follow.

### Full feature

All phases — **28 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US4 Public theme resolution | VS-1204 | T002–T011 |
| US1 Swatch grid | VS-1201 | T012–T018 |
| US2 Active preset & reset | VS-1202 | T019–T021 |
| US3 Advanced customization | VS-1203 | T022–T025 |
| Build/lint | — | T026–T027 |
| E2E validation | VS-1201–1204 | T028 |

---

## Notes

- Preset catalog is code-defined only — not admin-editable in DB
- `custom` preset id is system-assigned when advanced overrides differ from base — not a selectable swatch
- No new npm dependencies; use existing shadcn Card/Button
- Terracotta preset primary MUST be `#C0672E` (FR-1208)
- Per-token pickers MUST NOT be the default view after US1 (SC-1203)
