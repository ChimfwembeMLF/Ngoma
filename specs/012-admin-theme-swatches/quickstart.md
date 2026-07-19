# Quickstart: 012-admin-theme-swatches

**Purpose**: Validate admin theme swatch selection replaces per-token picker UX and applies platform-wide.

**Prerequisites**:
- Feature 012 implemented (migration run)
- Postgres **5433**, API **4001**, client **5173**
- Admin account (`api/scripts/seed-admin.sql`)

---

## Run stack

```bash
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

Run migration if not applied:

```bash
yarn workspace @ngoma/api migrations:run
```

---

## Validation Scenarios

### VS-1201: Swatch grid primary UX

1. Sign in as admin → Dashboard → **Theme settings**
2. **Expected**: Grid of ≥6 named preset swatches with colour chips — not a wall of 19 token inputs as the first thing you see
3. Click **Ngoma Terracotta** swatch
4. **Expected**: Live preview — primary buttons turn terracotta (`#C0672E`)
5. Click **Save theme**
6. Open `/discover` in same session
7. **Expected**: Primary actions use terracotta green/orange accent

### VS-1202: Active preset indicator

1. Reload `/admin/theme`
2. **Expected**: Terracotta swatch shows selected/active ring
3. Click **Reset to defaults**
4. **Expected**: Spotify Green swatch active; primary returns to `#1ed760`

```bash
curl -s http://localhost:4001/api/v1/platform/theme | jq '.data | {activePresetId, primary: .theme.primary}'
```

After terracotta save: `activePresetId: "terracotta"`, `primary: "#C0672E"`

### VS-1203: Advanced customization

1. Select **Ocean Blue** swatch
2. Expand **Advanced customization**
3. Change **Primary** manually
4. Save
5. **Expected**: `activePresetId: "custom"` or overrides merged; theme reflects tweak

### VS-1204: Public theme resolution

```bash
curl -s http://localhost:4001/api/v1/platform/theme | jq '.data.presets | length'
```

**Expected**: ≥6 preset metadata entries

Unauthenticated client load:

1. Open `/discover` in incognito
2. **Expected**: Active preset colours applied via `ThemeProvider`

---

## API smoke tests

Apply terracotta preset (requires admin JWT):

```bash
curl -s -X PUT -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"presetId":"terracotta"}' \
  http://localhost:4001/api/v1/admin/settings/theme/preset | jq '.data.activePresetId'
```

**Expected**: `"terracotta"`

---

## Validation results (2026-07-19)

| Scenario | Result | Notes |
|----------|--------|-------|
| VS-1204 Config + presets | ✓ PASS | `GET /platform/theme` → `activePresetId: spotify`, 6 presets, `primary: #1ed760` |
| VS-1201 Swatch grid | Manual | Admin `/admin/theme` — 6 swatch cards primary UI |
| VS-1202 Active indicator | Manual | Selected ring + "Active" badge on saved preset |
| VS-1203 Advanced | Manual | Collapsible advanced section; custom variant badge |

Build/lint: API and client lint + build pass. Migration `1719000000011` applied.

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Still see only token pickers | Feature 012 not deployed; rebuild client |
| Swatch click no preview | `applyTheme()` not wired to draft state |
| Preset not persisting after reload | Migration `theme_preset_id` column; API restart |
| Wrong colours | `GET /platform/theme` — verify `activePresetId` and resolved `theme.primary` |

---

## Contract references

- [theme-presets-api.md](./contracts/theme-presets-api.md)
- [theme-swatches-ui.md](./contracts/theme-swatches-ui.md)
- [data-model.md](./data-model.md)
