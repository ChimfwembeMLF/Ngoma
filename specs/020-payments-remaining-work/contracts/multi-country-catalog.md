# Contract: Multi-Country Payment Catalog

**Feature**: 020-payments-remaining-work  
**Phase**: A (P1)  
**Supersedes**: 013 assumption of Zambia-only MVP

## Source of truth

`api/src/modules/payments/payment-countries.ts` — static catalog, no runtime PawaPay fetch.

## Public API

**GET** `/api/v1/payments/mobile-money/options`

Returns array of enabled countries with operators (no `pawapayCode` in public DTO).

### Expected catalog (14 entries)

| id | Country | Currency | Operators (PawaPay codes) |
|----|---------|----------|---------------------------|
| BJ | Benin | XOF | MOOV_BEN, MTN_MOMO_BEN |
| CM | Cameroon | XAF | MTN_MOMO_CMR, ORANGE_CMR |
| CI | Côte d'Ivoire | XOF | MTN_MOMO_CIV, ORANGE_CIV, MOOV_CIV |
| CD | DR Congo | CDF | AIRTEL_COD, ORANGE_COD, VODACOM_COD |
| CD_USD | DR Congo (USD) | USD | AIRTEL_COD, ORANGE_COD, VODACOM_COD |
| GA | Gabon | XAF | AIRTEL_GAB |
| KE | Kenya | KES | MPESA_KEN |
| CG | Congo | XAF | AIRTEL_COG |
| RW | Rwanda | RWF | MTN_MOMO_RWA, AIRTEL_RWA |
| SN | Senegal | XOF | ORANGE_SEN, WAVE_SEN |
| SL | Sierra Leone | SLE | ORANGE_SLE |
| UG | Uganda | UGX | MTN_MOMO_UGA, AIRTEL_UGA |
| ZM | Zambia | ZMW | MTN_MOMO_ZMB, AIRTEL_OAPI_ZMB, ZAMTEL_ZMB |

Codes must match [PawaPay providers](https://docs.pawapay.io/v2/docs/providers).

## Deposit request mapping

**POST** `/api/v1/payments/deposit`

| Client field | Gateway field |
|--------------|---------------|
| `provider` | PawaPay `correspondent` |
| `currency` | From selected country |
| `phone` | Normalized MSISDN with country dial code |

## Client surfaces

- `CheckoutPage` — country/operator from `usePaymentOptions()`
- `TipArtistPage` — same
- `AuthPage` register Profile step — country select + dial prefix

## Validation

- Disabled countries (`enabled: false`) excluded from API response
- Unknown `provider` → 400 Bad Request

See [amount-normalization.md](./amount-normalization.md) for currency rules.
