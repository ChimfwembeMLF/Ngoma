# Research: Artist Video Posts

**Feature**: 021-artist-video-posts  
**Date**: 2026-07-19

## Gap Analysis

| Area | Current state | Needed |
|------|---------------|--------|
| Content types | Audio tracks only (`tracks` table) | Video entity + upload/stream |
| MediaService | `saveAudio`, `saveImage` | `saveVideo` with format/size validation |
| Artist dashboard | `TrackUploadForm` only | `VideoUploadForm` |
| Discovery | Tracks trending/new/search | Videos section + detail page |
| Monetization | Tracks support PWYW/price | Videos free in MVP |

## Decision: Separate `videos` module (not extend `tracks`)

**Decision**: New `api/src/modules/videos/` with `Video` entity — do not add `contentType` to tracks.

**Rationale**: Tracks have pricing, download access, earnings, and audio-specific fields. Videos MVP is free-to-watch with different stream UX. Separate module matches constitution module-first pattern and avoids polluting track queries.

**Alternatives considered**:

| Alternative | Rejected because |
|-------------|------------------|
| Polymorphic `content_items` table | Over-engineered for two types |
| `tracks` + `mediaType` column | Conflates payment/download logic with free video |
| External embed only (YouTube) | User asked to post videos on Ngoma, not link out |

## Decision: Direct upload + stream (no transcoding)

**Decision**: Store uploaded MP4/WebM as-is; stream via existing `MediaService.openReadStream` pattern (same as audio).

**Rationale**: Transcoding (FFmpeg, HLS) adds infra complexity. MVP artists upload web-ready MP4. Range requests nice-to-have post-MVP.

**Alternatives considered**: Mux/Cloudflare Stream — rejected for cost and scope.

## Decision: File limits and formats

**Decision**:

| Constraint | Value |
|------------|-------|
| Formats | `.mp4`, `.webm` |
| Max size | 200 MB |
| Thumbnail | Optional JPEG/PNG/WebP via existing `saveImage` |
| Duration | Optional; client `HTMLVideoElement` or 0 if unknown |

**Rationale**: 200 MB covers short promo clips on mobile networks; aligns below typical S3 multipart needs for MVP.

## Decision: Discovery integration

**Decision**: Add `GET /api/v1/discovery/videos/recent` and Discover page section; artist public videos via `GET /api/v1/artists/:id/videos`.

**Rationale**: Minimal new surface; reuses discovery module pattern without merging video into track FTS initially.

## Decision: UI patterns

**Decision**: Reuse `FormWizard` from feature 018; `VideoUploadForm` on artist dashboard; new `VideoPage` with native `<video controls>`.

**Rationale**: Consistent artist UX; no new video library required for MVP.

## References

- `api/src/modules/tracks/` — upload/publish/stream pattern to mirror
- `api/src/modules/media/media.service.ts` — extend for video
- `client/src/components/tracks/TrackUploadForm.tsx` — wizard reference
