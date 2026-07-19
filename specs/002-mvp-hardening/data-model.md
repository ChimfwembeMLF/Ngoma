# Data Model: 002-mvp-hardening

**Date**: 2026-07-19

**Base**: Extends entities from `specs/001-platform-mvp/data-model.md`

## Changes

### Track (`tracks`) — extended

| Field | Type | Notes |
|-------|------|-------|
| duration | integer | **Behavior change**: populated from `music-metadata` on audio upload (seconds, rounded) |
| search_vector | tsvector | **New** — FTS index; built from title + genre + artist name |

**Population rules**:
- `duration`: set when `audio` file uploaded; unchanged on metadata-only updates unless re-upload
- `search_vector`: updated on track create/update/publish and when artist name changes (via track save or batch refresh)

**Migration**: `1719000000004-TrackSearchFts.ts`
```sql
ALTER TABLE tracks ADD COLUMN search_vector tsvector;
CREATE INDEX idx_tracks_search ON tracks USING GIN(search_vector);
-- Backfill existing rows via UPDATE joining artists
```

### User (`users`) — unchanged schema

Admin UI reads existing fields: `id`, `email`, `fullName`, `role`, `isActive`, `createdAt`, `lastLogin`.

**Business rule**: Admin cannot deactivate own account (enforced in `AdminService`).

## Indexes (added)

- `idx_tracks_search` GIN on `tracks(search_vector)`

## Deferred

- Content reports / moderation entities — post-MVP
- Separate `artist_search_vector` — artist name folded into track vector for MVP
