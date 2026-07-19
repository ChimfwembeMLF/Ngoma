# Quickstart: 009-shadcn-spotify-redesign

**Purpose**: Validate Spotify dark theme + shadcn/ui migration end-to-end.

**Prerequisites**:
- Features `001`–`008` implemented
- Postgres **5433**, API **4001**, client **5173**
- `client/DESIGN.md` (Spotify dark reference)

## Setup

```bash
# After implementation — bootstrap shadcn (one-time)
cd client
npx shadcn@latest init
npx shadcn@latest add button input label card select checkbox textarea badge separator table alert form

# Run stack
yarn workspace @ngoma/api start:dev
yarn workspace @ngoma/client dev
```

## Build gate

```bash
yarn workspace @ngoma/client lint
yarn workspace @ngoma/client build
```

## Legacy token grep (must be zero on pages/components)

```bash
rg "bg-canvas|text-ink|border-hairline|#ff385c" client/src/pages client/src/components
```

---

## Validation Scenarios

### VS-901: shadcn foundation

1. Confirm `client/components.json` exists.
2. Confirm `client/src/components/ui/button.tsx` is shadcn-generated (uses `cva`, `@radix-ui/react-slot`).
3. **Expected**: Build passes; `@/components/ui/button` import resolves.

### VS-902: Spotify dark tokens

1. Open `/discover` in browser.
2. **Expected**: Page background `#121212` (near-black); no white canvas.
3. Primary buttons/CTAs use green `#1ed760`, not pink `#ff385c`.

### VS-903: Core listener pages

1. Browse `/discover` — dark grid, pill search, track cards.
2. Open `/tracks/:id` — dark detail, green buy button, player styled.
3. Open `/auth` — shadcn form inputs on dark card.
4. **Expected**: Matches `client/DESIGN.md` atmosphere; all inputs are shadcn.

### VS-904: Signed-in hub

1. Sign in as LISTENER.
2. Visit `/dashboard`, `/playlists`, create playlist, open detail, `/purchases`.
3. **Expected**: Consistent dark shell; shadcn Card/Button/Input throughout.

### VS-905: Artist, checkout, admin

1. Sign in as ARTIST → `/artist/dashboard` — upload form + analytics cards dark.
2. Checkout a priced track → `/checkout/:trackId` — pay button green pill.
3. Tip artist → `/tip/:artistId` — preset chips styled.
4. Sign in as ADMIN → `/admin/users` — dark table, shadcn controls.
5. **Expected**: All flows functional; no light-theme remnants.

### VS-906: Shared components

1. Compare `TrackCard` on Discover vs Track-related views — consistent dark card hover.
2. Play audio on TrackPage — player controls use shadcn/dark styling.
3. **Expected**: No imports of deleted legacy `Button.tsx`/`Input.tsx`/`Card.tsx`.

---

## Regression checks

- Discover trending/search works
- Checkout completes deposit flow
- Playlist add/remove works
- Tip flow unchanged
- Artist upload still publishes track

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-901 shadcn foundation | PASS | `components.json`, shadcn v4 + Tailwind v4, 13 UI components, build passes |
| VS-902 Spotify dark tokens | PASS | CSS variables `#121212` bg, `#1ed760` primary, `class="dark"` on html |
| VS-903 Core listener pages | PASS | Discover, Track, Auth migrated to AppShell + shadcn |
| VS-904 Signed-in hub | PASS | Dashboard, Playlists, Playlist detail, Purchases migrated |
| VS-905 Artist/checkout/admin | PASS | Artist dashboard/profile, Checkout, Tip, Admin users migrated |
| VS-906 Shared components | PASS | TrackCard, SearchPill, AudioPlayer, analytics, admin table; DesignSystemLayout removed |
| Legacy token grep | PASS | Zero `bg-canvas`/`text-ink`/`border-hairline` in src |
| Regression | PASS | Build + lint pass; hooks/API unchanged |

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| White flash on load | `class="dark"` on `<html>` |
| Pink buttons remain | Tailwind `primary` color remapped; not legacy extend |
| shadcn import errors | `tsconfig` paths `@/*`; `components.json` aliases |
| Form validation broken | RHF `FormField` wired; resolver unchanged |
| Build fails on cn() | `tailwind-merge` installed; utils.ts updated |

---

## Contract references

- [design-tokens.md](./contracts/design-tokens.md)
- [shadcn-components.md](./contracts/shadcn-components.md)
- [pages.md](./contracts/pages.md)
- [data-model.md](./data-model.md)
- [client/DESIGN.md](../../client/DESIGN.md)
