# Contract: Production Rollout

**Feature**: 020-payments-remaining-work  
**Phase**: A (P1)

## Environment variables

| Variable | Required (prod) | Description |
|----------|-----------------|-------------|
| `PAWAPAY_ENV` | Yes | `production` |
| `PAWAPAY_PRODUCTION_API_TOKEN` | Yes | Bearer token from PawaPay dashboard |
| `PAWAPAY_BASE_URL_PROD` | Yes | `https://api.pawapay.io/v2` |
| `PAWAPAY_WEBHOOK_URL` | Yes | Public HTTPS URL → `/api/v1/payments/webhook` |
| `PAWAPAY_PUBLIC_KEY_ID` | Recommended | Webhook signature verification |
| `PAWAPAY_PRIVATE_KEY` | Recommended | Signing key material |
| `PAYMENTS_DEV_AUTO_COMPLETE` | Yes | Must be `false` in production |

Legacy aliases (`PAWAPAY_ENVIRONMENT`, `PAWAPAY_API_TOKEN`) may still resolve — prefer canonical names above.

## PawaPay dashboard checklist

1. Register webhook URL matching `PAWAPAY_WEBHOOK_URL`
2. Confirm merchant countries match catalog (13 countries, 14 entries with DRC USD)
3. Use production test MSISDN per country before live traffic

## Config health endpoint

**GET** `/api/v1/payments/config` (public)

Response must include:

```json
{
  "data": {
    "pawapayEnabled": true,
    "environment": "production",
    "devAutoComplete": false,
    "webhookUrlConfigured": true
  }
}
```

## Security

- Rotate token if exposed in logs, chat, or git
- Never commit tokens to repository
- HTTPS required for webhook URL in production

## Failure modes

| Condition | User-facing behavior |
|-----------|---------------------|
| Invalid token | 502/503 with generic "Payment service unavailable" |
| Webhook not registered | Poll may show PENDING indefinitely until timeout → FAILED |
| USSD not approved | Status FAILED with "Payment was not completed" copy |

See [quickstart.md](../quickstart.md) VS-2001.
