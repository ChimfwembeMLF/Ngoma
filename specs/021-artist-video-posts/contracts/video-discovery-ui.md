# Contract: Video Discovery & Playback UI

**Feature**: 021-artist-video-posts

## Discover page

**File**: `client/src/pages/DiscoverPage.tsx`

- New section **"Videos"** below or after track sections
- Data: `GET /api/v1/discovery/videos/recent`
- Card component: thumbnail (or placeholder), title, artist name, duration badge
- Link: `/videos/:id`

## Video detail page

**File**: `client/src/pages/VideoPage.tsx`  
**Route**: `/videos/:id`

Layout:
- HTML5 `<video controls playsInline poster={thumbnailUrl}>` 
- Source: `/api/v1/videos/:id/stream` (via proxy or absolute API URL)
- Title, artist name (link to artist tracks), description
- Back link to Discover

## Artist public profile

- On artist track listing page or separate tab: list videos from `GET /api/v1/artists/:id/videos`
- MVP: add videos list section on existing artist public view if one exists, or link from TrackPage artist chip

## Empty states

- Discover: hide section if zero videos
- Artist with no videos: no section shown

## Mobile

- `playsInline` for iOS
- Full-width player, min height ~200px
