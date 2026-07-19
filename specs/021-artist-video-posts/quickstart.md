# Quickstart: 021-artist-video-posts

**Purpose**: Validate artist video upload, publish, discovery, and playback.

**Prerequisites**:
- Postgres + API (4001) + client (5173)
- Artist account with profile
- Sample MP4 file (< 200 MB) for upload

---

## Setup

```bash
yarn workspace @ngoma/api migrations:run
yarn workspace @ngoma/api dev
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-2101: Artist upload and publish

1. Sign in as artist → `/artist/dashboard`
2. Open **Post video** wizard
3. Enter title, select MP4, publish
4. **Expected**: Video appears in "Your videos" list with Published status

```bash
# After login, get artist JWT
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test clip"}' \
  http://localhost:4001/api/v1/videos | jq .
```

Upload (replace VIDEO_ID and file path):

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -F "video=@/path/to/sample.mp4" \
  http://localhost:4001/api/v1/videos/VIDEO_ID/upload | jq .
```

Publish:

```bash
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isPublished":true}' \
  http://localhost:4001/api/v1/videos/VIDEO_ID | jq .
```

### VS-2102: Watch video

1. Open `/videos/VIDEO_ID` (logged out OK)
2. **Expected**: Player loads; video plays

```bash
curl -sI http://localhost:4001/api/v1/videos/VIDEO_ID/stream | grep -i content-type
# Expected: video/mp4 or video/webm
```

### VS-2103: Discover videos

1. Open `/discover`
2. **Expected**: "Videos" section shows published clip

```bash
curl -s http://localhost:4001/api/v1/discovery/videos/recent | jq '.data | length'
```

### VS-2104: Manage video

1. Artist unpublishes or deletes video
2. **Expected**: Removed from discover; stream returns 404

---

## Regression

- Track upload/publish still works (VS-1101 track flow from MVP quickstart)
- Artist dashboard loads with both track and video forms

---

## Validation Results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-2101 | Implemented | Upload wizard on `/artist/dashboard`; API `POST /videos`, upload, publish |
| VS-2102 | Implemented | `/videos/:id` with HTML5 player; stream at `/api/v1/videos/:id/stream` |
| VS-2103 | Implemented | Discover "Videos" section; `GET /discovery/videos/recent`; artist videos on TrackPage |
| VS-2104 | Implemented | Edit/unpublish/delete on dashboard; soft delete + unpublish hide from discover |
| Regression | Pass | API + client build; migration `CreateVideos1719000000014` applied |

---

## References

- [contracts/videos-api.md](./contracts/videos-api.md)
- [contracts/video-upload-ui.md](./contracts/video-upload-ui.md)
- [contracts/video-discovery-ui.md](./contracts/video-discovery-ui.md)
- [data-model.md](./data-model.md)
