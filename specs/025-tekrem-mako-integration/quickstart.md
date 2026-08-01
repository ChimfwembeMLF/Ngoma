# Quickstart Validation Guide: Tekrem & Mako Integration

**Feature**: Tekrem & Mako Ecosystem Integration (`025-tekrem-mako-integration`)  

This quickstart document describes how developers and quality analysts can locally test and validate the end-to-end functionality connecting Ngoma with Tekrem ID (Auth) and Mako (Marketing).

---

## 1. Prerequisites & Environment Setup

Ensure your development database (PostgreSQL on port 5432) and local Redis instance are active per standard monorepo guidelines.

Configure the following environment variables in `api/.env.local`:
```env
# Tekrem Auth OIDC Client Settings
TEKREM_OIDC_ISSUER="http://localhost:8080"
TEKREM_CLIENT_ID="ngoma_local_client"
TEKREM_CLIENT_SECRET="secret_dev_token_123"
TEKREM_REDIRECT_URI="http://localhost:3000/auth/callback"

# Mako Marketing API Endpoint
MAKO_API_BASE_URL="http://localhost:4001"
MAKO_TENANT_API_KEY="dev_tenant_master_key"
```

---

## 2. Execute Database Migrations

Apply the required TypeORM migration to provision the integration tracking tables (`tekrem_account_link`, `mako_promotion_campaign`, `smart_link_attribution`, and `fan_segment`):

```bash
cd api
yarn migrations:run
```
*Expected Output*: Notice confirming execution of `1722470000000-CreateMarketingIntegrationTables`.

---

## 3. Local Validation Scenarios

### Scenario A: Verify One-Click Release Promotion
1. Start the API dev server: `cd api && yarn start:dev` (runs on port 4000).
2. Start the Vite client dev server: `cd client && yarn dev` (runs on port 3000).
3. Log in as an authenticated artist and open a published song in the catalog management view.
4. Click the **"Promote with Mako"** action button.
5. **Expected Outcome**: The system initializes a `MakoPromotionCampaign` record, generates a smart link (`/link/mako-afrobeat-2026`), and immediately transitions the artist into the Mako promotional interface pre-filled with song title, artwork URL, and streaming destination without secondary sign-in prompts.

---

### Scenario B: Verify Smart Link Conversion & ROI Calculation
1. Simulate an external listener arriving via WhatsApp by sending a GET request to the promotional smart link:
   ```bash
   curl -i "http://localhost:4000/api/v1/marketing/smart-links/mako-afrobeat-2026?ref=whatsapp"
   ```
2. Complete a simulated track purchase or artist tip using test PawaPay credentials while passing the session tracking token.
3. Access the Artist Analytics Dashboard (`/marketing/roi`).
4. **Expected Outcome**: The dashboard reflects 1 new click impression, attributes the purchase revenue to the originating Mako campaign, and calculates Net ROI percentages accurately in under 60 seconds.

---

## 4. Automated Verification Commands

Run unit and integration tests covering OIDC token exchange, campaign DTO validation, and conversion attribution logic:

```bash
# Run API unit & contract tests
cd api
yarn test src/modules/marketing-integration

# Run client component testing for promotion dialogues & ROI dashboards
cd ../client
yarn test src/components/marketing
```
*Expected Outcome*: All unit tests pass with clean exit codes.
