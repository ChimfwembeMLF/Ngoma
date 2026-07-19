# Contract: Theme Swatches UI

**Feature**: 012-admin-theme-swatches  
**Route**: `/admin/theme`  
**Design system**: shadcn/ui + existing `AppShell`

## Layout

```text
┌─────────────────────────────────────────────────────────┐
│ Admin — Theme                              [Users] [Dash]│
│ Customise platform colours with preset swatches          │
├─────────────────────────────────────────────────────────┤
│ Theme presets                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ ●●●●     │ │ ●●●●     │ │ ●●●●     │ │ ●●●●     │   │
│ │ Spotify  │ │Terracotta│ │ Ocean    │ │ Violet   │   │
│ │ Green ✓  │ │          │ │          │ │          │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│ ... (6 presets in responsive grid)                       │
│                                                          │
│ [Save theme]  [Revert draft]  [Reset to defaults]        │
│                                                          │
│ ▶ Advanced customization (collapsed by default)          │
│   (per-token color inputs — existing ThemeEditor fields) │
├─────────────────────────────────────────────────────────┤
│ Preview panel (sticky on lg)                             │
│ Track card + buttons using live draft theme              │
└─────────────────────────────────────────────────────────┘
```

## Components

### ThemeSwatchGrid

| Prop | Type | Description |
|------|------|-------------|
| `presets` | `ThemePresetMeta[]` | From API |
| `activePresetId` | string | Current saved preset |
| `selectedPresetId` | string | Draft selection |
| `onSelect` | `(id) => void` | Preview on click |

**Swatch card**:
- `Card` with `cursor-pointer`, hover border accent
- Selected: `ring-2 ring-primary`
- 4 colour circles (`preview[]`) in a row
- Name (font-medium) + description (text-xs muted)

### ThemeEditor (refactored)

Primary section: `ThemeSwatchGrid`  
Secondary: collapsible Advanced token editor  
Actions: Save / Revert draft / Reset to defaults

## Interactions

1. **Select swatch** → update draft preset id + `applyTheme(resolvedPreview)` locally
2. **Save** → `PUT /admin/settings/theme/preset` OR `PUT /admin/settings/theme` if advanced overrides dirty
3. **Revert draft** → restore from last fetched API state
4. **Reset to defaults** → `POST /admin/settings/theme/reset`

## Hooks

Extend `useAdminTheme.ts`:
- `useApplyThemePreset()` → `PUT .../theme/preset`
- Existing `useUpdateAdminTheme`, `useResetAdminTheme` unchanged

## Success States

- Toast or inline "Theme saved successfully" (existing pattern on AdminThemePage)
- Active swatch ring persists after reload

## Accessibility

- Swatch cards are `<button type="button">` or clickable Card with `aria-pressed` when selected
- Colour chips have `aria-hidden` (decorative); preset name is accessible label

## Out of Scope (UI)

- Drag-to-reorder presets
- Create new preset in UI
- Light mode preview toggle
