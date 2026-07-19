# Tasks: Music Card Full-Width Covers

**Input**: Design documents from `/specs/014-music-card-covers/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `009-shadcn-spotify-redesign` (`TrackCard`, Discover grids, shadcn Card)

**Tests**: Not requested in spec — manual VS-1401–VS-1404 only.

---

## Phase 1: Setup — Verify Client Baseline

**Purpose**: Confirm extension points and current inset-cover patterns before refactor

- [X] T001 Verify existing files and inset layout: `client/src/components/ui/TrackCard.tsx` (`p-3` wrapper), `client/src/pages/DiscoverPage.tsx` (curated `h-32` cover inside padded Card), `client/src/pages/PlaylistsPage.tsx` (text-only cards)
- [X] T002 [P] Review layout contract in `specs/014-music-card-covers/contracts/media-card-ui.md` and typography tokens in `specs/009-shadcn-spotify-redesign/contracts/design-tokens.md`

---

## Phase 2: Foundational — Shared MediaCard Primitive (User Story 3 enabler)

**Purpose**: Single full-bleed cover + padded footer pattern — blocks all card refactors

**Independent Test**: VS-1403 (partial) — MediaCard renders shell with edge-to-edge cover and padded content slot

- [X] T003 Create `MediaCard` shell component in `client/src/components/ui/MediaCard.tsx` — `MediaCard`, `MediaCardCover`, `MediaCardContent` per `contracts/media-card-ui.md` (`p-0`, `overflow-hidden`, `aspect-square`, hover shadow)
- [X] T004 [P] Add cover placeholder helper in `client/src/components/ui/MediaCard.tsx` — music icon / "No cover" for missing `coverArtUrl`
- [X] T005 [P] Export `MediaCard` parts from `client/src/components/ui/MediaCard.tsx` for use by TrackCard and PlaylistCard

**Checkpoint**: MediaCard composable in isolation with full-width cover and padded footer

---

## Phase 3: User Story 1 — Track Cards Edge-to-Edge Cover (Priority: P1) 🎯 MVP

**Goal**: Track cards on Discover show cover art spanning full card width; metadata padded below

**Independent Test**: VS-1401 — Track card cover touches left/right card edges; hover zoom clipped

- [X] T006 [US1] Refactor `client/src/components/ui/TrackCard.tsx` to compose `MediaCard` — remove outer `p-3`, remove inset `rounded-md` on cover, keep title/artist/duration/price in `MediaCardContent`
- [X] T007 [US1] Verify `TrackCard` usage unchanged on `client/src/pages/DiscoverPage.tsx` (Trending, New releases, Search grids) — no page markup changes required if TrackCard API unchanged

**Checkpoint**: Discover track grids show full-bleed covers (MVP deliverable)

---

## Phase 4: User Story 2 — Curated Playlist Cards Full-Width Cover (Priority: P1)

**Goal**: Curated playlist tiles on Discover use square full-bleed covers matching track cards

**Independent Test**: VS-1402 — Curated card cover spans full card width; title/track count padded below

- [X] T008 [P] [US2] Create `PlaylistCard` in `client/src/components/playlists/PlaylistCard.tsx` — compose `MediaCard`; props `{ id, name, trackCount, coverArtUrl, href }`; subtitle shows track count
- [X] T009 [US2] Replace inline shadcn `Card` markup in curated section of `client/src/pages/DiscoverPage.tsx` with `PlaylistCard` — remove `h-32` fixed height; use `aspect-square` via MediaCard

**Checkpoint**: Curated and track cards align side-by-side on Discover

---

## Phase 5: User Story 4 — My Playlists Grid Covers (Priority: P2)

**Goal**: `/playlists` grid shows full-width cover art when available

**Independent Test**: VS-1404 — Playlist with cover shows full-width art; placeholder otherwise

- [X] T010 [US4] Include `coverArtUrl` in `findMine()` response in `api/src/modules/playlists/playlists.service.ts` (field exists on entity; currently omitted from list DTO)
- [X] T011 [P] [US4] Add `coverArtUrl: string | null` to `PlaylistSummary` in `client/src/hooks/usePlaylists.ts`
- [X] T012 [US4] Replace text-only playlist grid in `client/src/pages/PlaylistsPage.tsx` with `PlaylistCard` — match Discover grid breakpoints (`sm:grid-cols-2 lg:grid-cols-3`); move public/private badge into `MediaCardContent` footer

**Checkpoint**: My playlists page shows cover tiles consistent with Discover

---

## Phase 6: User Story 3 — Unified Media Card Pattern (Priority: P2)

**Goal**: All music grid cards share the same cover + footer structure; no orphaned inset patterns

**Independent Test**: VS-1403 — TrackCard and PlaylistCard use same MediaCard structure; responsive grids preserve full width

- [X] T013 [US3] Audit `client/src` for inset-cover anti-patterns (`grep` for `p-3`/`p-4` on card wrappers with cover children, `h-32` playlist covers) — fix any remaining music grid cards found
- [X] T014 [US3] Align hover interaction (`group-hover:scale-[1.02]`, `hover:shadow-lg`) consistently on `TrackCard` and `PlaylistCard` via shared `MediaCard` classes

**Checkpoint**: SC-1403 satisfied — no divergent music card layouts in grids

---

## Phase 7: Polish & Cross-Cutting

- [X] T015 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T016 [P] Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build` (after T010 API touch)
- [X] T017 Validate VS-1401–VS-1404 from `specs/014-music-card-covers/quickstart.md` and document results in quickstart.md
- [X] T018 Regression-check Discover search, track links (`/tracks/:id`), playlist links, and grid breakpoints unchanged

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (MediaCard) → Phase 3 (US1) + Phase 4 (US2) can run in parallel after Phase 2
- Phase 5 (US4) depends on Phase 4 `PlaylistCard` (T008)
- Phase 6 (US3) audit best after US1 + US2 + US4 complete
- Phase 7 after all stories

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline verify + contract review |
| MediaCard | T004, T005 | Placeholder + exports while shell built (T003) |
| After Phase 2 | T006–T007 (US1), T008 (US2 start) | TrackCard refactor parallel with PlaylistCard create |
| US4 prep | T010, T011 | API + hook types in parallel |
| Polish | T015, T016 | Client and API lint/build in parallel |

### Suggested MVP scope

Phases 1–3 — **7 tasks** (T001–T007): MediaCard + TrackCard full-bleed on Discover

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 3 | US3 enabler |
| US1 Track cards | 2 | P1 |
| US2 Curated playlists | 2 | P1 |
| US4 My playlists | 3 | P2 |
| US3 Unified pattern | 2 | P2 |
| Polish | 4 | — |
| **Total** | **18** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1401 | Track card edge-to-edge cover on Discover |
| US2 | VS-1402 | Curated playlist full-bleed cover |
| US3 | VS-1403 | Consistent MediaCard pattern across grids |
| US4 | VS-1404 | My playlists grid covers |

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1–2 (Setup + MediaCard)
2. Complete Phase 3 (TrackCard refactor)
3. **STOP and VALIDATE**: VS-1401 on `/discover`
4. Continue with curated playlists (US2), then My playlists (US4), then audit (US3)

### Incremental Delivery

1. MediaCard foundation → TrackCard (Discover tracks fixed)
2. PlaylistCard + Discover curated (all Discover grids consistent)
3. PlaylistsPage + API `coverArtUrl` (user library grids)
4. Audit + polish (SC-1403, quickstart validation)

---

## Notes

- `TrackPage` hero cover is out of scope — do not change `client/src/pages/TrackPage.tsx`
- Curated cards: compute `href` from `shareSlug` in `DiscoverPage` and pass to `PlaylistCard`
- If T010 is skipped and API already returns `coverArtUrl`, verify and mark complete
- Preserve grid classes: `grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` on Discover
