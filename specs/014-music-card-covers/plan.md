# Implementation Plan: Music Card Full-Width Covers

**Branch**: `014-music-card-covers` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-music-card-covers/spec.md`

## Summary

Refactor music grid cards so **cover art is full-bleed** (edge-to-edge width). Primary fix: **`TrackCard`** removes outer padding from cover region (`p-0` shell + padded metadata footer). Introduce shared **`MediaCard`** / **`PlaylistCard`** primitives and apply to **Discover** curated playlists and **`PlaylistsPage`**. Client-only CSS/layout — no API changes.

## Technical Context

**Language/Version**: TypeScript, React 18, Vite

**Primary Dependencies**: Tailwind CSS v4, shadcn Card, existing `TrackCard`

**Storage**: None

**Testing**: Manual VS-1401–VS-1404 per `quickstart.md`

**Target Platform**: Web SPA (Discover, Playlists)

**Project Type**: Yarn monorepo — `client/src/` only

**Constraints**:
- Match Spotify grid pattern from `client/DESIGN.md`
- Reuse semantic tokens (`bg-card`, `border-border`)
- Minimize scope — layout only

**Scale/Scope**: 1 shared component, 1 TrackCard refactor, 2–3 page updates

**Reference**: `specs/009-shadcn-spotify-redesign/contracts/design-tokens.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Client-only — no api/ changes required
- [x] Work in `client/src/components/`
- [x] No new dependencies
- [x] Follows shadcn + Tailwind conventions

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/014-music-card-covers/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── media-card-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
client/src/
├── components/ui/
│   ├── TrackCard.tsx              # REFACTOR full-bleed cover
│   └── MediaCard.tsx              # NEW shared shell (optional)
├── components/playlists/
│   └── PlaylistCard.tsx         # NEW for playlist grids
├── pages/
│   ├── DiscoverPage.tsx           # Use PlaylistCard for curated
│   └── PlaylistsPage.tsx          # Add cover to playlist grid
```

**Structure Decision**: Extract `MediaCardCover` + `MediaCardBody` subcomponents or single `MediaCard` wrapper to DRY cover footer pattern between track and playlist cards.

## Complexity Tracking

> No violations — table empty.

## Phase 0 & 1 Artifacts

- [research.md](./research.md)
- [data-model.md](./data-model.md)
- [contracts/media-card-ui.md](./contracts/media-card-ui.md)
- [quickstart.md](./quickstart.md)
