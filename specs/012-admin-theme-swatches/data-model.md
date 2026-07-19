# Data Model: 012-admin-theme-swatches

**Feature**: Admin theme swatches & preset patterns

## Entities

### PlatformSettings (extended)

Existing singleton row (`id = 1`). One migration adds column.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | INT | NO | 1 | Singleton PK (CHECK id = 1) |
| `theme` | JSONB | NO | `{}` | Per-token overrides (existing) |
| `theme_preset_id` | VARCHAR(50) | NO | `'spotify'` | Active preset catalog id |
| `updated_at` | TIMESTAMPTZ | NO | now() | Last change |

**Relationships**: None.

**Validation**:
- `theme_preset_id` MUST be a key in `THEME_PRESETS` catalog or `'custom'`
- When admin applies known preset via swatch, set `theme_preset_id` to preset id and clear `theme` `{}`
- When admin saves advanced token overrides only, set `theme_preset_id` to `'custom'` if overrides non-empty and differ from preset base
- `theme` values MUST pass existing hex validation (`sanitizeThemeInput`)

## Code-Defined Catalog (not persisted)

### ThemePreset

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable slug e.g. `spotify`, `terracotta` |
| `name` | string | Display name |
| `description` | string | Short subtitle for swatch card |
| `preview` | string[4] | Hex chips for UI: primary, background, card, mutedForeground |
| `tokens` | ThemeTokenMap | Partial or full override from DEFAULT_THEME |

Stored in `api/src/common/theme-presets.ts` only.

## Resolution Logic

```text
base = THEME_PRESETS[theme_preset_id]?.tokens ?? THEME_PRESETS.spotify.tokens
resolved = mergeTheme({ ...base, ...theme_overrides })
```

Public API returns `resolved` as `data.theme`.

## State Transitions

```text
[spotify default]
    │ admin selects swatch "terracotta"
    ▼
[terracotta, theme={}]
    │ admin tweaks primary in Advanced
    ▼
[custom, theme={ primary: "#..." }]
    │ admin selects swatch "ocean"
    ▼
[ocean, theme={}]   (overrides cleared on preset apply)

    │ admin clicks Reset
    ▼
[spotify, theme={}]
```

## Migration

**File**: `api/database/migrations/1719000000011-PlatformThemePreset.ts`

```sql
ALTER TABLE platform_settings
  ADD COLUMN theme_preset_id VARCHAR(50) NOT NULL DEFAULT 'spotify';
```

Existing rows backfilled to `spotify` via DEFAULT.

## No New Tables

Preset catalog is not stored in PostgreSQL.
