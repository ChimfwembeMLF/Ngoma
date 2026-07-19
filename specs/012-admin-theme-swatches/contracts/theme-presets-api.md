# Contract: Theme Presets API

**Feature**: 012-admin-theme-swatches

## Public

### GET /api/v1/platform/theme

**Auth**: None

**Response** (extended):

```json
{
  "success": true,
  "data": {
    "theme": { "primary": "#1ed760", "background": "#121212", "...": "..." },
    "activePresetId": "spotify",
    "presets": [
      {
        "id": "spotify",
        "name": "Spotify Green",
        "description": "Default Ngoma dark palette",
        "preview": ["#1ed760", "#121212", "#181818", "#b3b3b3"]
      }
    ],
    "overrides": {},
    "defaults": { "...": "..." },
    "updatedAt": "2026-07-19T..."
  }
}
```

- `presets[]` includes metadata only (no full token maps on public endpoint)
- `theme` is fully resolved (preset base + overrides)

---

## Admin

### GET /api/v1/admin/settings/theme

**Auth**: JWT + ADMIN

Same shape as public response plus optional `presets[].tokens` for admin preview (optional — may resolve client-side from applyPreset preview call).

---

### PUT /api/v1/admin/settings/theme/preset

**Auth**: JWT + ADMIN

**Body**:

```json
{ "presetId": "terracotta" }
```

**Behavior**:
- Validate `presetId` exists in catalog
- Set `theme_preset_id = presetId`
- Clear `theme` overrides to `{}`
- Return updated theme response

**Errors**:
- `400` — unknown presetId

---

### PUT /api/v1/admin/settings/theme

**Auth**: JWT + ADMIN

**Body** (extended):

```json
{
  "presetId": "ocean",
  "theme": { "primary": "#2563EB" }
}
```

**Behavior**:
- If `presetId` provided: set preset, then merge optional `theme` overrides
- If only `theme` provided: merge overrides; set `activePresetId` to `custom` when overrides differ from current preset base
- Existing behavior preserved for theme-only updates

---

### POST /api/v1/admin/settings/theme/reset

**Auth**: JWT + ADMIN

**Behavior** (extended):
- Set `theme_preset_id = 'spotify'`
- Clear `theme = {}`
- Return default resolved theme

---

## Preset Catalog IDs

| id | name |
|----|------|
| `spotify` | Spotify Green (default) |
| `terracotta` | Ngoma Terracotta |
| `ocean` | Ocean Blue |
| `violet` | Violet Pulse |
| `amber` | Warm Amber |
| `rose` | Rose Signal |
| `custom` | Advanced overrides (not selectable swatch) |
