# Contract: PawaPay Environment Configuration

**Scope**: `api/.env`, `api/.env.example`, deployment secrets

---

## Required variables (sandbox development)

```env
# =====================
# Payments (Mobile Money)
# =====================
PAYMENTS_DEV_AUTO_COMPLETE=false
PAWAPAY_ENV=sandbox
PAWAPAY_API_TOKEN=<sandbox JWT token>
PAWAPAY_BASE_URL_SANDBOX=https://api.sandbox.pawapay.io/v2
PAWAPAY_BASE_URL_PROD=https://api.pawapay.io/v2
PAWAPAY_WEBHOOK_URL=http://localhost:4001/api/v1/payments/webhook
```

## Production additions

```env
NODE_ENV=production
PAWAPAY_ENV=production
PAWAPAY_PRODUCTION_API_TOKEN=<production JWT token>
PAWAPAY_WEBHOOK_URL=https://api.ngoma.africa/api/v1/payments/webhook
```

## Optional (webhook signature — P3)

```env
PAWAPAY_PRIVATE_KEY=
PAWAPAY_PUBLIC_KEY_ID=
```

When empty, webhooks accepted without signature verification (dev/sandbox).

## Resolution rules

1. **Environment**: `PAWAPAY_ENV` → fallback `PAWAPAY_ENVIRONMENT` → default `sandbox`
2. **Token**: sandbox uses `PAWAPAY_API_TOKEN` → fallback `PAWAPAY_SANDBOX_API_TOKEN`; production uses `PAWAPAY_PRODUCTION_API_TOKEN` → fallback `PAWAPAY_API_TOKEN`
3. **Base URL**: env-specific URL vars → hardcoded v2 defaults
4. **Dev auto-complete**: `PAYMENTS_DEV_AUTO_COMPLETE=true` AND no token → skip PawaPay POST and complete locally

## Local webhook tunnel

For sandbox USSD + webhook testing without polling only:

```bash
ngrok http 4001
# Register: https://<ngrok-id>.ngrok.io/api/v1/payments/webhook in PawaPay dashboard
# Set PAWAPAY_WEBHOOK_URL to same URL
```

## Legacy compatibility

Existing deployments using `PAWAPAY_ENVIRONMENT` and `PAWAPAY_SANDBOX_API_TOKEN` continue to work without rename.
