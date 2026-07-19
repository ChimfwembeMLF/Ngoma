# Contract: Payment Options API (UX Enriched)

**Feature**: 013-payment-forms-ux  
**Module**: `api/src/modules/payments/`  
**Base path**: `/api/v1/payments`

Extends `GET /mobile-money/options` from 001/011.

---

## GET /api/v1/payments/mobile-money/options

**Auth**: JWT (existing)

**Response**:

```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "id": "ZM",
        "iso2": "ZM",
        "name": "Zambia",
        "flag": "🇿🇲",
        "dialCode": "260",
        "currency": "ZMW",
        "phonePlaceholder": "97XXXXXXX",
        "enabled": true,
        "operators": [
          {
            "id": "zm-mtn",
            "displayName": "MTN Mobile Money",
            "shortName": "MTN"
          },
          {
            "id": "zm-airtel",
            "displayName": "Airtel Money",
            "shortName": "Airtel"
          },
          {
            "id": "zm-zamtel",
            "displayName": "Zamtel Kwacha",
            "shortName": "Zamtel"
          }
        ]
      }
    ],
    "defaultCountryId": "ZM"
  }
}
```

**Rules**:
- `pawapayCode` MUST NOT appear in operator objects
- Only `enabled: true` countries returned (MVP: Zambia only)
- Breaking change: response shape changes from array to `{ countries, defaultCountryId }` — update client hook

---

## POST /api/v1/payments/deposit

**Body** (extended):

```json
{
  "amount": 10,
  "currency": "ZMW",
  "operatorId": "zm-mtn",
  "countryId": "ZM",
  "phone": "0977123456",
  "purpose": "TRACK_DOWNLOAD",
  "itemId": "uuid"
}
```

**Validation**:
- Require `operatorId` OR legacy `provider` (not both empty)
- If `operatorId`: resolve to PawaPay correspondent; 400 if unknown
- If `countryId` omitted: default `ZM`
- `currency` should match country when omitted → default from country

**Legacy** (deprecated):

```json
{ "provider": "MTN_MOMO_ZMB", ... }
```

---

## POST /api/v1/payments/tip

Same `operatorId` / `countryId` / `phone` extensions as deposit.

---

## GET /api/v1/payments/history (P2 enrichment)

**Response item** (optional field):

```json
{
  "provider": "MTN_MOMO_ZMB",
  "providerDisplayName": "MTN Mobile Money"
}
```

Mapped server-side via `resolveOperatorByPawapayCode`.

---

## Error Messages (user-facing)

| Condition | Message |
|-----------|---------|
| Unknown operatorId | `Invalid mobile money operator` |
| Unknown countryId | `Country not supported for payments` |
| Missing operator | `Please select a mobile money provider` |

Do not expose PawaPay correspondent strings in error messages.
