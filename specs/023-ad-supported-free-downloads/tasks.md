# Tasks: Ad-Supported Free Track Downloads

**Input**: Design documents from `/specs/023-ad-supported-free-downloads/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `022-free-track-downloads`, `001-platform-mvp`, `016-dashboard-enhancements`

**Tests**: Manual quickstart VS-2301–VS-2304; no automated test tasks unless added later.

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm feature 022 download path and review contracts

- [X] T001 Review contracts in `specs/023-ad-supported-free-downloads/contracts/ads-api.md` and `specs/023-ad-supported-free-downloads/contracts/ad-gate-ui.md`
- [X] T002 [P] Verify FREE download + `canDownload` from feature 022 in `api/src/modules/tracks/tracks.service.ts` and `client/src/pages/TrackPage.tsx`

---

## Phase 2: Foundational — Schema & Ads Module (Blocking)

**Purpose**: Database, entities, platform config, and ads service required by all user stories

**⚠️ CRITICAL**: No user story work until this phase completes

- [X] T003 Create TypeORM migration `api/database/migrations/<timestamp>-AdSupportedDownloads.ts` — tables `ad_creatives`, `ad_sessions`, `ad_impressions`; column `ads_config` on `platform_settings` per `specs/023-ad-supported-free-downloads/data-model.md`
- [X] T004 [P] Create entities `AdCreative`, `AdSession`, `AdImpression` in `api/src/modules/ads/entities/`
- [X] T005 Extend `PlatformSettings` with `adsConfig` JSONB in `api/src/modules/platform/entities/platform-settings.entity.ts`; expose defaults `{ adsEnabled: true, gateSeconds: 5 }` in `api/src/modules/platform/platform.service.ts`
- [X] T006 Scaffold `AdsModule` with `AdsService`, register `TypeOrmModule.forFeature([AdCreative, AdSession, AdImpression])` and import in `api/src/app.module.ts`
- [X] T007 Implement core `AdsService` methods in `api/src/modules/ads/ads.service.ts` — `getPublicConfig()`, `pickCreative()`, `createSession()`, `completeSession()`, `validateSessionForDownload()` with TTL and gateSeconds enforcement

**Checkpoint**: Migration runnable; ads module registered; session lifecycle works in isolation

---

## Phase 3: User Story 1 — Ad Gate Before Free Download (Priority: P1) 🎯 MVP

**Goal**: Listener sees ad modal with countdown before FREE track download; API rejects bypass

**Independent Test**: VS-2301 — FREE track → Download free → ad modal → countdown → file downloads

- [X] T008 [US1] Add `POST /api/v1/tracks/:id/ad-session` in `api/src/modules/tracks/tracks.controller.ts` delegating to `AdsService.createSession()` per `contracts/ads-api.md`
- [X] T009 [US1] Extend `TracksService.download()` in `api/src/modules/tracks/tracks.service.ts` — require header `X-Ad-Session-Id` with completed session when `pricingType === FREE` and `adsEnabled`; return `403` otherwise
- [X] T010 [US1] Add `POST /api/v1/ad-sessions/:id/complete` in `api/src/modules/ads/ads.controller.ts` with JwtAuthGuard
- [X] T011 [P] [US1] Add public `GET /api/v1/platform/ads/config` in `api/src/modules/ads/ads.controller.ts` or extend `api/src/modules/platform/platform.controller.ts`
- [X] T012 [P] [US1] Create `useAds.ts` in `client/src/hooks/useAds.ts` — `useAdsConfig`, `useStartAdSession`, `useCompleteAdSession` mutations
- [X] T013 [US1] Create `AdGateModal` in `client/src/components/ads/AdGateModal.tsx` — banner, countdown, Download now / Cancel per `contracts/ad-gate-ui.md`
- [X] T014 [US1] Integrate ad gate in `client/src/pages/TrackPage.tsx` — open modal on Download free when `adsEnabled`; pass `X-Ad-Session-Id` on download fetch

**Checkpoint**: End-to-end FREE download with ad gate (VS-2301); API bypass returns 403

---

## Phase 4: User Story 2 — Admin Manages Ad Creatives (Priority: P1)

**Goal**: Admin CRUD for house ad banners and platform ad settings

**Independent Test**: VS-2302 — Admin adds creative → listener sees it in ad gate

- [X] T015 [P] [US2] Create DTOs `CreateAdCreativeDto`, `UpdateAdCreativeDto`, `UpdateAdsConfigDto` in `api/src/modules/ads/dto/`
- [X] T016 [US2] Add `AdminAdsController` in `api/src/modules/ads/admin-ads.controller.ts` — `GET/POST/PUT/DELETE /api/v1/admin/ads/creatives`, `PUT /api/v1/admin/ads/config` with AdminRoute guard
- [X] T017 [P] [US2] Extend `useAds.ts` with admin hooks — `useAdminCreatives`, `useCreateCreative`, `useUpdateCreative`, `useUpdateAdsConfig`
- [X] T018 [US2] Create `AdminAdsPage.tsx` in `client/src/pages/AdminAdsPage.tsx` — creative list, upload image via existing media pattern, toggle active, gate seconds; add route in `client/src/App.tsx` and nav link from `client/src/pages/AdminOverviewPage.tsx`

**Checkpoint**: Admin can manage creatives; listener ad gate shows uploaded banner (VS-2302)

---

## Phase 5: User Story 3 — Ad Impressions & Analytics (Priority: P2)

**Goal**: Record impressions and surface count on admin overview

**Independent Test**: VS-2303 — completed gate creates `ad_impressions` row; admin KPI visible

- [X] T019 [US3] Create `AdImpression` row in `AdsService.completeSession()` in `api/src/modules/ads/ads.service.ts` — denormalize trackId, userId, creativeId
- [X] T020 [US3] Add `adImpressions` count (last 30 days) to admin dashboard response in `api/src/modules/admin/admin.service.ts`
- [X] T021 [P] [US3] Display ad impressions KPI card on `client/src/pages/AdminOverviewPage.tsx`

**Checkpoint**: Impression analytics visible to admin (VS-2303)

---

## Phase 6: User Story 4 — Paid Tracks Unchanged (Priority: P1)

**Goal**: Paid downloads skip ad gate; feature 022 behavior preserved

**Independent Test**: VS-2304 — paid entitled download has no modal; unpaid shows Buy only

- [X] T022 [US4] Verify `TrackPage.tsx` opens `AdGateModal` only when `pricingType === 'FREE'` and `adsEnabled` — paid `canDownload` path calls download directly without session
- [X] T023 [P] [US4] Update FREE pricing label to **"Free download (ad-supported)"** with helper text in `client/src/components/tracks/TrackUploadForm.tsx` per `contracts/ad-gate-ui.md`

**Checkpoint**: Paid regression-free (VS-2304)

---

## Phase 7: Polish & Cross-Cutting

- [X] T024 Run `yarn workspace @ngoma/api migrations:run` and verify ad tables + `ads_config` column exist
- [X] T025 Run `yarn workspace @ngoma/api lint:ci` and `yarn workspace @ngoma/api build`
- [X] T026 [P] Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T027 Validate VS-2301–VS-2304 from `specs/023-ad-supported-free-downloads/quickstart.md`; document results in `quickstart.md`
- [X] T028 [P] Verify `PROJECT REQUIREMENTS.md` §1.4 monetization model documents ad-supported FREE downloads (updated in plan phase)
- [X] T029 [P] Regression: feature 022 paid checkout in `client/src/pages/CheckoutPage.tsx` and kill switch `adsEnabled: false` restores direct FREE download

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** (foundational)
- **Phase 3 (US1)** requires Phase 2 — core ad session + download gate
- **Phase 4 (US2)** requires Phase 2; can parallel with US1 after T007 (admin needs creatives for full VS-2302)
- **Phase 5 (US3)** requires US1 complete path (T010, T019)
- **Phase 6 (US4)** requires US1 TrackPage integration (T014)
- **Phase 7** last

### User Story Completion Order

```text
Phase 2 (schema + AdsService)
  → US1 (ad gate + download validation)  ← MVP
  → US2 (admin creatives)     ─┐ parallel after T007
  → US4 (paid regression)     ─┘
  → US3 (impressions analytics)
```

### Parallel Opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Contracts + 022 baseline |
| Foundation | T004, T005 | Entities + platform config while migration writes |
| US1 | T011, T012 | Public config + client hooks |
| US2 | T015, T017 | DTOs + admin hooks parallel to controller |
| US3 | T021 | Admin KPI while API T020 builds |
| US4 | T023 | Upload form label anytime after US1 |
| Polish | T025, T026, T028, T029 | Lint/build parallel |

### Suggested MVP Scope

**Phases 1–3 (US1)** — **Tasks T001–T014** (~14 tasks): ad gate works end-to-end with seed/placeholder creative. Add US2 admin UI (T015–T018) immediately after for production creatives.

### Task Count Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational | 5 | — |
| US1 Ad gate | 7 | P1 |
| US2 Admin creatives | 4 | P1 |
| US3 Impressions | 3 | P2 |
| US4 Paid unchanged | 2 | P1 |
| Polish | 6 | — |
| **Total** | **29** | |

### Independent Test Criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-2301 | Ad modal + countdown + download; API 403 without session |
| US2 | VS-2302 | Admin creative appears in gate |
| US3 | VS-2303 | Impression row + admin KPI |
| US4 | VS-2304 | Paid download no ad; 022 buy-only unchanged |

---

## Implementation Strategy

### MVP First (Ad gate only)

1. Complete Phase 1–2 (foundation)
2. Complete Phase 3 (US1)
3. **STOP and VALIDATE**: VS-2301 with placeholder creative
4. Add US2 for admin-managed banners

### Incremental Delivery

1. US1 → monetization gate live
2. US2 → admin controls campaigns
3. US3 → revenue reporting
4. US4 + polish → regression confidence

---

## Notes

- House ads only — no third-party SDK in MVP
- `adsEnabled: false` bypasses gate (022 direct download)
- Paid tracks never call ad session endpoints
- Session TTL ~2 min; one-time use on download recommended
- Register `POST tracks/:id/ad-session` before conflicting routes if added to tracks controller
