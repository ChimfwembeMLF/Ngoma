# Research: 014-music-card-covers

**Date**: 2026-07-19

## R1: Full-bleed cover layout pattern

**Decision**: Use **split card structure**: outer shell `overflow-hidden rounded-md border bg-card p-0`; cover block `w-full aspect-square`; metadata block `p-3` (or `p-4` for playlists).

**Rationale**: Spotify album cards place art flush to card edges; padding only on text area below. Current `TrackCard` wraps everything in `p-3`, creating inset cover.

**Alternatives considered**:
- Negative margins on cover — rejected; fragile with borders
- Full-bleed via `-mx-3` hack — rejected; prefer structural fix

---

## R2: Shared component vs inline fixes

**Decision**: Create `MediaCard` wrapper with slots:
- `MediaCard` — Link/div shell, overflow hidden
- `MediaCardCover` — image or placeholder, aspect-square, w-full
- `MediaCardContent` — padded footer for title/metadata

Refactor `TrackCard` to compose these. Add `PlaylistCard` using same primitives.

**Rationale**: Discover curated cards and PlaylistsPage need same pattern; DRY prevents regression.

**Alternatives considered**:
- Fix TrackCard only — rejected; user said "all music cards"
- Modify shadcn Card global styles — rejected; too broad

---

## R3: Curated playlist card height

**Decision**: Change curated cards from fixed `h-32` cover to **`aspect-square`** full-width cover (consistent with tracks).

**Rationale**: User asked for cover filling width; square grid matches Spotify playlist tiles and track cards.

**Alternatives considered**:
- Wide banner (16:9) — rejected; inconsistent with track grid

---

## R4: shadcn Card on Discover curated section

**Decision**: Replace inline Card markup with `PlaylistCard` component; avoid shadcn Card default `py-(--card-spacing)` which prevents edge-to-edge images unless `p-0` + `has-[>img:first-child]:pt-0`.

**Rationale**: shadcn Card supports first-child img full bleed via `*:[img:first-child]:rounded-t-xl` but Discover wraps cover in nested div with padding — structural fix needed.

---

## R5: PlaylistsPage cover source

**Decision**: Use `playlist.coverArtUrl` from existing list API when present; full-width placeholder otherwise. Verify `GET /playlists` returns `coverArtUrl` — if missing, optional follow-up API enrichment out of scope unless field already exists.

**Rationale**: data-model assumes field exists on playlist entity from 008.

---

## R6: Hover interaction

**Decision**: Keep subtle `scale-[1.02]` on cover image inside `overflow-hidden` container; card shadow on hover unchanged.

**Rationale**: Preserves existing TrackCard polish without scope creep.
