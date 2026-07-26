# Implementation Plan: Ad-Supported Free Track Downloads

**Branch**: `023-ad-supported-free-downloads` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Monetize FREE downloads with ad gate; update PROJECT REQUIREMENTS.

## Summary

Extend FREE track downloads (feature 022) with a **server-validated ad gate**: listeners view an admin-managed house creative for a configurable countdown before download. New `ads` module handles creatives, sessions, impressions. Platform earns ad revenue (100% in MVP). Paid downloads unchanged.

## Technical Context

**Language/Version**: TypeScript, Node 20+, NestJS API, React + Vite client

**Primary Dependencies**: TypeORM, existing `TracksService.download()`, `PlatformSettings`, TanStack Query

**Storage**: PostgreSQL — new tables `ad_creatives`, `ad_sessions`, `ad_impressions`; `platform_settings.ads_config`

**Testing**: Manual VS-2301–VS-2304

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — new `api/src/modules/ads/`, client `components/ads/`, admin page

**Performance Goals**: Ad session create < 200ms; no extra round trip on paid downloads

**Constraints**: House ads only; no third-party SDK in MVP

**Scale/Scope**: ~15–20 tasks; medium-small feature

## Constitution Check

*GATE: Pass*

- [x] New module `api/src/modules/ads/` registered in `app.module.ts`
- [x] TypeORM migrations for new tables
- [x] `/api/v1/` routes, JwtAuthGuard, Swagger
- [x] Client in `client/src/` with TanStack Query
- [x] Extends tracks download — no payment module changes

**Post-design**: PASS

## Project Structure

### Documentation

```text
specs/023-ad-supported-free-downloads/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ads-api.md
│   └── ad-gate-ui.md
└── tasks.md          # /speckit-tasks
```

### Source Code

```text
api/
├── database/migrations/<timestamp>-AdSupportedDownloads.ts
├── src/modules/ads/
│   ├── ads.module.ts
│   ├── ads.service.ts
│   ├── ads.controller.ts          # ad-session complete, public config
│   ├── admin-ads.controller.ts    # admin CRUD
│   └── entities/
├── src/modules/tracks/
│   ├── tracks.controller.ts       # POST :id/ad-session; download header check
│   └── tracks.service.ts          # validate ad session on FREE download
└── src/modules/platform/
    └── entities/platform-settings.entity.ts  # ads_config column

client/
├── src/components/ads/AdGateModal.tsx
├── src/hooks/useAds.ts
├── src/pages/TrackPage.tsx
├── src/pages/AdminAdsPage.tsx     # or section on AdminOverview
└── src/components/tracks/TrackUploadForm.tsx  # label update
```

## Complexity Tracking

No violations.

---

## Phase 0: Research ✅

See [research.md](./research.md)

---

## Phase 1: Design ✅

| Artifact | Path |
|----------|------|
| Data model | [data-model.md](./data-model.md) |
| API contract | [contracts/ads-api.md](./contracts/ads-api.md) |
| UI contract | [contracts/ad-gate-ui.md](./contracts/ad-gate-ui.md) |
| Validation | [quickstart.md](./quickstart.md) |

---

## Requirements updates (this feature)

- `PROJECT REQUIREMENTS.md` — monetization model, FREE = ad-supported, revenue breakdown
- `specs/022-free-track-downloads/spec.md` — out of scope note points to 023 for ads

---

## Implementation outline (for /speckit-tasks)

1. Migration + entities
2. Ads module (creatives CRUD, sessions, impressions)
3. Tracks download validation + ad-session routes
4. Client AdGateModal + TrackPage integration
5. Admin ads UI + platform config
6. TrackUploadForm label + analytics card
7. Validate quickstart scenarios

**Estimated tasks**: 18–22
