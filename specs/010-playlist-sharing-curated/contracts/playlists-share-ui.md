# Contract: Playlists Share & Curated UI

**Design system**: shadcn/ui + Spotify dark (009)  
**Layout**: `AppShell`

---

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/playlists/share/:slug` | `PlaylistDetailPage` | Resolve by slug via hook |
| `/discover` | `DiscoverPage` | + Curated section |
| `/playlists/:id` | `PlaylistDetailPage` | + Share controls (unchanged route) |

Register share route **before** `:id` in `App.tsx` if using separate path, or single detail page with slug param.

---

## DiscoverPage — Curated section

**Section title**: “Curated by Ngoma”

**Data**: `useCuratedPlaylists()` → `GET /api/v1/playlists/curated`

**UI**: Horizontal grid of shadcn `Card` / `TrackCard`-style playlist cards:
- Name, track count, optional cover (first track cover or placeholder)
- Link to `/playlists/share/{shareSlug}` or `/playlists/{id}`

**Empty**: Hide section when `data.length === 0`

---

## PlaylistDetailPage — Share controls

**When**: Playlist is public (`isPublic === true`)

**Controls** (shadcn `Button` outline/ghost):
- **Copy link** — calls share API if needed, copies URL to clipboard, toast/text “Link copied”
- **Share** (optional P3) — `navigator.share({ title, url })` with copy fallback

**When private + owner**: Show muted text “Make playlist public to share” (links to toggle if owner)

**When private + non-owner**: No share controls

---

## Hooks (`usePlaylists.ts` extensions)

```typescript
useCuratedPlaylists()
usePlaylistBySlug(slug)
useEnsureShareLink(playlistId)  // mutation POST .../share
```

Query keys: `['playlists', 'curated']`, `['playlists', 'share', slug]`

---

## Admin UI (minimal MVP)

**Option A (recommended MVP)**: API + seed only; no admin UI page — validate via curl/quickstart.

**Option B**: Add curated management to future admin page — out of scope unless time permits; document in quickstart curl only.

---

## Regression

- My Playlists, add-to-playlist on TrackPage unchanged
- UUID playlist URLs still work
