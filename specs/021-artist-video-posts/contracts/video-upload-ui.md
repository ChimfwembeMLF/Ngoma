# Contract: Video Upload UI

**Feature**: 021-artist-video-posts  
**Location**: `client/src/components/videos/VideoUploadForm.tsx`

## Surfaces

- **Artist dashboard** — section below or beside track upload
- Reuses **FormWizard** (feature 018)

## Wizard steps

| Step | Label | Fields | Validation |
|------|-------|--------|------------|
| 1 | Details | Title (required), Description (optional) | Title non-empty |
| 2 | Video | Video file input (`accept="video/mp4,video/webm"`), optional thumbnail | File required before submit |
| 3 | Publish | Summary + "Save draft" / "Publish" | Video uploaded |

## Behavior

- On complete (publish): `POST /videos` → `POST /videos/:id/upload` → `PUT /videos/:id { isPublished: true }`
- On save draft: same without final publish flag
- Show upload progress / pending state during multipart upload
- Max size hint: "MP4 or WebM, max 200 MB"
- Error display inline (match TrackUploadForm)

## Hooks

`useVideos.ts`:
- `useCreateVideo`
- `useUploadVideoFiles`
- `useUpdateVideo`
- `useMyVideos`

## Accessibility

- File input labeled
- Video preview optional after file selected (client-side `URL.createObjectURL`)
