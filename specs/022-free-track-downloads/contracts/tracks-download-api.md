# Contract: Track Download API

**Feature**: 022-free-track-downloads

---

## GET /api/v1/tracks/:id

**Auth**: Optional JWT (`OptionalJwtAuthGuard`)

**Response** — extends existing public track shape:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "pricingType": "FREE | SET_PRICE | PAY_WHAT_YOU_WANT",
    "price": 10,
    "minPrice": null,
    "canDownload": true
  }
}
```

| Field | Type | Rules |
|-------|------|-------|
| `canDownload` | boolean | `true` when authenticated AND (FREE OR valid download_access) |

---

## GET /api/v1/tracks/:id/download

**Auth**: Bearer JWT (required)

**Behavior**:

| pricingType | Access | Status |
|-------------|--------|--------|
| FREE | none needed | 200 — audio attachment |
| SET_PRICE / PWYW | valid download_access | 200 — audio attachment |
| SET_PRICE / PWYW | missing/expired access | 403 — `Purchase required to download` |

**Headers (success)**:
- `Content-Type: audio/mpeg` (or detected type)
- `Content-Disposition: attachment; filename="{title}.mp3"`

**Errors**:

| Status | Message |
|--------|---------|
| 401 | Unauthorized (no/invalid token) |
| 403 | Purchase required to download |
| 404 | Track not found / Audio not available |

---

## Service reuse

`TracksService.hasDownloadAccess(userId, trackId)` — existing method, no signature change.
