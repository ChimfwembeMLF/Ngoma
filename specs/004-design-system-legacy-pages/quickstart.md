# Quickstart: 004-design-system-legacy-pages

**Purpose**: Visually validate design system rollout on legacy routes and confirm global theme cleanup.

**Prerequisites**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system` implemented. Demo seed data recommended (see [002 quickstart](../002-mvp-hardening/quickstart.md)).

## Run stack

```bash
# API (port 4001) + Postgres 5433 — see 002 quickstart
yarn workspace @ngoma/client dev
# http://localhost:5173
```

**Demo accounts** (if `api/scripts/seed-demo-data.sql` applied):

| Role | Email | Password |
|------|-------|----------|
| Listener | listener@ngoma.test | demo1234 |
| Admin | lufegoh@mailinator.com | (seeded) |

Use an ARTIST account from registration or seed for artist scenarios.

## Validation Scenarios

### VS-301: No legacy theme anywhere

1. Walk routes: `/discover`, `/dashboard`, `/artist/dashboard`, `/artist/profile`, `/checkout/<priced-track-id>`, `/admin/users`, `/purchases`.
2. **Expected**: White canvas, ink text, primary #ff385c CTAs throughout. No cream/indigo/terracotta visible.

**Automated check**:

```bash
rg 'LegacyLayout|text-cream|bg-indigo|text-terracotta|LegacyLayout' client/src/
# Expected: no matches after 004 complete
```

### VS-302: Artist dashboard

1. Sign in as ARTIST → `/artist/dashboard`.
2. Confirm upload form uses Input/Button styling.
3. Upload a test MP3 (or verify existing tracks list).
4. **Expected**: Track rows on canvas with hairline borders; primary upload button.

### VS-303: Artist profile

1. Open `/artist/profile`, edit name/bio/genres, save.
2. **Expected**: Card form, design-system inputs, primary save button, muted success message.

### VS-304: Checkout flow

1. Sign in as LISTENER, open a priced track → Buy → `/checkout/:id`.
2. Enter phone, initiate payment (sandbox auto-complete in dev if configured).
3. **Expected**: Checkout summary card, primary pay button, PaymentStatusPanel on canvas.

### VS-305: Admin users

1. Sign in as ADMIN → `/admin/users`.
2. Filter by role, paginate, deactivate a non-admin test user (optional).
3. **Expected**: Light table, surface-soft header, outline pagination buttons.

### VS-306: Global CSS & build

1. Inspect `client/src/index.css` — body uses `bg-canvas text-ink`.
2. Confirm `LegacyLayout.tsx` deleted.
3. Run:

```bash
yarn workspace @ngoma/client lint
yarn workspace @ngoma/client build
```

4. **Expected**: Both pass; no legacy color utilities in migrated files.

## Visual checklist

| Route | bg-canvas | ink headings | primary CTA | no legacy colors |
|-------|-----------|--------------|-------------|------------------|
| /artist/dashboard | ☐ | ☐ | ☐ | ☐ |
| /artist/profile | ☐ | ☐ | ☐ | ☐ |
| /checkout/:id | ☐ | ☐ | ☐ | ☐ |
| /admin/users | ☐ | ☐ | ☐ | ☐ |
| /purchases (regression) | ☐ | ☐ | ☐ | ☐ |

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-301 No legacy theme | Pass (grep) | Zero `LegacyLayout`, `text-cream`, `bg-indigo`, `text-terracotta` in `client/src/` |
| VS-302 Artist dashboard | Manual | DesignSystemLayout, TrackUploadForm + track rows on canvas |
| VS-303 Artist profile | Manual | Card form, Input, textarea, primary save |
| VS-304 Checkout | Manual | Summary Card, provider select, phone Input, PaymentStatusPanel |
| VS-305 Admin users | Manual | Light UserTable, role filter, outline pagination |
| VS-306 Global CSS & build | Pass | `index.css` canvas/ink; `LegacyLayout` deleted; lint + build clean |

Automated: `yarn workspace @ngoma/client lint`, `yarn workspace @ngoma/client build`, legacy-class grep.

## Troubleshooting

| Issue | Check |
|-------|-------|
| Page still cream/dark | Route still imports `LegacyLayout` or uses legacy classes |
| Tailwind colors missing | `tailwind.config.cjs` loaded (see 003 tailwind fix) |
| Checkout fails functionally | Unrelated to 004 — verify API/PawaPay sandbox per 002 quickstart |
| Admin 403 | User role must be ADMIN |

## Contract references

- [pages.md](./contracts/pages.md)
- [components.md](./contracts/components.md)
- [003 design tokens](../003-client-design-system/contracts/design-tokens.md)
- [client/DESIGN.md](../../client/DESIGN.md)
