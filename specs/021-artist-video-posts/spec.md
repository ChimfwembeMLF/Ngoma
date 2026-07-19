# Feature Specification: Artist Video Posts

**Feature Branch**: `021-artist-video-posts`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "can artists post videos too add that"

**Depends on**: `001-platform-mvp` (auth, artist profiles, media upload), `018-break-down-long-forms` (FormWizard patterns)

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Artist Uploads and Publishes a Video (Priority: P1)

A signed-in artist uploads a video file with title and description, saves as draft or publishes immediately, and sees it on their dashboard.

**Why this priority**: Without upload + publish, no video content exists on the platform.

**Independent Test**: VS-2101 — artist creates video metadata, uploads MP4, publishes → video appears on artist dashboard list.

**Acceptance Scenarios**:

1. **Given** a signed-in artist, **When** they submit title + video file, **Then** a draft video is created with stored file URL.
2. **Given** a draft video, **When** the artist publishes, **Then** `isPublished: true` and `isDraft: false`.
3. **Given** unsupported format or file over size limit, **When** upload attempted, **Then** 400 with clear validation message.

---

### User Story 2 — Watch Published Video (Priority: P1)

Listeners and visitors open a published video page and play it in-browser via HTML5 video player.

**Why this priority**: Upload without playback delivers no fan value.

**Independent Test**: VS-2102 — public GET video detail + stream endpoint returns playable MP4 for published video.

**Acceptance Scenarios**:

1. **Given** a published video, **When** visitor opens `/videos/:id`, **Then** title, artist, and player render.
2. **Given** unpublished video, **When** non-owner requests detail, **Then** 404.
3. **Given** valid stream request, **When** browser loads video, **Then** Content-Type is `video/mp4` or `video/webm`.

---

### User Story 3 — Discover and Artist Profile Videos (Priority: P2)

Published videos appear in discovery (dedicated section) and on the artist public profile alongside tracks.

**Why this priority**: Distribution completes the content loop after upload + playback.

**Independent Test**: VS-2103 — discover shows recent videos; artist page lists artist's published videos.

**Acceptance Scenarios**:

1. **Given** published videos exist, **When** user opens Discover, **Then** "Videos" section shows recent uploads.
2. **Given** artist with videos, **When** visitor opens artist tracks page area, **Then** published videos are listed.
3. **Given** search (future), **When** querying video title, **Then** video appears in results (Phase 2 — optional basic title search in MVP if low cost).

---

### User Story 4 — Manage Videos (Priority: P2)

Artists edit metadata, unpublish, or delete their videos from the dashboard.

**Independent Test**: VS-2104 — artist updates title, unpublishes, deletes draft.

**Acceptance Scenarios**:

1. **Given** artist owns video, **When** they update title/description, **Then** changes persist.
2. **Given** published video, **When** artist unpublishes, **Then** hidden from public discovery.
3. **Given** artist owns video, **When** they delete, **Then** video removed and file inaccessible.

---

## Out of Scope (This Feature)

- Video monetization (purchase, PWYW, tips tied to video)
- Server-side transcoding, HLS/DASH adaptive streaming
- YouTube/Vimeo embed-only posts
- Live streaming
- Video comments/likes (future social layer)
- Album association for videos

## Requirements *(mandatory)*

### Functional Requirements

- **FR-2101**: New `videos` module with CRUD for artist-owned videos.
- **FR-2102**: Video file upload via extended `MediaService` (MP4, WebM; max 200 MB MVP).
- **FR-2103**: Optional thumbnail/cover image upload (reuse image pipeline).
- **FR-2104**: Public stream endpoint for published videos (`GET /api/v1/videos/:id/stream`).
- **FR-2105**: Artist dashboard upload form (FormWizard, mirror track upload UX).
- **FR-2106**: Discover page "Videos" section + `VideoPage` with HTML5 player.
- **FR-2107**: TypeORM migration for `videos` table.

### Success Criteria

- **SC-2101**: Artist can publish a video end-to-end in under 5 minutes (excluding upload time).
- **SC-2102**: Published video plays in Chrome/Safari mobile without external player.
- **SC-2103**: Unpublished videos not visible on discover or public artist listing.

## Assumptions

- Videos are **free to watch** in MVP (promotional/behind-the-scenes content).
- Single-file upload; no multi-part resumable upload in v1.
- Storage uses existing S3/local pattern from `MediaService`.
- Duration extracted client-side or via optional metadata parse (0 allowed if unknown).
