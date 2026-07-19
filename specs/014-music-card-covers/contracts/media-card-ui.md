# Contract: Media Card UI

**Feature**: 014-music-card-covers

## Layout Anatomy

```text
┌─────────────────────────────┐
│                             │
│      COVER (full width)     │  aspect-square, object-cover
│                             │
├─────────────────────────────┤
│  Title (semibold)           │  p-3 padded footer
│  Subtitle (muted)           │
│  Meta row (duration/price)  │
└─────────────────────────────┘
     ↑ card border — cover touches left/right inside border
```

## Shell Classes (required)

```text
group block overflow-hidden rounded-md border border-border bg-card p-0
transition-shadow hover:shadow-lg hover:shadow-black/30
```

## Cover Region (required)

```text
relative w-full aspect-square overflow-hidden bg-muted
```

**Image**:

```text
h-full w-full object-cover transition-transform group-hover:scale-[1.02]
```

**Placeholder** (no cover):

```text
flex h-full w-full items-center justify-center text-muted-foreground/80
```

## Content Region (required)

```text
p-3
```

Typography per `specs/009-shadcn-spotify-redesign/contracts/design-tokens.md`:
- Title: `line-clamp-2 text-base font-semibold text-foreground`
- Subtitle: `text-sm text-muted-foreground`

## Components

| Component | Path | Usage |
|-----------|------|-------|
| `MediaCard` | `client/src/components/ui/MediaCard.tsx` | Shell + cover + content slots |
| `TrackCard` | `client/src/components/ui/TrackCard.tsx` | Track grids |
| `PlaylistCard` | `client/src/components/playlists/PlaylistCard.tsx` | Curated + My playlists |

## Pages to Update

| Page | Before | After |
|------|--------|-------|
| `DiscoverPage` | TrackCard inset; curated inline Card | TrackCard + PlaylistCard full bleed |
| `PlaylistsPage` | Text-only Card | PlaylistCard with cover |

## Anti-patterns (must remove)

- `p-3` or `p-4` on outer card wrapper when cover is child (causes inset)
- Cover with `rounded-md` smaller than card (double radius gap)
- Fixed height cover (`h-32`) without full width in grid cards

## Responsive Grid (unchanged)

```text
grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

## Accessibility

- Cover `alt=""` decorative when title visible below
- Link wraps entire card; title not duplicated in aria-label unless needed
