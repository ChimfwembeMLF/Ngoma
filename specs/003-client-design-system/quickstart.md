# Quickstart: 003-client-design-system

**Purpose**: Visually validate design system rollout on four in-scope pages.

**Prerequisites**: `001-platform-mvp` + `002-mvp-hardening` running (see [002 quickstart](../002-mvp-hardening/quickstart.md)).

## Run client

```bash
yarn workspace @ngoma/client dev
# http://localhost:5173
```

## Validation Scenarios

### VS-201: No legacy theme on in-scope pages

1. Open `/discover`, `/tracks/<id>`, `/auth`, `/dashboard` (sign in first for dashboard).
2. **Expected**: White canvas background, ink text, Rausch (#ff385c) primary buttons. No indigo/cream/terracotta classes visible in rendered UI.

### VS-202: Discover marketplace layout

1. Open `/discover` unsigned.
2. Confirm pill search bar, track cards with cover/placeholder, title, artist, duration, price.
3. Search for a known track title.
4. **Expected**: Search results use identical card pattern as Trending/New Releases.

### VS-203: Track detail hierarchy

1. Open any published track.
2. **Expected**: Display typography for title, muted metadata, restyled player, primary/outline action buttons.

### VS-204: Auth form states

1. Open `/auth`.
2. Toggle Sign In / Register — layout stable.
3. Submit wrong password — error in semantic red.
4. Submit valid login — redirects to dashboard with new styling.
5. **Expected**: Bordered card form, 56px inputs, primary submit button.

### VS-205: Dashboard role links

1. Sign in as LISTENER — outline links for Discover/Purchases.
2. Sign in as ARTIST — primary Artist dashboard + outline Edit profile.
3. Sign in as ADMIN — Admin users link uses design-system button variant.
4. **Expected**: Profile card with hairline border; no legacy colors.

### VS-206: Mobile width (375px)

1. Resize browser or use devtools device mode.
2. Walk all four routes.
3. **Expected**: No horizontal scroll; buttons tappable (≥44px height).

### VS-207: Regression — behavior unchanged

1. Search, open track, play audio, login, logout, dashboard navigation.
2. **Expected**: All flows work as before 003; only visuals changed.

## Visual checklist (manual)

| Token | Discover | Track | Auth | Dashboard |
|-------|----------|-------|------|-----------|
| bg-canvas | ☐ | ☐ | ☐ | ☐ |
| text-ink headings | ☐ | ☐ | ☐ | ☐ |
| text-muted secondary | ☐ | ☐ | ☐ | ☐ |
| bg-primary CTA | ☐ | ☐ | ☐ | ☐ |
| rounded-md cards | ☐ | ☐ | ☐ | ☐ |
| rounded-full search (Discover) | ☐ | — | — | — |

## Troubleshooting

| Issue | Check |
|-------|-------|
| Page still dark | Route not wrapped in `DesignSystemLayout` |
| Out-of-scope page looks wrong | Expected — Artist/Admin not in 003 scope |
| Font looks system default | Cereal not shipped; fallback stack is intentional |
| Primary color wrong | `tailwind.config.ts` `primary` should be #ff385c |

## Contract references

- [design-tokens.md](./contracts/design-tokens.md)
- [ui-components.md](./contracts/ui-components.md)
- [pages.md](./contracts/pages.md)
- [client/DESIGN.md](../../client/DESIGN.md)

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-201 No legacy theme | Pass (grep) | Zero cream/terracotta/indigo in four page files |
| VS-202 Discover layout | Manual | SearchPill + TrackCard grid + empty/loading states |
| VS-203 Track detail | Manual | Cover hero, display typography, restyled AudioPlayer |
| VS-204 Auth form | Manual | Card form, Input components, error color |
| VS-205 Dashboard | Manual | Profile Card + role-aware Button links |
| VS-206 Mobile 375px | Manual | Responsive grids and min-h 44px buttons |
| VS-207 Regression | Pass (build) | `yarn build` + `yarn lint` clean; hooks unchanged |

Automated: `yarn build`, `yarn lint`, legacy class grep on in-scope pages.
