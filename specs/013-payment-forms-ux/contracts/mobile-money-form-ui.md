# Contract: Mobile Money Form UI

**Feature**: 013-payment-forms-ux  
**Component**: `client/src/components/payments/MobileMoneyForm.tsx`

## Used On

- `client/src/pages/CheckoutPage.tsx`
- `client/src/pages/TipArtistPage.tsx`

## Layout

```text
┌─────────────────────────────────────────┐
│ Country                                 │
│ [🇿🇲 Zambia · ZMW              ▼]      │  (Select or static when one country)
├─────────────────────────────────────────┤
│ Pay with Mobile Money                   │
│ ┌─────────────────────────────────────┐ │
│ │ 📱 MTN Mobile Money            ◉   │ │
│ ├─────────────────────────────────────┤ │
│ │ 📱 Airtel Money                ○   │ │
│ ├─────────────────────────────────────┤ │
│ │ 📱 Zamtel Kwacha               ○   │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Mobile number *                         │
│ [+260] [ 97XXXXXXX                    ] │
└─────────────────────────────────────────┘
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `countries` | `PaymentCountry[]` | From options API |
| `defaultCountryId` | string | Initial country |
| `pawapayEnabled` | boolean | Phone required when true |
| `value` | `{ countryId, operatorId, phone }` | Controlled state |
| `onChange` | `(value) => void` | State updates |
| `disabled` | boolean | During submit |

## OperatorOption Row

- `displayName` as primary text
- Radio indicator (shadcn RadioGroup or custom)
- `aria-pressed` / `role="radio"` for accessibility
- Selected row: `border-primary bg-muted/50`

## Country Select

- Trigger shows: `{flag} {name} · {currency}`
- When single country: read-only badge (no misleading dropdown)

## Phone Field

- Prefix span: `+{dialCode}` non-editable
- Input: local number only
- Error: "Phone number is required for mobile money payment"

## Submission Contract

Parent pages call initiate mutations with:

```typescript
{
  operatorId: value.operatorId,
  countryId: value.countryId,
  phone: value.phone,
  currency: country.currency,
  // amount, purpose, itemId — page-specific
}
```

**Never** pass `provider: 'MTN_MOMO_ZMB'` from client after migration.

## Loading / Empty States

- Loading: skeleton or "Loading payment options…"
- Empty operators: disable pay button + message "Mobile money unavailable"

## Out of Scope

- Operator brand logos (PNG/SVG)
- QR / USSD instructions beyond existing status panel
