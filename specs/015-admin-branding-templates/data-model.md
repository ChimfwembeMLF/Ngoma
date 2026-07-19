# Data Model: 015-admin-branding-templates

**Feature**: Admin branding, backgrounds & templates

## Database Changes

### Migration: `1719000000012-PlatformBranding.ts`

```sql
ALTER TABLE platform_settings
  ADD COLUMN branding JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN saved_branding_templates JSONB NOT NULL DEFAULT '[]';
```

## Entity: PlatformSettings (extended)

| Column | Type | Description |
|--------|------|-------------|
| `branding` | JSONB | Active logo, background, layout config |
| `saved_branding_templates` | JSONB | Array of admin-saved snapshots (max 10) |

Existing columns unchanged: `theme`, `theme_preset_id`.

## Branding JSON Schema

```typescript
type BackgroundType = 'none' | 'image' | 'animated';

type BrandingConfig = {
  logoUrl: string | null;
  logoWidth: number;           // 48–320, default 120
  background: {
    type: BackgroundType;
    imageUrl: string | null;   // when type === 'image'
    animatedId: string | null; // when type === 'animated', e.g. 'aurora'
    overlayOpacity: number;    // 0–0.8, default 0.4
  };
  layoutTemplateId: 'default' | 'minimal' | 'hero';
};
```

### Defaults (`branding.defaults.ts`)

```typescript
const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: null,
  logoWidth: 120,
  background: { type: 'none', imageUrl: null, animatedId: null, overlayOpacity: 0.4 },
  layoutTemplateId: 'default',
};
```

## Saved Branding Template

```typescript
type SavedBrandingTemplate = {
  id: string;              // uuid
  name: string;            // 1–80 chars
  themePresetId: string;   // e.g. 'terracotta'
  branding: BrandingConfig;
  createdAt: string;       // ISO
};
```

**Validation**:
- Max 10 saved templates
- `name` unique among saved (case-insensitive)
- `themePresetId` must be valid selectable preset

## Starter Template (code-only, not in DB)

```typescript
type StarterBrandingTemplate = {
  id: string;
  name: string;
  description: string;
  preview: { primary: string; accent: string };
  themePresetId: string;
  branding: BrandingConfig;
};
```

Defined in `api/src/common/branding-templates.ts` — not persisted until admin saves a copy.

## Layout Template (code-only metadata)

```typescript
type LayoutTemplateMeta = {
  id: 'default' | 'minimal' | 'hero';
  name: string;
  description: string;
};
```

## Relationships

- `PlatformSettings` singleton (id=1) — one active branding config for entire platform
- Logo/background images stored via `MediaService` URLs — not embedded in JSONB

## State Transitions

| Action | Effect |
|--------|--------|
| Upload logo | Set `branding.logoUrl` |
| Update logo width | Set `branding.logoWidth` only |
| Remove logo | Set `branding.logoUrl = null` |
| Set background | Update `branding.background` |
| Apply starter template | Set `theme_preset_id` + replace `branding` |
| Save custom template | Append to `saved_branding_templates` |
| Apply saved template | Set `theme_preset_id` + `branding` from snapshot |
| Delete saved template | Remove from array by id |

## No New Entities

Templates are JSONB arrays on existing singleton — no separate TypeORM entity table.
