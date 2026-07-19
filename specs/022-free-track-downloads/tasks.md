# Tasks: Free Track Downloads & Download Access UX

**Input**: Design documents from `/specs/022-free-track-downloads/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `001-platform-mvp`, `006-pwyw-pricing`, `011-payments-pawapay-integration`

**Tests**: Manual quickstart VS-2201–VS-2204; no automated test tasks unless added later.

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm existing download logic and review contracts before changes

- [X] T001 Review `tracks.service.ts` `download()` and `hasDownloadAccess()` in `api/src/modules/tracks/tracks.service.ts` — confirm FREE path skips access check per `specs/022-free-track-downloads/research.md`
- [X] T002 [P] Review contracts in `specs/022-free-track-downloads/contracts/tracks-download-api.md` and `specs/022-free-track-downloads/contracts/track-page-download-ui.md`

---

## Phase 2: Foundational — `canDownload` API (Blocking)

**Purpose**: Expose download entitlement on track detail; required before any TrackPage UI fix

**⚠️ CRITICAL**: No user story client work until this phase completes

- [X] T003 Extend `findOne(id, userId?)` in `api/src/modules/tracks/tracks.service.ts` — add `canDownload` to response via `hasDownloadAccess()` when `userId` present; `false` when anonymous
- [X] T004 Update `toPublicTrack()` or response mapper in `api/src/modules/tracks/tracks.service.ts` to include `canDownload: boolean` per `specs/022-free-track-downloads/data-model.md`
- [X] T005 Apply `OptionalJwtAuthGuard` to `GET /api/v1/tracks/:id` in `api/src/modules/tracks/tracks.controller.ts` — pass `req.user?.['sub']` to `findOne()`; add `@ApiBearerAuth()` optional note in Swagger
- [X] T006 [P] Add `canDownload?: boolean` to `Track` type in `client/src/hooks/useTracks.ts` — confirm `useTrack()` sends auth via `apiFetch` so entitlement is computed server-side

**Checkpoint**: `GET /tracks/:id` returns `canDownload` for authenticated requests; anonymous returns `canDownload: false`

---

## Phase 3: User Story 3 — Clear Download Entitlement (Priority: P1) 🎯

**Goal**: TrackPage never shows Download when API would 403; friendly errors on failure

**Independent Test**: VS-2202 step 2 + VS-2204 — paid track without purchase shows no Download button; failed download shows inline error

- [X] T007 [US3] Gate Download button on `track.canDownload === true` in `client/src/pages/TrackPage.tsx` — remove unconditional Download on paid tracks (lines ~133–135)
- [X] T008 [US3] Add `downloadError` state and display below action buttons in `client/src/pages/TrackPage.tsx` — parse JSON error message from failed download response; no uncaught promise
- [X] T009 [US3] Wrap `download()` in try/catch with user-visible error in `client/src/pages/TrackPage.tsx` per `specs/022-free-track-downloads/contracts/track-page-download-ui.md`

**Checkpoint**: Paid track without purchase → Buy only, no Download; download errors shown in UI

---

## Phase 4: User Story 1 — Download Free Tracks (Priority: P1)

**Goal**: Signed-in listeners download FREE tracks without checkout

**Independent Test**: VS-2201 — FREE track → "Download free" → file saves; anonymous sees sign-in CTA

- [X] T010 [US1] Add "Sign in to download" link for anonymous visitors on FREE tracks in `client/src/pages/TrackPage.tsx` → `/auth` per contract
- [X] T011 [US1] Show "Download free" button only when `isLoggedIn && track.canDownload && pricingType === 'FREE'` in `client/src/pages/TrackPage.tsx`
- [X] T012 [US1] Confirm FREE `GET /api/v1/tracks/:id/download` returns 200 without `download_access` row — regression note only; fix in `tracks.service.ts` if broken

**Checkpoint**: FREE track download works end-to-end for signed-in user (VS-2201)

---

## Phase 5: User Story 2 — Paid Tracks Require Purchase (Priority: P1)

**Goal**: Paid downloads only after checkout; UI matches entitlement

**Independent Test**: VS-2202 + VS-2203 — no Download before purchase; Download after checkout completes

- [X] T013 [US2] Show paid track Download button only when `track.canDownload === true` (post-purchase) in `client/src/pages/TrackPage.tsx` — label "Download" for SET_PRICE/PWYW
- [X] T014 [US2] Ensure Buy / PWYW checkout CTA remains primary when `!canDownload` on paid tracks in `client/src/pages/TrackPage.tsx`
- [X] T015 [P] [US2] Invalidate `['tracks', trackId]` query after successful checkout navigation in `client/src/pages/CheckoutPage.tsx` or rely on fresh mount — ensure `canDownload: true` on return to TrackPage

**Checkpoint**: Paid track without purchase → no Download; after purchase → Download works (VS-2202, VS-2203)

---

## Phase 6: Polish & Cross-Cutting

- [X] T016 Run `yarn workspace @ngoma/api lint:ci` and `yarn workspace @ngoma/api build`
- [X] T017 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T018 Validate VS-2201–VS-2204 from `specs/022-free-track-downloads/quickstart.md`; document results in `quickstart.md`
- [X] T019 [P] Regression: confirm stream playback on TrackPage unchanged and PWYW/SET_PRICE checkout flow in `client/src/pages/CheckoutPage.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** (foundational API)
- **Phase 3 (US3)** requires Phase 2 — client gating needs `canDownload`
- **Phase 4 (US1)** requires Phase 3 — uses gated Download button pattern
- **Phase 5 (US2)** requires Phase 3 — same TrackPage; can overlap with US1 after T007
- **Phase 6** last

### User Story Completion Order

```text
Phase 2 (canDownload API)
  → US3 (entitlement UI + errors)  ← fixes reported 403 bug
  → US1 (free download UX)
  → US2 (paid purchase gating)
```

US1 and US2 are both TrackPage changes and can be done in one pass after US3 T007.

### Parallel Opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contracts |
| Foundation | T006 | Client type while API T003–T005 in progress |
| US3 | — | Sequential on TrackPage |
| US2 | T015 | Checkout invalidation parallel to US1 if different dev |
| Polish | T016, T017, T019 | Lint/build parallel |

### Suggested MVP Scope

**Phases 1–3 (through US3)** — **Tasks T001–T009** (~9 tasks): fixes the 403 UI bug (no Download on unpaid paid tracks) + error handling. Add US1/US2 polish (T010–T015) for complete free/paid flows.

### Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 4 | — |
| US3 Entitlement UX | 3 | P1 |
| US1 Free download | 3 | P1 |
| US2 Paid gating | 3 | P1 |
| Polish | 4 | — |
| **Total** | **19** | |

### Independent Test Criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-2201 | FREE track download for signed-in user |
| US2 | VS-2202, VS-2203 | Paid: no Download until purchase; works after |
| US3 | VS-2204 | No Download when `canDownload: false`; inline errors |

---

## Implementation Strategy

### MVP First (Fix the 403 bug)

1. Complete Phase 1–2 (API `canDownload`)
2. Complete Phase 3 (US3 — hide Download on unpaid paid tracks + errors)
3. **STOP and VALIDATE**: VS-2202 — paid track shows Buy only
4. Add US1/US2 for full free + post-purchase flows

### Incremental Delivery

1. US3 → stops false Download promises (immediate user pain)
2. US1 → confirms free downloads work
3. US2 → confirms post-checkout download + query refresh

---

## Notes

- No database migration — uses existing `download_access` table
- Reuse `OptionalJwtAuthGuard` from `api/src/modules/auth/guards/optional-jwt-auth.guard.ts` (playlists pattern)
- Download endpoint auth unchanged (`JwtAuthGuard` on `GET :id/download`)
- `canDownload` is UI hint; download endpoint remains authoritative
