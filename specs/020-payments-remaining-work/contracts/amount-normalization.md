# Contract: Payment Amount Normalization

**Feature**: 020-payments-remaining-work  
**Phase**: A (P1)

## Rule

Before `postPawaPayDeposit()`, `PaymentsService` MUST normalize amount using catalog metadata.

## Catalog field (new)

```typescript
decimalsInAmount: 'NONE' | 'TWO';
```

| decimalsInAmount | Currencies (this feature) | Normalization |
|------------------|---------------------------|---------------|
| `NONE` | XOF, XAF, RWF, UGX | Floor to integer; reject if < 1 after floor |
| `TWO` | ZMW, KES, USD, CDF, SLE | Round to 2 decimal places |

## Function signature

```typescript
// api/src/modules/payments/payment-amount.util.ts
export function normalizePaymentAmount(
  amount: number,
  decimalsInAmount: 'NONE' | 'TWO',
): { amount: number; amountString: string };
```

- `amountString` is what PawaPay receives (e.g. `"500"` or `"10.50"`)
- Persist normalized `amount` on `Payment` entity

## Client behavior (recommended)

- For `NONE` currencies: step=1 on amount inputs, helper text "Whole amounts only"
- PWYW min/max validation uses normalized bounds

## Error responses

| Case | HTTP | Message |
|------|------|---------|
| Amount < minimum after normalize | 400 | Amount too low for {currency} |
| Non-numeric amount | 400 | Invalid amount |

## Examples

| Input | Currency | Output string |
|-------|----------|---------------|
| 500.75 | XOF | `"500"` |
| 10.555 | ZMW | `"10.56"` |
| 0.50 | XOF | 400 (below minimum) |

See [multi-country-catalog.md](./multi-country-catalog.md) for per-country assignment.
