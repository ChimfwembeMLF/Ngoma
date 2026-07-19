# Data Model: Free Track Downloads & Download Access UX

**Feature**: 022-free-track-downloads

No schema migrations required. This feature extends API response shape and client UX using existing entities.

---

## Existing Entities (unchanged)

### Track (`tracks`)

| Field | Relevance |
|-------|-----------|
| `pricingType` | `FREE` → download without access; `SET_PRICE` / `PAY_WHAT_YOU_WANT` → require access |
| `isPublished` | Download only when published |
| `isActive` | Soft-deleted tracks not downloadable |
| `audioFileUrl` | Required for download stream |
| `downloads` | Incremented on successful download |

### DownloadAccess (`download_access`)

| Field | Relevance |
|-------|-----------|
| `userId` + `trackId` | Unique entitlement for paid download |
| `expiresAt` | Optional; null = no expiry |
| `downloadCount` | Incremented per download |

---

## Computed / API-only fields

### TrackDetail.canDownload

| Property | Type | When present |
|----------|------|--------------|
| `canDownload` | `boolean` | Always in `GET /api/v1/tracks/:id` response |

**Computation** (server-side):

```text
if not authenticated:
  canDownload = false
else if track.pricingType === FREE:
  canDownload = true
else:
  canDownload = hasDownloadAccess(userId, trackId)
```

---

## State transitions

```text
FREE track + signed in     → canDownload=true  → download OK
FREE track + anonymous     → canDownload=false → sign in CTA
Paid track + no access     → canDownload=false → buy CTA only
Paid track + access        → canDownload=true  → download OK
Paid track + expired access → canDownload=false → buy again (future)
```

---

## Validation rules

- Download endpoint unchanged: JWT required.
- `canDownload` is advisory for UI; download endpoint remains authoritative (403 if entitlement missing).
