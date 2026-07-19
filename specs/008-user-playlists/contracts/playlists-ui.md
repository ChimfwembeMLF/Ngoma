# Contract: Playlists UI

**Design system**: `DesignSystemLayout`, `Card`, `Button`, `Input`, `TrackCard` patterns from 003/004

---

## Routes

| Path | Page | Auth |
|------|------|------|
| `/playlists` | `PlaylistsPage` | Protected |
| `/playlists/:id` | `PlaylistDetailPage` | Public if playlist public |

Register in `client/src/App.tsx`.

---

## PlaylistsPage

**Purpose**: My Playlists library

**Sections**:
- Header: "My playlists" + "Create playlist" button
- Grid/list of playlist cards: name, track count, public/private badge
- Empty state: "No playlists yet" + create CTA
- Inline or modal create form: name (required), description (optional), public toggle

---

## PlaylistDetailPage

**Purpose**: View playlist tracks

**Sections**:
- Header: playlist name, description, track count
- If owner: Delete playlist, toggle public, remove track buttons
- Track list: title, artist, duration, link to `/tracks/:id`
- Empty: "No tracks yet — add from discover"

---

## TrackPage — Add to playlist

**When**: User logged in

**UI**: Row below action buttons:
- `<select>` populated from `useMyPlaylists()`
- "Add to playlist" button
- Success/error message inline

If no playlists: link "Create a playlist" → `/playlists`

---

## Hook: usePlaylists.ts

```typescript
useMyPlaylists()
usePlaylist(id)
useCreatePlaylist()
useUpdatePlaylist()
useDeletePlaylist()
useAddTrackToPlaylist()
useRemoveTrackFromPlaylist()
```

Query keys: `['playlists', 'mine']`, `['playlists', id]`

---

## Navigation

Optional link from `DiscoverPage` header or dashboard to `/playlists` (implement if minimal diff).

---

## Regression

- Discover trending/new releases unchanged
- Track stream/download/checkout/tip unchanged
