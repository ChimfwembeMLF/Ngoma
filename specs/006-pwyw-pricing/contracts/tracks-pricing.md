# Contract: Track Pricing API

**Module**: `api/src/modules/tracks/`  
**Base path**: `/api/v1/tracks`

---

## PricingType enum

```typescript
'SET_PRICE' | 'PAY_WHAT_YOU_WANT' | 'FREE'
```

---

## POST /api/v1/tracks (create)

**Auth**: JWT + ARTIST

**Body** (pricing-relevant fields):

```json
{
  "title": "My Track",
  "genre": "Afrobeats",
  "pricingType": "PAY_WHAT_YOU_WANT",
  "minPrice": 5.0
}
```

| pricingType | Required fields | Forbidden fields |
|-------------|-----------------|------------------|
| SET_PRICE | `price` ≥ 0.01 | `minPrice` |
| PAY_WHAT_YOU_WANT | `minPrice` ≥ 0.01 | `price` |
| FREE | neither | `price`, `minPrice` |

**Response** `data` includes `pricingType`, `price`, `minPrice`.

---

## PUT /api/v1/tracks/:id (update)

Same validation as create when `pricingType` is provided. Changing type clears incompatible field:

- → SET_PRICE: set `price`, clear `minPrice`
- → PAY_WHAT_YOU_WANT: set `minPrice`, clear `price`
- → FREE: clear both

---

## GET /api/v1/tracks/:id (public)

**Response pricing fields**:

```json
{
  "pricingType": "PAY_WHAT_YOU_WANT",
  "price": null,
  "minPrice": 5.0
}
```

---

## GET /api/v1/tracks (discover) / GET /api/v1/tracks/mine

Each track object includes `pricingType`, `price`, `minPrice` per rules above.

---

## Error responses

| Code | Condition |
|------|-----------|
| 400 | PWYW without minPrice, SET_PRICE without price, minPrice < 0.01 |
| 403 | Non-owner update |
| 404 | Track not found |
