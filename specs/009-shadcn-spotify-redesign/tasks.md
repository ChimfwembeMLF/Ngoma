# Tasks: shadcn/ui + Spotify Dark Redesign

**Input**: Design documents from `/specs/009-shadcn-spotify-redesign/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp` through `008-user-playlists` (all client pages exist)

**Tests**: Not requested in spec — manual VS-901–VS-906 only.

---

## Phase 1: Setup — shadcn/ui Bootstrap

**Purpose**: Initialize shadcn/ui, dependencies, and core component catalog (US1)

- [X] T001 Run `npx shadcn@latest init` in `client/` to create `client/components.json` with Vite, TypeScript, `@/` alias, and CSS variables per `contracts/shadcn-components.md`
- [X] T002 Install peer dependencies in `client/package.json`: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `tailwindcss-animate`, and Radix packages required by shadcn components
- [X] T003 Update `client/src/lib/utils.ts` to use `clsx` + `tailwind-merge` for `cn()` per research.md R8
- [X] T004 Add shadcn components via CLI into `client/src/components/ui/`: `button`, `input`, `label`, `card`, `select`, `checkbox`, `textarea`, `badge`, `separator`, `table`, `alert`, `form`, `dropdown-menu` per `contracts/shadcn-components.md`

**Checkpoint**: `yarn workspace @ngoma/client build` passes with shadcn components present alongside legacy custom UI files

---

## Phase 2: Foundational — Spotify Tokens & App Shell

**Purpose**: Dark theme CSS variables, Tailwind remap, Spotify button variants, layout shell, and grid primitives — blocks all page migrations (US2 + partial US6)

- [X] T005 Map Spotify palette to shadcn CSS variables in `client/src/index.css` (`--background` #121212, `--primary` #1ed760, etc.) per `contracts/design-tokens.md` and data-model.md
- [X] T006 Update `client/tailwind.config.cjs` with shadcn preset, `darkMode: 'class'`, Spotify font stack, remove legacy light tokens (`canvas`, `ink`, `#ff385c` primary extend) per research.md R3
- [X] T007 Set `class="dark"` on `<html>` in `client/index.html` and apply `bg-background text-foreground` base styles in `client/src/index.css`
- [X] T008 Customize Spotify pill CVA variants (green default, dark secondary, outline, ghost, destructive) on `client/src/components/ui/button.tsx` per research.md R4 and DESIGN.md §4
- [X] T009 [P] Apply dark surface and inset-border styling on `client/src/components/ui/input.tsx` and `client/src/components/ui/textarea.tsx` per DESIGN.md §4 Inputs
- [X] T010 Create `client/src/components/layout/AppShell.tsx` with `#121212` background, top nav links (Discover, Playlists, Dashboard, Sign in), and max-width content area per research.md R5
- [X] T011 [P] Refactor `client/src/components/ui/TrackCard.tsx` to compose shadcn `Card` with Spotify hover shadow and `text-muted-foreground` metadata per data-model.md
- [X] T012 [P] Refactor `client/src/components/ui/SearchPill.tsx` to use shadcn `Input` with `rounded-full` pill styling or fold into DiscoverPage if simpler

**Checkpoint**: AppShell renders; TrackCard and search use shadcn; no page migrations yet

---

## Phase 3: User Story 3 — Core Listener Pages (Priority: P1)

**Goal**: Discover, Track detail, and Auth use shadcn + Spotify dark styling end-to-end

**Independent Test**: VS-903 — browse Discover, open track, sign in/register on dark theme

- [X] T013 [US3] Migrate `client/src/pages/DiscoverPage.tsx` to `AppShell`, shadcn `Button`/`Input`, and Spotify semantic classes per `contracts/pages.md`
- [X] T014 [US3] Migrate `client/src/pages/TrackPage.tsx` to `AppShell`, shadcn `Button`/`Select`/`Card`, green pill CTAs, and add-to-playlist control per `contracts/pages.md`
- [X] T015 [US3] Migrate `client/src/pages/AuthPage.tsx` to shadcn `Form`, `Input`, `Label`, `Button` with React Hook Form + Zod per FR-908 and `contracts/pages.md`

---

## Phase 4: User Story 4 — Signed-In Library & Hub (Priority: P2)

**Goal**: Dashboard, Playlists, Playlist detail, and Purchase history use consistent dark shell and shadcn controls

**Independent Test**: VS-904 — `/dashboard`, `/playlists`, `/playlists/:id`, `/purchases` on dark theme

- [X] T016 [US4] Migrate `client/src/pages/DashboardPage.tsx` to `AppShell` and shadcn `Card`/`Button` per `contracts/pages.md`
- [X] T017 [US4] Migrate `client/src/pages/PlaylistsPage.tsx` to shadcn `Card`, `Input`, `Textarea`, `Checkbox`, `Button`, and `Badge` for public/private per `contracts/pages.md`
- [X] T018 [US4] Migrate `client/src/pages/PlaylistDetailPage.tsx` to shadcn `Card`, `Button`, `Badge` with owner actions on dark surfaces per `contracts/pages.md`
- [X] T019 [US4] Migrate `client/src/pages/PurchaseHistoryPage.tsx` to shadcn `Card` or `Table` with Spotify typography tokens per `contracts/pages.md`

---

## Phase 5: User Story 5 — Artist, Checkout, Admin (Priority: P2)

**Goal**: Artist, payment, tip, and admin flows retain functionality with shadcn + dark theme

**Independent Test**: VS-905 — artist upload, checkout, tip, admin table functional with new UI

- [X] T020 [US5] Migrate `client/src/pages/ArtistDashboardPage.tsx` to `AppShell` and shadcn `Card`/`Button` (analytics sections styled in Phase 6) per `contracts/pages.md`
- [X] T021 [US5] Migrate `client/src/pages/ArtistProfilePage.tsx` to shadcn `Form`, `Input`, `Textarea`, `Button` per `contracts/pages.md`
- [X] T022 [US5] Migrate `client/src/pages/CheckoutPage.tsx` to shadcn `Form`, `Input`, `Button`, green pill pay action per `contracts/pages.md`
- [X] T023 [US5] Migrate `client/src/pages/TipArtistPage.tsx` to shadcn `Button`, `Input`, `Textarea`, `Card` with preset amount chips per `contracts/pages.md`
- [X] T024 [US5] Migrate `client/src/pages/AdminUsersPage.tsx` to shadcn `Table`, `Select`, `Button` with dark row hover per `contracts/pages.md`

---

## Phase 6: User Story 6 — Shared Components & Legacy Removal (Priority: P2)

**Goal**: Migrate remaining shared components; delete legacy custom UI primitives

**Independent Test**: VS-906 — player and track cards consistent; zero legacy Button/Input/Card imports

- [X] T025 [US6] Migrate `client/src/components/player/AudioPlayer.tsx` to shadcn `Button` and Spotify dark chrome per `contracts/shadcn-components.md`
- [X] T026 [US6] Migrate `client/src/components/tracks/TrackUploadForm.tsx` to shadcn `Form`, `Input`, `Select`, `Button` per `contracts/shadcn-components.md`
- [X] T027 [US6] Migrate `client/src/components/payments/PaymentStatusPanel.tsx` to shadcn `Alert` and `Card` per `contracts/shadcn-components.md`
- [X] T028 [P] [US6] Migrate `client/src/components/analytics/AnalyticsSummaryCards.tsx`, `EarningsTimeline.tsx`, and `TrackEarningsTable.tsx` to shadcn `Card`/`Table`
- [X] T029 [US6] Migrate `client/src/components/admin/UserTable.tsx` to shadcn `Table` and `Button` variants
- [X] T030 [P] [US6] Update loading UI in `client/src/components/ProtectedRoute.tsx` and `client/src/components/AdminRoute.tsx` to use `bg-background text-muted-foreground`
- [X] T031 [US6] Delete legacy `client/src/components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`, and `client/src/components/layout/DesignSystemLayout.tsx` after confirming zero remaining imports via grep

---

## Phase 7: Polish & Cross-Cutting

- [X] T032 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T033 Run legacy token grep gate (`bg-canvas`, `text-ink`, `border-hairline`, `#ff385c`) on `client/src/pages` and `client/src/components` per quickstart.md — fix any matches
- [X] T034 Document VS-901–VS-906 validation results in `specs/009-shadcn-spotify-redesign/quickstart.md`
- [X] T035 Regression-check discover search, checkout deposit, playlist add, and tip flows unchanged (SC-905)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → Phase 3 (US3) → Phase 4 (US4) → Phase 5 (US5) → Phase 6 (US6) → Phase 7
- US1 (T001–T004) and US2 (T005–T009) complete in Phases 1–2 before any page work
- US3 depends on AppShell + TrackCard + SearchPill (T010–T012)
- US4–US5 depend on US3 patterns established
- US6 legacy deletion (T031) MUST run after all page migrations (T013–T024)
- T009, T011, T012, T028, T030 parallel within their phases

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Input styling | T009 | Parallel after T008 |
| Grid primitives | T011, T012 | Parallel after T010 |
| Analytics | T028 | Parallel with T025–T027 |
| Route guards | T030 | Independent of analytics |

### Suggested MVP scope

Phases 1–3 (T001–T015) — **15 tasks**

Delivers shadcn bootstrap, Spotify tokens, AppShell, and core listener pages (Discover, Track, Auth). Hub and artist flows can follow incrementally.

### Full feature

All phases — **35 tasks**

---

## Independent Test Criteria Summary

| Story | Validation | Tasks |
|-------|------------|-------|
| US1 shadcn foundation | VS-901 | T001–T004 |
| US2 Spotify tokens | VS-902 | T005–T009 |
| US3 Core listener pages | VS-903 | T013–T015 |
| US4 Signed-in hub | VS-904 | T016–T019 |
| US5 Artist/checkout/admin | VS-905 | T020–T024 |
| US6 Shared + legacy removal | VS-906 | T010–T012, T025–T031 |
| Regression | SC-905 | T035 |

---

## Notes

- Client-only — no API or migration work
- All new UI imports use `@/components/ui/*` path alias
- Green `#1ed760` for functional CTAs only — not decorative backgrounds
- Preserve TanStack Query hooks and page business logic; styling and component swaps only
