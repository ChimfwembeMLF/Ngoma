# Quickstart: 014-music-card-covers

**Purpose**: Validate music grid cards show full-width cover art.

**Prerequisites**:
- Client dev server on **5173**
- Seed/demo tracks with cover art (`seed-demo-data.sql`)
- Curated playlists seeded (feature 010)

---

## Run stack

```bash
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1401: Track card full-width cover

1. Open `/discover`
2. Inspect any track card in Trending or New releases
3. **Expected**: Cover image spans edge-to-edge (no gap between image and card left/right border)
4. **Expected**: Title/artist text has padding below cover only

Visual check: resize browser — cover width always matches card width.

### VS-1402: Curated playlist full-width cover

1. On `/discover`, scroll to **Curated by Ngoma**
2. **Expected**: Playlist tiles use square full-bleed covers (not short `h-32` band with side padding)
3. Click card — navigates to playlist detail

### VS-1403: Consistent pattern

1. Compare track card and curated playlist card side-by-side
2. **Expected**: Same aspect ratio, same edge alignment, same footer padding

### VS-1404: My playlists covers

1. Sign in → `/playlists`
2. **Expected**: Playlists with cover art show full-width cover; others show full-width placeholder

---

## DevTools check

Select cover `img` element:
- Parent width === card width
- No horizontal margin on cover container
- `object-cover` applied

---

## Regression

- Discover search still works
- Track card links to `/tracks/:id`
- Grid responsive columns unchanged
- Hover shadow/zoom still clipped

---

## Contract reference

- [media-card-ui.md](./contracts/media-card-ui.md)

---

## Validation results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1401 | PASS (code) | `TrackCard` composes `MediaCard` with `p-0` shell; cover uses `w-full aspect-square` |
| VS-1402 | PASS (code) | Discover curated section uses `PlaylistCard`; removed `h-32` inset Card |
| VS-1403 | PASS (code) | Both cards share `MediaCard` / `MediaCardCover` / `MediaCardContent` |
| VS-1404 | PASS (code) | `PlaylistsPage` uses `PlaylistCard`; API `findMine` returns `coverArtUrl` |

**Build**: `yarn workspace @ngoma/client lint && build` — pass  
**Build**: `yarn workspace @ngoma/api lint && build` — pass  

**Manual UI check**: Open `/discover` and `/playlists` to confirm visual edge-to-edge covers.
