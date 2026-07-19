# Tasks: Client Design System Rollout

**Input**: Design documents from `/specs/003-client-design-system/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`

**Tests**: Not requested in spec — manual VS-201–VS-207 only.

---

## Phase 1: Setup — Design Tokens

**Purpose**: Tailwind theme and shared utilities

- [X] T001 Extend `client/tailwind.config.ts` with DESIGN.md semantic colors, radii, shadow-card, font-sans
- [X] T002 [P] Create `cn()` helper in `client/src/lib/utils.ts`

---

## Phase 2: Foundational — Layout & UI Primitives

**Purpose**: Reusable components before page refactors

- [X] T003 Create `DesignSystemLayout` in `client/src/components/layout/DesignSystemLayout.tsx`
- [X] T004 [P] Create `Button` and `buttonVariants` in `client/src/components/ui/Button.tsx`
- [X] T005 [P] Create `Input` in `client/src/components/ui/Input.tsx`
- [X] T006 [P] Create `Card` in `client/src/components/ui/Card.tsx`
- [X] T007 [P] Create `SearchPill` in `client/src/components/ui/SearchPill.tsx`
- [X] T008 [P] Create `TrackCard` in `client/src/components/ui/TrackCard.tsx`

**Checkpoint**: UI primitives ready for page composition

---

## Phase 3: User Story 1 & 5 — Discover + Shared Language (Priority: P1)

**Goal**: Discover page uses light design system; no legacy colors

**Independent Test**: VS-201, VS-202 on `/discover`

- [X] T009 [US1] Refactor `client/src/pages/DiscoverPage.tsx` with DesignSystemLayout, SearchPill, TrackCard, empty/loading states

---

## Phase 4: User Story 2 — Track Detail (Priority: P1)

**Goal**: Track page hierarchy, player, and actions match design system

**Independent Test**: VS-203 on `/tracks/:id`

- [X] T010 [US2] Refactor `client/src/pages/TrackPage.tsx` with design-system layout, cover hero, Button/Link actions
- [X] T011 [US2] Restyle `client/src/components/player/AudioPlayer.tsx` with canvas/ink/primary tokens

---

## Phase 5: User Story 3 — Auth (Priority: P2)

**Goal**: Professional auth card and form inputs

**Independent Test**: VS-204 on `/auth`

- [X] T012 [US3] Refactor `client/src/pages/AuthPage.tsx` with Card, Input, Button, error state

---

## Phase 6: User Story 4 — Dashboard (Priority: P2)

**Goal**: Signed-in hub matches design system

**Independent Test**: VS-205 on `/dashboard`

- [X] T013 [US4] Refactor `client/src/pages/DashboardPage.tsx` with profile Card and role-aware button links

---

## Phase 7: Polish & Cross-Cutting

- [X] T014 Run `yarn lint` and `yarn build` in `client/` workspace
- [X] T015 Verify no legacy `cream`/`terracotta`/`indigo` classes on in-scope pages
- [X] T016 Document validation results in `specs/003-client-design-system/quickstart.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phases 3–6 (3–6 can parallelize after Phase 2)
- Phase 7 after all pages complete

### Suggested MVP scope

Phases 1–3 (Discover only) — **9 tasks**

### Full feature

All phases — **16 tasks**

---

## Notes

- Out-of-scope pages keep legacy `index.css` body styles and indigo/cream tokens
- No API changes
