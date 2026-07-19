# Contract: Videos API

**Feature**: 021-artist-video-posts

## Artist routes (JwtAuthGuard + ARTIST role)

### Create video (metadata)

**POST** `/api/v1/videos`

Body:

```json
{
  "title": "Studio session",
  "description": "Behind the scenes"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Studio session",
    "isDraft": true,
    "isPublished": false
  }
}
```

### Upload video file

**POST** `/api/v1/videos/:id/upload`  
`multipart/form-data`: `video` (required), `thumbnail` (optional)

Validation:
- Video: `.mp4`, `.webm`, max 200 MB
- Thumbnail: same rules as track cover (5 MB, jpg/png/webp)

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "videoFileUrl": "/uploads/videos/...",
    "thumbnailUrl": "/uploads/images/...",
    "duration": 0
  }
}
```

### List own videos

**GET** `/api/v1/videos/mine`

### Update video

**PUT** `/api/v1/videos/:id`

Body: `{ "title?", "description?", "isPublished?" }`

Publish requires `videoFileUrl` set.

### Delete video

**DELETE** `/api/v1/videos/:id`  
Soft delete: `isActive: false`

---

## Public routes

### Get published video

**GET** `/api/v1/videos/:id`

Returns 404 if not published or inactive. Owner may read own draft when authenticated (optional MVP).

### Stream video

**GET** `/api/v1/videos/:id/stream`

Returns `StreamableFile` with `Content-Type: video/mp4` or `video/webm`.  
Only published + active videos.

### Artist public videos

**GET** `/api/v1/artists/:id/videos`

Published videos for artist profile.

---

## Discovery

**GET** `/api/v1/discovery/videos/recent?limit=20`

Published videos ordered by `createdAt DESC`, includes artist name.

---

## Error responses

| Case | HTTP | Message |
|------|------|---------|
| Missing video file on publish | 400 | Video file required before publishing |
| Unsupported format | 400 | Unsupported video format |
| File too large | 400 | Video file exceeds 200 MB limit |
| Not owner | 403 | Forbidden |
| Not found | 404 | Video not found |
