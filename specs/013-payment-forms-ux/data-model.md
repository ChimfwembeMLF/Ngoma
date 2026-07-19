# Data Model: 013-payment-forms-ux

**Feature**: Payment forms UX — countries, flags, operators

## Database Changes

**None.** Payment entity `provider` column continues storing resolved PawaPay correspondent code after deposit/tip.

## Code-Defined Catalog

### PaymentCountry (extended)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable id e.g. `ZM` |
| `iso2` | string | ISO 3166-1 alpha-2 e.g. `ZM` |
| `name` | string | Display name e.g. `Zambia` |
| `flag` | string | Unicode emoji e.g. `🇿🇲` |
| `dialCode` | string | Without + e.g. `260` |
| `currency` | string | ISO 4217 e.g. `ZMW` |
| `phonePlaceholder` | string | e.g. `97XXXXXXX` |
| `enabled` | boolean | Available for selection |
| `operators` | MobileOperator[] | Enabled operators for country |

### MobileOperator

| Field | Type | Client-visible | Description |
|-------|------|----------------|-------------|
| `id` | string | ✓ | Slug e.g. `zm-mtn` |
| `displayName` | string | ✓ | e.g. `MTN Mobile Money` |
| `shortName` | string | ✓ | e.g. `MTN` |
| `pawapayCode` | string | ✗ | Internal only e.g. `MTN_MOMO_ZMB` |

## Resolution Functions

```text
resolveOperator(operatorId) → { pawapayCode, displayName, countryId }
resolveOperatorByPawapayCode(code) → operator (for history labels)
resolveCountry(countryId) → PaymentCountry
```

## API Request Flow

```text
Client: { operatorId: "zm-mtn", phone: "0977123456", countryId: "ZM", ... }
  → resolveOperator("zm-mtn") → pawapayCode "MTN_MOMO_ZMB"
  → normalizeMobileMoneyPhone("260", phone)
  → postPawaPayDeposit({ correspondent: "MTN_MOMO_ZMB", ... })
  → Payment.provider = "MTN_MOMO_ZMB"
```

## Legacy Path

```text
Client: { provider: "MTN_MOMO_ZMB", ... }  (deprecated)
  → pass-through to gateway (backward compat)
```

## Payment Entity (unchanged)

| Column | Notes |
|--------|-------|
| `provider` | Stores PawaPay correspondent after resolution |
| `currency` | From country catalog or DTO |

Optional future: add `operator_id` column — **out of scope** for 013; display via reverse lookup from `provider`.
