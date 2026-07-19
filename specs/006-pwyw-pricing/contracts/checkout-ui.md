# Contract: PWYW Client UI

**Design system**: Reuse 003/004 tokens (`Card`, `Input`, `Button`, `buttonVariants`)

---

## TrackUploadForm

**Location**: `client/src/components/tracks/TrackUploadForm.tsx`

**Pricing selector** (radio or segmented control):

| Option | Visible field | Default |
|--------|---------------|---------|
| Set price | Price (ZMW) number input | 10 |
| Pay what you want | Minimum price (ZMW) number input | 1 |
| Free | none | — |

**Submit**: Pass `pricingType` and `price` or `minPrice` to create track API.

---

## TrackPage

**Location**: `client/src/pages/TrackPage.tsx`

| pricingType | Primary CTA |
|-------------|---------------|
| SET_PRICE | `Buy · ZMW {price}` → `/checkout/:id` |
| PAY_WHAT_YOU_WANT | `Pay what you want · from ZMW {minPrice}` → `/checkout/:id` |
| FREE | `Download free` (existing) |

`isPaid` logic expands to: `SET_PRICE || PAY_WHAT_YOU_WANT`.

---

## CheckoutPage

**Location**: `client/src/pages/CheckoutPage.tsx`

### SET_PRICE (unchanged)

- Show fixed price in summary card
- Pay button uses `track.price`

### PAY_WHAT_YOU_WANT (new)

- Summary card: track title + "Pay what you want · minimum ZMW {minPrice}"
- **Amount input**: number, min=`minPrice`, step=0.01, default=`minPrice`
- Client validation: block submit if amount < minPrice
- Pay button sends chosen amount to `initiateDeposit`

---

## TrackCard (discover)

**Location**: `client/src/components/ui/TrackCard.tsx`

| pricingType | Price label |
|-------------|-------------|
| FREE | `Free` |
| SET_PRICE | `ZMW {price}` |
| PAY_WHAT_YOU_WANT | `PWYW from ZMW {minPrice}` |

---

## Hooks

**`useTracks.ts`**: Extend `Track` type:

```typescript
pricingType: 'SET_PRICE' | 'PAY_WHAT_YOU_WANT' | 'FREE';
minPrice?: number | null;
```

No new hooks required — existing create/update/payment hooks reused.

---

## Regression

- Artist dashboard upload + track list (004/005) still work
- Purchase history shows PWYW amount paid
- Analytics dashboard reflects PWYW earnings (005)
