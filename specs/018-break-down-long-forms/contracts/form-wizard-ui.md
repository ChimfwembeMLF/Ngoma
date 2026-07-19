# Contract: Form Wizard UI

**Feature**: 018-break-down-long-forms

## FormWizard

**Path**: `client/src/components/forms/FormWizard.tsx`

### Behavior

- Renders `StepIndicator` at top
- Shows **one step** content at a time
- Footer: **Back** (hidden on step 0), **Continue** (steps 0..n-2), **Submit** (final step with `completeLabel`)
- `Continue` calls `steps[current].validate?.()` — if false, stay on step
- Back preserves entered values (parent owns state)

### StepIndicator

**Path**: `client/src/components/forms/StepIndicator.tsx`

- Horizontal on `sm+`, compact numbered dots on mobile
- Active step: `aria-current="step"`
- Labels from step config (e.g. "Account", "Payment")

### Accessibility

- Focus moves to step heading on advance
- Keyboard: Continue/Back are buttons, not links

---

## Contract: Form Tabs UI (admin)

**Path**: `client/src/components/forms/FormTabs.tsx`

- Wrapper around shadcn `Tabs` with consistent list styling for admin pages
- Default tab on load: first tab (`logo` for branding, `presets` for theme)
- URL hash optional (`#background`) — **deferred** unless needed for deep links

---

## Surfaces using FormWizard

| Page / component | Steps |
|------------------|-------|
| `AuthPage` (register only) | Account → Profile |
| `TrackUploadForm` | Details → Pricing → Audio → Review |
| `CheckoutPage` | Review → Payment |
| `TipArtistPage` | Amount → Payment |

## Surfaces using FormTabs

| Page | Tabs |
|------|------|
| `AdminBrandingPage` | Logo, Background, Layout, Templates |
| `ThemeEditor` | Presets, Advanced |

## Out of scope

- Login form (single step)
- `ArtistProfilePage`
- Post-payment `PaymentStatusPanel` (not a form step)

## Visual acceptance

- No step shows more than 4 primary input controls (review step excepted)
- Sticky footer on mobile wizards with Back/Continue always reachable
