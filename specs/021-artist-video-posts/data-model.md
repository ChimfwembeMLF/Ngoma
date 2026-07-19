# Data Model: Artist Video Posts

**Feature**: 021-artist-video-posts

## New entity: Video (`videos`)

| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| artist_id | uuid | FK → artists |
| title | varchar | Required |
| description | text | Optional |
| video_file_url | varchar | Required after upload |
| thumbnail_url | varchar | Optional |
| duration | integer | Seconds; 0 if unknown |
| is_published | boolean | Default false |
| is_draft | boolean | Default true |
| is_active | boolean | Soft delete → false |
| views | bigint | Default 0 (increment on stream optional MVP) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Indexes

- `idx_videos_artist_published` on `(artist_id, is_published, created_at DESC)`
- `idx_videos_published_recent` on `(is_published, created_at DESC)` where published

## Relationships

```
Artist 1 ── * Video
```

No relationship to tracks, albums, payments, or download_access in MVP.

## State transitions

```
Create (draft) → Upload file → Publish
Publish → Unpublish (draft again or isPublished false)
Active → Soft delete (is_active false)
```

## Migration

New table `videos` — see `api/database/migrations/<timestamp>-CreateVideos.ts`

## Media storage paths

| Type | Storage folder | Public URL pattern |
|------|----------------|-------------------|
| Video | `videos/` | `/uploads/videos/...` or S3 URL |
| Thumbnail | `images/` | Same as track cover art |

## Validation rules

- `title`: 1–200 chars
- `video_file_url`: required before publish
- Publish blocked if no `video_file_url`
- Only owning artist may update/delete

## Out of scope entities

- VideoPurchase, VideoEarnings — no monetization in MVP
- VideoComment — future
