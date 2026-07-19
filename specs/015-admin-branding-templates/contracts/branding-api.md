# Contract: Platform Branding API

**Feature**: 015-admin-branding-templates

## Public Endpoints

### GET /api/v1/platform/branding

No auth. Returns active branding for all clients.

**Response 200**:

```json
{
  "success": true,
  "data": {
    "logoUrl": "https://cdn.example.com/images/logo.png",
    "logoWidth": 140,
    "background": {
      "type": "animated",
      "imageUrl": null,
      "animatedId": "aurora",
      "overlayOpacity": 0.45
    },
    "layoutTemplateId": "hero",
    "updatedAt": "2026-07-19T14:00:00.000Z"
  }
}
```

When no logo: `logoUrl: null` — client shows "Ngoma" wordmark.

---

## Admin Endpoints

All require `JwtAuthGuard` + `ADMIN` role, `@ApiBearerAuth()`.

### GET /api/v1/admin/settings/branding

Returns active branding + starter templates + saved templates + layout catalog.

```json
{
  "success": true,
  "data": {
    "branding": { "...": "BrandingConfig" },
    "starters": [
      { "id": "ngoma-hero", "name": "Ngoma Terracotta Hero", "description": "...", "preview": { "primary": "#C0672E", "accent": "#F5A623" }, "themePresetId": "terracotta", "branding": { "...": "..." } }
    ],
    "saved": [ { "id": "uuid", "name": "Summer Launch", "themePresetId": "amber", "branding": { "...": "..." }, "createdAt": "..." } ],
    "layouts": [ { "id": "default", "name": "Default", "description": "Standard top navigation" } ],
    "animatedPresets": [ { "id": "aurora", "name": "Aurora drift", "description": "Soft colour waves" } ],
    "updatedAt": "..."
  }
}
```

### PUT /api/v1/admin/settings/branding

Partial update of branding fields (no file upload).

**Body**:

```json
{
  "logoWidth": 160,
  "background": { "type": "animated", "animatedId": "gradient-drift", "overlayOpacity": 0.5 },
  "layoutTemplateId": "minimal"
}
```

**Response**: Same shape as GET admin branding (active config only in `data.branding`).

### POST /api/v1/admin/settings/branding/logo

`multipart/form-data`, field `file` (image).

**Response 200**:

```json
{ "success": true, "data": { "logoUrl": "...", "branding": { "...": "full config" } } }
```

### DELETE /api/v1/admin/settings/branding/logo

Clears `logoUrl`. Response: updated branding payload.

### POST /api/v1/admin/settings/branding/background-image

`multipart/form-data`, field `file`. Sets `background.type = 'image'`, `background.imageUrl`.

### POST /api/v1/admin/settings/branding/templates/apply

Apply starter or saved template.

**Body**:

```json
{ "templateId": "ngoma-hero", "source": "starter" }
```

or

```json
{ "templateId": "uuid", "source": "saved" }
```

**Side effect**: Updates `theme_preset_id` + `branding` atomically.

### POST /api/v1/admin/settings/branding/templates/save

Save current platform state as named template.

**Body**: `{ "name": "Summer Launch" }`

**Errors**: 400 if name duplicate or ≥10 saved templates.

### DELETE /api/v1/admin/settings/branding/templates/:id

Remove saved template by uuid. Does not change active branding.

---

## Validation Rules

| Field | Rule |
|-------|------|
| `logoWidth` | integer 48–320 |
| `background.type` | enum: none, image, animated |
| `background.animatedId` | must exist in animated preset catalog when type=animated |
| `background.overlayOpacity` | number 0–0.8 |
| `layoutTemplateId` | enum: default, minimal, hero |
| Template `name` | 1–80 chars, trim |

## DTOs

- `api/src/modules/platform/dto/update-branding.dto.ts`
- `api/src/modules/platform/dto/apply-branding-template.dto.ts`
- `api/src/modules/platform/dto/save-branding-template.dto.ts`

## Service Methods (PlatformService)

- `getBranding()` — public payload
- `getAdminBranding()` — full admin payload
- `updateBranding(dto)` — partial merge with defaults
- `uploadLogo(file)` — MediaService + persist URL
- `removeLogo()`
- `uploadBackgroundImage(file)`
- `applyBrandingTemplate(id, source)`
- `saveBrandingTemplate(name)`
- `deleteSavedTemplate(id)`

## Cache Invalidation (client)

On any admin branding mutation, invalidate:
- `['platform', 'branding']`
- `['admin', 'branding']`
- `['platform', 'theme']` (when template applies theme preset)
