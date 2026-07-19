# Quickstart: 015-admin-branding-templates

**Purpose**: Validate admin branding — logo, backgrounds, templates, and public delivery.

**Prerequisites**:
- API on **4001**, client on **5173**
- Admin user: `lufegoh@mailinator.com` / `password`
- Migration `1719000000012-PlatformBranding` applied
- Sample PNG logo file (<5 MB) for upload tests

---

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1501: Logo upload, resize, remove

1. Sign in as admin → `/admin/branding`
2. Upload a PNG logo
3. **Expected**: Preview and header on `/discover` show logo (incognito also after cache refresh)
4. Drag width slider to ~200px → Save
5. **Expected**: Logo wider in header
6. Remove logo → Save
7. **Expected**: "Ngoma" text wordmark returns

### VS-1502: Animated and static backgrounds

1. Background tab → select **Animated** → pick **Aurora drift** → Save
2. Open `/discover` in incognito
3. **Expected**: Full-page animated background visible; text readable with overlay
4. Switch to **Static image** → upload festival poster JPG → Save
5. **Expected**: Image covers viewport
6. Set type **None** → Save
7. **Expected**: Solid theme background only

**Reduced motion**: Enable "Reduce motion" in OS → animated preset shows static gradient.

### VS-1503: Branding templates

1. Templates tab → Apply starter **Ngoma Terracotta Hero**
2. **Expected**: Theme colours, hero layout, and gradient background apply together
3. Customize logo → Save as template "My Fest"
4. **Expected**: Appears under My templates
5. Change settings manually → Apply "My Fest"
6. **Expected**: Settings restore to saved snapshot

### VS-1504: UI layout templates

1. Layout tab → select **Minimal** → Save
2. **Expected**: Compact header on all pages
3. Select **Hero** → Save
4. **Expected**: Taller header band, larger logo area

### VS-1505: Public API

```bash
curl -s http://localhost:4001/api/v1/platform/branding | jq .
```

**Expected**: `logoUrl`, `logoWidth`, `background`, `layoutTemplateId` — no admin-only saved templates array.

---

## Admin API smoke

```bash
TOKEN=$(curl -s -X POST http://localhost:4001/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"lufegoh@mailinator.com","password":"password"}' | jq -r '.data.accessToken')

curl -s http://localhost:4001/api/v1/admin/settings/branding \
  -H "Authorization: Bearer $TOKEN" | jq '.data.starters | length'
```

**Expected**: ≥4 starter templates

---

## Regression

- `/admin/theme` swatch flow unchanged
- Theme preset apply from branding template updates `GET /platform/theme`
- Non-admin cannot access admin branding routes (403)
- Track/discover/playlists pages function with all layout variants

---

## Contract references

- [contracts/branding-api.md](./contracts/branding-api.md)
- [branding-templates-ui.md](./contracts/branding-templates-ui.md)
- [animated-backgrounds-ui.md](./contracts/animated-backgrounds-ui.md)

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1505 | PASS | `GET /platform/branding` returns default config with logoWidth 120, layout default |
| VS-1501–VS-1504 | Manual | Open `/admin/branding` — upload logo, set aurora background, apply starter, switch layout |
| Migration | PASS | `PlatformBranding1719000000012` executed |
| Build | PASS | API + client build succeed |

**Admin page**: `/admin/branding` — Logo, Background, Layout, Templates sections with live preview.
