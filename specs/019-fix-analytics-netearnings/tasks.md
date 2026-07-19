# Tasks: Fix Analytics netEarnings Query Error

**Input**: Design documents from `/specs/019-fix-analytics-netearnings/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `005-artist-analytics` (analytics module, dashboard contract)

**Tests**: FR-1905 requests API test for dashboard `topTracks` query — include optional Jest task; manual VS-1901–VS-1905 required regardless.

---

## Phase 1: Setup — Verify Baseline

**Purpose**: Confirm broken query location and contract before fix

- [X] T001 Verify `buildTopTracks()` in `api/src/modules/analytics/analytics.service.ts` uses `.orderBy('netEarnings', 'DESC')` at line ~161 per `research.md`
- [X] T002 [P] Review fix contract in `specs/019-fix-analytics-netearnings/contracts/analytics-top-tracks-query.md` — ORDER BY must use aggregate expression, not camelCase alias

---

## Phase 2: User Story 1 — Artist Dashboard Loads Analytics (Priority: P1) 🎯 MVP

**Goal**: `GET /api/v1/analytics/dashboard` returns 200; artist dashboard no longer shows "Could not load analytics"

**Independent Test**: VS-1901 + VS-1902 — artist JWT → dashboard API 200 with `summary`, `topTracks`, `trends`; UI loads KPI cards and top tracks table

- [X] T003 [US1] Replace `.orderBy('netEarnings', 'DESC')` with `.orderBy('COALESCE(SUM(e.amount), 0)', 'DESC')` in `buildTopTracks()` in `api/src/modules/analytics/analytics.service.ts` per `contracts/analytics-top-tracks-query.md`
- [X] T004 [US1] Confirm secondary sort `.addOrderBy('t.plays', 'DESC')` and `.limit(10)` unchanged in `api/src/modules/analytics/analytics.service.ts` (FR-1902)

**Checkpoint**: Dashboard endpoint succeeds; `topTracks` sorted by net earnings DESC

---

## Phase 3: User Story 2 — Earnings Timeline Stable (Priority: P1)

**Goal**: Timeline endpoint unchanged after fix; chart renders without SQL errors

**Independent Test**: VS-1904 — `GET /api/v1/analytics/earnings/timeline?days=30` returns 200 with `buckets` and `totalNetEarnings`

- [X] T005 [US2] Verify `getEarningsTimeline()` in `api/src/modules/analytics/analytics.service.ts` was not modified and still uses expression-based `.orderBy("DATE_TRUNC('day', ...)", 'ASC')` (regression guard)

**Checkpoint**: Timeline path unaffected by top-tracks fix

---

## Phase 4: User Story 3 — Admin Overview Unaffected (Priority: P2)

**Goal**: Admin revenue charts continue to work; fix scoped to artist `buildTopTracks()` only

**Independent Test**: VS-1905 — admin on `/admin` sees revenue timeline chart load

- [X] T006 [US3] Confirm no changes to revenue timeline queries in `api/src/modules/admin/admin.service.ts` (out of scope per spec)

**Checkpoint**: Admin analytics path untouched

---

## Phase 5: API Test (FR-1905)

**Purpose**: Automated regression for dashboard `topTracks` query against PostgreSQL semantics

- [X] T007 [P] Add Jest test for `buildTopTracks()` ORDER BY in `api/src/modules/analytics/analytics.service.spec.ts` — assert query builder uses `COALESCE(SUM(e.amount), 0)` in ORDER BY, not `netEarnings` alias; or add e2e in `api/test/analytics.e2e-spec.ts` if harness exists

**Checkpoint**: Test fails on broken query, passes after T003 fix

---

## Phase 6: Polish & Cross-Cutting

- [X] T008 Run `yarn workspace @ngoma/api lint` and `yarn workspace @ngoma/api build`
- [X] T009 [P] Run `api/scripts/seed-analytics.sql` and validate VS-1901–VS-1905 from `specs/019-fix-analytics-netearnings/quickstart.md`; document results in `quickstart.md`
- [X] T010 [P] Grep `api/src/**/*.ts` for `.orderBy` with camelCase SELECT aliases — confirm no other occurrences besides the fixed line (research.md secondary audit)

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (US1 fix) → Phase 3–4 (regression checks) can run after T003
- Phase 5 (test) can start in parallel with T003 if TDD preferred; otherwise after T003
- Phase 6 last

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contract review |
| Regression | T005, T006 | Different methods/files, after T003 |
| Test + audit | T007, T010 | Optional parallel after fix |
| Polish | T008, T009 | Lint/build + manual validation |

### Suggested MVP scope

Phases 1–2 — **4 tasks** (T001–T004): verify + one-line fix + sort contract check

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| US1 Dashboard fix | 2 | P1 |
| US2 Timeline stable | 1 | P1 |
| US3 Admin unaffected | 1 | P2 |
| API test | 1 | FR-1905 |
| Polish | 3 | — |
| **Total** | **10** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1901, VS-1902, VS-1903 | Dashboard API + UI + topTracks sort |
| US2 | VS-1904 | Timeline endpoint unchanged |
| US3 | VS-1905 | Admin overview revenue chart |

---

## Implementation Strategy

### MVP First (Dashboard fix)

1. Complete Phase 1 (verify baseline)
2. Complete Phase 2 (T003 one-line ORDER BY fix)
3. **STOP and VALIDATE**: VS-1901 on `/artist/dashboard`
4. Continue timeline/admin regression checks → test → polish

### Incremental Delivery

1. Fix `buildTopTracks()` ORDER BY → unblocks artist dashboard immediately
2. Regression checks → confirm no collateral damage
3. Jest test → prevent future alias ORDER BY regressions
4. Quickstart validation → document pass/fail in quickstart.md

---

## Notes

- No database migration — query builder bug only (FR-1903)
- No client changes expected (FR-1904) — error clears when API returns 200
- Fix must use aggregate expression, not quoted alias — see `research.md` for rationale
- Seed data: `api/scripts/seed-analytics.sql` for VS-1903 sort validation
