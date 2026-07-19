# Contract: Payments UI (Checkout & Tips)

**Design system**: shadcn/ui + Spotify dark (009)

---

## Pages

| Path | Component | Flow |
|------|-----------|------|
| `/checkout/:trackId` | `CheckoutPage.tsx` | Provider + phone → deposit → status panel |
| `/tip/:artistId` | `TipArtistPage.tsx` | Preset/custom amount → deposit → status panel |
| `/purchases` | `PurchaseHistoryPage.tsx` | Lists payments with status + errors |

---

## CheckoutPage changes

- Validate phone required before pay (when config.pawapayEnabled)
- On COMPLETED: show link “Download track” → `/tracks/:id`
- On FAILED: show `PaymentStatusPanel` with retry → clears depositId, shows form again
- Display gateway error message from API when present

---

## TipArtistPage changes

- Same phone validation and retry pattern as checkout
- On COMPLETED: confirmation message + link back to artist/track

---

## PaymentStatusPanel changes

**Props**:

```typescript
type Props = {
  depositId: string;
  onComplete?: () => void;
  onRetry?: () => void;  // NEW — shown when status FAILED
};
```

**Polling**: `usePaymentStatus(depositId, true)` — 3s interval (unchanged)

---

## Hooks

| Hook | Purpose |
|------|---------|
| `usePaymentConfig()` | GET `/payments/config` — optional phone-required hint |
| `useInitiatePayment()` | unchanged contract |
| `usePaymentStatus()` | unchanged; surface errorMessage in response type |

---

## Regression

- Free tracks: no checkout route required
- PWYW min price validation unchanged
- Purchase history renders FAILED with error text when available
