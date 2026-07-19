# Tasks: Design System — Legacy Pages Rollout

**Input**: Design documents from `/specs/004-design-system-legacy-pages/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `002-mvp-hardening`, `003-client-design-system`

**Tests**: Not requested in spec — manual VS-301–VS-306 only.

---

## Phase 1: Setup — Verify 003 Foundation

**Purpose**: Confirm UI primitives and tokens from 003 are available before migrating legacy routes

- [X] T001 Confirm `DesignSystemLayout`, `Button`, `Input`, and `Card` exist in `client/src/components/` and design tokens are defined in `client/tailwind.config.cjs`

---

## Phase 2: Foundational — Shared Component Restyles

**Purpose**: Restyle shared components used by legacy pages before page refactors

**Independent Test**: Components render with canvas/ink/primary tokens in isolation (Storybook optional; manual via parent pages acceptable)

- [X] T002 [P] Restyle `client/src/components/tracks/TrackUploadForm.tsx` with `Card`, `Input`, and `Button` per `contracts/components.md`
- [X] T003 [P] Restyle `client/src/components/payments/PaymentStatusPanel.tsx` with `Card` and design-token status colors per `contracts/components.md`
- [X] T004 [P] Restyle `client/src/components/admin/UserTable.tsx` with light table styling per `contracts/components.md`

**Checkpoint**: Shared components ready; no legacy cream/indigo/terracotta classes in these files

---

## Phase 3: User Story 3 — Checkout & Payment Status (Priority: P1)

**Goal**: Checkout page and payment panel match design system for trustworthy conversion UX

**Independent Test**: VS-304 on `/checkout/:trackId` — summary card, phone input, primary pay button, status panel on canvas

- [X] T005 [US3] Refactor `client/src/pages/CheckoutPage.tsx` with `DesignSystemLayout`, order summary `Card`, `Input`, `Button`, and ghost back link per `contracts/pages.md`

---

## Phase 4: User Story 1 — Artist Dashboard (Priority: P1)

**Goal**: Artist dashboard and upload flow use light design system consistently

**Independent Test**: VS-302 on `/artist/dashboard` — upload form, track list rows, no legacy colors

- [X] T006 [US1] Refactor `client/src/pages/ArtistDashboardPage.tsx` with `DesignSystemLayout`, bordered track rows, and `buttonVariants` links per `contracts/pages.md`

---

## Phase 5: User Story 4 — Admin User Management (Priority: P2)

**Goal**: Admin users page and route loading state match signed-in product styling

**Independent Test**: VS-305 on `/admin/users` — light table, role filter, pagination controls

- [X] T007 [US4] Refactor `client/src/pages/AdminUsersPage.tsx` with `DesignSystemLayout`, role filter, and `Button` pagination per `contracts/pages.md`
- [X] T008 [US4] Replace `LegacyLayout` loading branch in `client/src/components/AdminRoute.tsx` with `DesignSystemLayout` and muted loading text per `contracts/components.md`

---

## Phase 6: User Story 2 — Artist Profile (Priority: P2)

**Goal**: Profile editing form matches Auth page input patterns

**Independent Test**: VS-303 on `/artist/profile` — Card form, inputs, primary save, muted success message

- [X] T009 [US2] Refactor `client/src/pages/ArtistProfilePage.tsx` with `DesignSystemLayout`, `Card`, `Input`, styled textarea, and primary `Button` per `contracts/pages.md`

---

## Phase 7: User Story 5 — Global Theme Cleanup (Priority: P1)

**Goal**: Remove split-theme workaround; entire client uses canvas/ink defaults

**Independent Test**: VS-301 and VS-306 — zero `LegacyLayout`/legacy color classes; `index.css` body is canvas/ink

- [X] T010 [US5] Verify no remaining `LegacyLayout` imports in `client/src/pages/` and `client/src/components/`
- [X] T011 [US5] Delete `client/src/components/layout/LegacyLayout.tsx`
- [X] T012 [US5] Confirm global body styles in `client/src/index.css` use `bg-canvas text-ink font-sans antialiased`
- [X] T013 [US5] Remove unused legacy color keys (`cream`, `indigo`, `terracotta`, `amber`) from `client/tailwind.config.cjs` when grep shows zero usage in `client/src/`

---

## Phase 8: Polish & Cross-Cutting

- [X] T014 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T015 Run legacy-class grep on `client/src/` per quickstart VS-301 (`LegacyLayout`, `text-cream`, `bg-indigo`, `text-terracotta`)
- [X] T016 Document validation results in `specs/004-design-system-legacy-pages/quickstart.md`
- [X] T017 Regression-check `client/src/pages/PurchaseHistoryPage.tsx` still matches design system (no visual regressions)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (Checkout) → Phase 4 (Artist dashboard) → Phase 5 (Admin) → Phase 6 (Profile) → Phase 7 (Global cleanup) → Phase 8
- **Research R1 order**: Checkout before Artist dashboard; Admin and Profile after; global cleanup last
- Phase 2 tasks T002–T004 can run in parallel
- Phases 3–6 depend on Phase 2; pages can be done sequentially or US3 + US1 in parallel after Phase 2 (different files)
- Phase 7 MUST run after Phases 3–6 (all pages migrated off `LegacyLayout`)
- Phase 8 after Phase 7

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Shared components | T002, T003, T004 | Different component files |
| Pages (optional) | T005, T006 | After Phase 2; checkout + artist dashboard are independent files |

### Suggested MVP scope

Phases 1–3 (Checkout only) — **5 tasks** (T001–T005)

Delivers highest-revenue route on design system with `PaymentStatusPanel` restyled.

### Full feature

All phases — **17 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 Artist dashboard | VS-302 | T002, T006 |
| US2 Artist profile | VS-303 | T009 |
| US3 Checkout | VS-304 | T003, T005 |
| US4 Admin users | VS-305 | T004, T007, T008 |
| US5 Global cleanup | VS-301, VS-306 | T010–T013 |
| Regression | VS-301 (all routes) | T014–T017 |

---

## Notes

- Use `client/src/pages/PurchaseHistoryPage.tsx` as layout reference (research R7)
- No API, hook, or routing changes — presentation layer only
- Do not rework PurchaseHistoryPage unless regression found (T017)
