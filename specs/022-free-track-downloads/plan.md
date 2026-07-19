# Implementation Plan: Free Track Downloads & Download Access UX

**Branch**: `022-free-track-downloads` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: TrackPage download 403; "should we allow free downloads?"

## Summary

**Yes — free downloads should be allowed** for signed-in users on `FREE` tracks. The API already supports this; the reported 403 occurs when downloading **paid** tracks without purchase, while the UI incorrectly shows a Download button anyway.

Fix by exposing `canDownload` on track detail (optional JWT), gating TrackPage download UI, and improving download error messaging. No database migration.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS, TypeORM, existing `OptionalJwtAuthGuard`, `TracksService.hasDownloadAccess`
- Client: React, TanStack Query, existing `TrackPage` + `useTrack`

**Storage**: PostgreSQL — existing `tracks`, `download_access` tables only

**Testing**: Manual quickstart VS-2201–VS-2204; optional unit test for `canDownload` computation

**Target Platform**: Web SPA + REST API

**Project Type**: Yarn monorepo — extend `api/src/modules/tracks/`, `client/src/pages/TrackPage.tsx`

**Performance Goals**: No extra API round-trip (field added to existing track detail)

**Constraints**: Paid downloads remain purchase-gated; JWT still required for download endpoint

**Scale/Scope**: ~4 files touched; small UX fix

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Extends existing `api/src/modules/tracks/` module (no new module)
- [x] No alternate backend/frontend roots
- [x] No schema changes — no migration
- [x] API uses `/api/v1/`, DTOs, guards, Swagger
- [x] Client uses TanStack Query + TrackPage
- [x] Payment/download_access logic unchanged in payments module

**Post-design re-check**: PASS — reuse only.

## Project Structure

### Documentation (this feature)

```text
specs/022-free-track-downloads/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── tracks-download-api.md
│   └── track-page-download-ui.md
└── tasks.md             # /speckit-tasks
```

### Source Code (changes)

```text
api/src/modules/tracks/
├── tracks.controller.ts   # OptionalJwt on GET :id; pass userId to findOne
├── tracks.service.ts    # findOne returns canDownload; toPublicTrack extended

client/src/
├── hooks/useTracks.ts   # Track type + canDownload
└── pages/TrackPage.tsx  # Gate download button; error state; sign-in CTA for free
```

**Structure Decision**: Minimal diff in tracks module + TrackPage; no new endpoints.

## Complexity Tracking

No constitution violations.

---

## Phase 0: Research ✅

See [research.md](./research.md) — all clarifications resolved:
- Free downloads: **yes** (authenticated)
- 403 root cause: paid track + UI bug
- Entitlement via `canDownload` on track detail

---

## Phase 1: Design ✅

| Artifact | Path |
|----------|------|
| Data model | [data-model.md](./data-model.md) |
| API contract | [contracts/tracks-download-api.md](./contracts/tracks-download-api.md) |
| UI contract | [contracts/track-page-download-ui.md](./contracts/track-page-download-ui.md) |
| Validation | [quickstart.md](./quickstart.md) |

---

## Implementation Outline (for /speckit-tasks)

1. **API**: `findOne(id, userId?)` → compute `canDownload` via `hasDownloadAccess`
2. **API**: Apply `OptionalJwtAuthGuard` to `GET /tracks/:id`; pass `req.user?.sub`
3. **Client**: Extend `Track` type with `canDownload?: boolean`
4. **Client**: TrackPage — show Download only when `canDownload`; sign-in link for FREE when logged out; `downloadError` state
5. **Validate**: VS-2201–VS-2204 from quickstart

**Estimated tasks**: ~8–10 (small feature)
