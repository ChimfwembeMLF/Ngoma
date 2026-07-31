# Data Model: Advanced Media Player & Playlists

## Entities

### 1. `Video` (api/src/modules/videos/entities/video.entity.ts)

**Modifications:**
- Add `externalUrl` (nullable string, up to 2048 chars).

```typescript
@Column({ name: 'external_url', length: 2048, nullable: true })
externalUrl?: string;
```

### 2. `PlaylistTrack` (api/src/modules/playlists/entities/playlist-track.entity.ts)

**Modifications:**
- The `position` column already exists as an integer. We will utilize this to sort tracks when returning playlists, and update it during reordering. No schema change needed, just ensuring we ORDER BY `position ASC`.
