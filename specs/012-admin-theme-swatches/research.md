# Research: 012-admin-theme-swatches

**Date**: 2026-07-19

## R1: Preset storage — code vs database

**Decision**: Presets defined in `api/src/common/theme-presets.ts` as a static catalog. Database stores only `theme_preset_id` + optional per-token overrides in existing `theme` JSONB.

**Rationale**: Presets are version-controlled, reviewable in PRs, and need no admin CRUD. Matches constitution simplicity principle. Product requirements show fixed brand options, not user-defined palettes.

**Alternatives considered**:
- DB `theme_presets` table — rejected; over-engineering for MVP
- JSON file loaded at runtime — rejected; TypeScript gives type safety with `ThemeTokenKey`

---

## R2: Preset resolution order

**Decision**: `resolvedTheme = mergeTheme({ ...PRESETS[presetId].tokens, ...overrides })` where overrides win on conflict. Default preset id: `spotify`.

**Rationale**: Reuses existing `mergeTheme()` and `sanitizeThemeInput()`. Advanced tweaks layer on preset base.

**Alternatives considered**:
- Overrides replace entire preset — rejected; loses partial tweak UX
- Store full resolved theme in DB — rejected; duplicates preset data

---

## R3: Swatch UI pattern

**Decision**: Grid of `Card` components, each showing:
- Preset name + short description
- 4 preview chips: `primary`, `background`, `card`, `mutedForeground`
- Selected ring when `activePresetId === id`
- Click → set draft preset + live `applyTheme()`

**Rationale**: Matches shadcn Card patterns; 4 chips communicate palette at a glance without exposing token names. Aligns with user request for "swatches" not raw pickers.

**Alternatives considered**:
- Single large gradient swatch — rejected; harder to read surface vs accent
- Dropdown select — rejected; less visual than swatch grid

---

## R4: Advanced editor placement

**Decision**: Collapsible `<details>` or shadcn-style accordion below swatch grid, labeled "Advanced customization". Contains existing per-token color inputs from current `ThemeEditor`.

**Rationale**: Preserves power-user escape hatch without primary UI clutter. Satisfies FR-1206 P2.

**Alternatives considered**:
- Separate `/admin/theme/advanced` route — rejected; unnecessary navigation
- Remove token editor entirely — rejected; user may need fine-tune after swatch

---

## R5: API contract changes

**Decision**:
- Extend `GET /api/v1/platform/theme` response: `activePresetId`, `presets[]` (id, name, description, preview)
- Extend `PUT /api/v1/admin/settings/theme` body: optional `presetId` (applies preset, clears overrides unless `theme` also sent)
- New `PUT /api/v1/admin/settings/theme/preset` with `{ presetId }` for explicit preset-only apply
- Extend reset to set `theme_preset_id = 'spotify'` + clear overrides

**Rationale**: Backward compatible — existing `theme` override field still works. Explicit preset endpoint simplifies client mutation.

**Alternatives considered**:
- Break change replacing PUT body — rejected; existing hooks work

---

## R6: Preset catalog (initial set)

**Decision**: Ship 6 presets:

| id | name | Primary | Notes |
|----|------|---------|-------|
| `spotify` | Spotify Green | `#1ed760` | Current default |
| `terracotta` | Ngoma Terracotta | `#C0672E` | PROJECT REQUIREMENTS §5.3.3 |
| `ocean` | Ocean Blue | `#3B82F6` | Cool accent |
| `violet` | Violet Pulse | `#A855F7` | Purple accent |
| `amber` | Warm Amber | `#F59E0B` | Warm gold accent |
| `rose` | Rose Signal | `#F43F5E` | Bold red-pink accent |

Each preset derives surfaces from Spotify dark base with adjusted primary/ring/accent only (minimal diff per preset) — keeps readable contrast.

**Rationale**: Covers warm/cool/neutral brand directions without maintaining 6 fully unique 19-token palettes.

**Alternatives considered**:
- Fully unique 19-token maps per preset — rejected; high maintenance, marginal UX gain

---

## R7: "Patterns" interpretation

**Decision**: Treat "patterns" as **curated palette patterns** (preset combinations), not CSS background patterns/textures.

**Rationale**: User contrast is with per-token pickers; product mockup shows branding colour not textures. Texture patterns deferred per spec out-of-scope.

**Alternatives considered**:
- Diagonal stripe CSS backgrounds — rejected for MVP scope

---

## R8: Client preset metadata sync

**Decision**: Client `theme-presets.ts` exports only `id`, `name`, `description`, `preview` chips for UI labels. Full token resolution always from API response after save/fetch.

**Rationale**: Single source of truth on API prevents client/API preset drift. Client file is display-only fallback while loading.

**Alternatives considered**:
- Shared workspace package — rejected; YAGNI for 6 presets
