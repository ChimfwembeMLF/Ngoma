# Quickstart: 018-break-down-long-forms

**Purpose**: Validate multi-step and tabbed form UX across Ngoma.

**Prerequisites**:
- Client **5173**, API **4001**
- Artist account for track upload
- Listener account for checkout/tip

---

## Run client

```bash
yarn workspace @ngoma/client dev
```

---

## Validation Scenarios

### VS-1801: Register wizard

1. Open `/auth` → Register
2. **Expected**: Step indicator; Step 1 = email + password only
3. Continue → Step 2 = name, phone, country, role (+ artist name if ARTIST)
4. Back → Step 1 values preserved
5. Submit → account created, redirect `/dashboard`

### VS-1802: Track upload wizard

1. Sign in as artist → `/artist/dashboard`
2. Open upload section
3. **Expected**: Steps Details → Pricing → Audio → Review
4. FREE pricing hides price fields on step 2
5. Publish disabled until audio on step 3
6. Review shows summary before publish

### VS-1803: Payment wizards

1. **Checkout**: open paid track checkout
   - Step 1: track + amount (if PWYW)
   - Step 2: mobile money only
2. **Tip**: `/tip/:artistId`
   - Step 1: amount + message
   - Step 2: mobile money

### VS-1804: Admin branding tabs

1. Admin → `/admin/branding`
2. **Expected**: Tabs Logo | Background | Layout | Templates
3. Switch tabs — one section at a time; preview visible on desktop

### VS-1805: Shared step indicator

1. Compare register, upload, checkout, tip
2. **Expected**: Consistent step indicator styling and Back/Continue footer

### VS-1806: Login unchanged

1. `/auth` → Sign In
2. **Expected**: Single form, no wizard

---

## Build check

```bash
yarn workspace @ngoma/client lint
yarn workspace @ngoma/client build
```

**Result (2026-07-19)**: lint passed (0 errors); build passed.

---

## Validation Results (2026-07-19)

| Scenario | Status | Notes |
|----------|--------|-------|
| VS-1801 Register wizard | PASS (static) | `AuthPage` register uses `FormWizard` with Account → Profile steps; `registerMutation` payload unchanged |
| VS-1802 Track upload wizard | PASS (static) | `TrackUploadForm` uses 4 steps; FREE hides price fields; Publish requires audio on review step |
| VS-1803 Payment wizards | PASS (static) | `CheckoutPage` and `TipArtistPage` split review/amount from `MobileMoneyForm`; status panels post-deposit unchanged |
| VS-1804 Admin branding tabs | PASS (static) | `AdminBrandingPage` uses `FormTabs` (Logo \| Background \| Layout \| Templates); sticky preview on `lg+` |
| VS-1805 Shared step indicator | PASS (static) | All wizards use shared `StepIndicator` + sticky Back/Continue footer via `FormWizard` |
| VS-1806 Login unchanged | PASS (static) | Login mode renders single form without wizard chrome |

Manual browser verification recommended before release.

---

## Contracts

- [form-wizard-ui.md](./contracts/form-wizard-ui.md)
- [long-form-inventory.md](./contracts/long-form-inventory.md)
