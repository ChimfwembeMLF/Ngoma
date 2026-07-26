# Contract: Ad Session & Download API

**Feature**: 023-ad-supported-free-downloads

---

## GET /api/v1/platform/ads/config

**Auth**: Public

**Response**:
```json
{
  "success": true,
  "data": {
    "adsEnabled": true,
    "gateSeconds": 5
  }
}
```

---

## POST /api/v1/tracks/:trackId/ad-session

**Auth**: Bearer JWT

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "gateSeconds": 5,
    "creative": {
      "id": "uuid",
      "title": "Upgrade to Pro",
      "imageUrl": "/uploads/...",
      "clickUrl": "https://..."
    }
  }
}
```

Picks random active creative; creates `AdSession` with `PENDING`.

---

## POST /api/v1/ad-sessions/:sessionId/complete

**Auth**: Bearer JWT (must own session)

**Behavior**: Validates `createdAt + gateSeconds <= now`; sets `COMPLETED`; creates `AdImpression`.

**Errors**: `400` too early; `403` wrong user; `410` expired

---

## GET /api/v1/tracks/:id/download (extended)

**Auth**: Bearer JWT

| pricingType | X-Ad-Session-Id | adsEnabled | Result |
|-------------|-----------------|------------|--------|
| FREE | valid COMPLETED session | true | 200 |
| FREE | missing/invalid | true | 403 Ad completion required |
| FREE | — | false | 200 (022 behavior) |
| SET_PRICE / PWYW | — | — | existing access rules |

**Header**: `X-Ad-Session-Id: {sessionId}`

On success for FREE+ad: mark session consumed (optional: one-time use flag).

---

## Admin: CRUD /api/v1/admin/ads/creatives

**Auth**: Admin JWT

Standard list/create/update/delete for `AdCreative`.

## Admin: PUT /api/v1/admin/ads/config

**Body**: `{ adsEnabled?: boolean, gateSeconds?: number }`
