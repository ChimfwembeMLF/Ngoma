# Research: 018-break-down-long-forms

**Date**: 2026-07-19

## R1: What counts as a “long form” in Ngoma today

**Decision**: A form is **long** if it has **≥5 input controls** OR **≥2 logical sections** (e.g. amount + payment) on one scroll without navigation.

**Inventory**:

| Surface | Fields / sections | Long? |
|---------|-------------------|-------|
| `AuthPage` register | 7 | Yes |
| `AuthPage` login | 2 | No |
| `TrackUploadForm` | 5 + file + pricing conditionals | Yes |
| `CheckoutPage` | track summary + amount + MobileMoneyForm | Yes |
| `TipArtistPage` | presets + custom + message + MobileMoneyForm | Yes |
| `AdminBrandingPage` | Logo + Background + Layout + Templates | Yes (sections) |
| `ThemeEditor` | Presets + 20+ token inputs | Yes (advanced) |
| `ArtistProfilePage` | 3 | No |
| `PlaylistsPage` create | 1–2 | No |

**Rationale**: User said “all long forms”; objective threshold avoids wizard overhead on short forms.

**Alternatives considered**:
- Wizard every form including login — rejected; hurts simple flows
- Only auth + track — rejected; user said “all”

---

## R2: Multi-step vs tabs pattern

**Decision**:
- **Wizard (`FormWizard`)** for linear flows: register, track upload, checkout, tip — user progresses forward with validation gates.
- **Tabs (`FormTabs`)** for non-linear admin settings: branding, theme — user jumps between sections freely.

**Rationale**: Registration and payments are sequential; admin branding sections are independent and reorderable mentally.

**Alternatives considered**:
- Tabs everywhere — rejected for checkout (payment must follow amount)
- Separate routes per step — rejected; more routing complexity for MVP

---

## R3: Shared primitives (no new npm deps)

**Decision**: Build lightweight client components:

```
FormWizard — children as steps[], currentStep, onStepChange, footer actions
StepIndicator — labels + active/completed states
FormTabs — thin wrapper over shadcn Tabs with consistent admin styling
```

Optional hook: `useFormWizard(steps, validateStep)` for local state.

**Rationale**: Constitution simplicity; no stepper library; shadcn Tabs already in project.

**Alternatives considered**:
- react-step-wizard / react-hook-form-multi-step packages — rejected; new dependency
- Framer Motion page transitions — deferred to polish

---

## R4: Step breakdown designs

**Decision**:

| Form | Steps |
|------|-------|
| Register | 1) Email & password 2) Profile (name, phone, country, role, artist name) |
| Track upload | 1) Details (title, genre) 2) Pricing 3) Audio file 4) Review & publish |
| Checkout | 1) Order review (+ PWYW amount) 2) Mobile money |
| Tip | 1) Amount & message 2) Mobile money |
| Admin branding | Tabs: Logo \| Background \| Layout \| Templates |
| Theme | Tabs: Presets \| Advanced tokens |

**Rationale**: Each step ≤4 primary inputs; payment flows match mental model “decide amount → pay”.

---

## R5: Validation strategy

**Decision**: Validate **current step only** before advancing; final step triggers submit mutation. Preserve draft state in component state (or RHF `watch`) across steps.

**Rationale**: Existing forms use local `useState` — incremental migration without full RHF rewrite in MVP.

**Alternatives considered**:
- Full RHF + Zod refactor all forms — larger scope; can follow incrementally

---

## R6: API impact

**Decision**: **None** — client-only UX restructure; same payloads on submit.

**Rationale**: All listed forms already POST aggregated data once.
