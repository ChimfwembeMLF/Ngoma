# Feature Specification: Break Down Long Forms

**Feature Branch**: `018-break-down-long-forms`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "i need all long forms to be broken down"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Registration as a guided flow (Priority: P1)

A new user registering sees account setup split into short steps instead of one long form with 7+ fields.

**Why this priority**: Register mode on `/auth` is the longest single-page form today (name, phone, role, artist name, country, email, password).

**Independent Test**: VS-1801 — Register flow shows step indicator; each step has ≤4 fields; user can go back without losing data.

**Acceptance Scenarios**:

1. **Given** register mode, **When** page loads, **Then** Step 1 shows account fields (email, password) only.
2. **Given** Step 1 valid, **When** user continues, **Then** Step 2 shows profile fields (full name, phone, country, role).
3. **Given** role is ARTIST, **When** Step 2 shown, **Then** artist name field appears on Step 2 or Step 3 — not mixed with unrelated fields on one screen.
4. **Given** user on Step 2+, **When** Back clicked, **Then** previous step values are preserved.

---

### User Story 2 — Track upload wizard (Priority: P1)

An artist uploading a track progresses through Details → Pricing → Audio → Review instead of one card with all fields.

**Why this priority**: `TrackUploadForm` combines metadata, pricing logic, and file upload — high cognitive load on artist dashboard.

**Independent Test**: VS-1802 — Upload wizard has 3–4 steps; Publish disabled until audio step complete.

**Acceptance Scenarios**:

1. **Given** upload wizard, **When** Step 1 complete, **Then** user advances to pricing step with conditional price/min fields.
2. **Given** pricing step, **When** user selects FREE, **Then** price fields hidden; user can proceed to audio.
3. **Given** audio attached, **When** review step shown, **Then** summary displays title, genre, pricing, file name before Save draft / Publish.

---

### User Story 3 — Payment flows split into amount then mobile money (Priority: P1)

Checkout and tip pages separate “what am I paying?” from “how do I pay?” so mobile money fields are not stacked with amount/message fields.

**Why this priority**: `TipArtistPage` and `CheckoutPage` combine amount UI + `MobileMoneyForm` (country, operator, phone) on one scroll.

**Independent Test**: VS-1803 — Checkout and tip use 2-step flow; step 2 reuses shared `MobileMoneyForm`.

**Acceptance Scenarios**:

1. **Given** checkout, **When** Step 1 complete, **Then** Step 2 shows only mobile money fields + Pay button.
2. **Given** tip page, **When** Step 1 shows amount + message, **Then** Step 2 shows mobile money only.
3. **Given** user on Step 2, **When** Back clicked, **Then** amount and message preserved.

---

### User Story 4 — Admin branding as tabbed sections (Priority: P2)

Admin branding settings use clear section navigation (tabs or stepper) instead of one long scroll through logo, background, layout, and templates.

**Why this priority**: `AdminBrandingPage` stacks four heavy editors; admins lose context scrolling.

**Independent Test**: VS-1804 — `/admin/branding` shows section tabs; one section visible at a time; live preview persists.

**Acceptance Scenarios**:

1. **Given** admin branding page, **When** loaded, **Then** tab/step nav shows Logo | Background | Layout | Templates.
2. **Given** user switches tab, **When** section changes, **Then** sticky preview panel remains visible on desktop.
3. **Given** mobile viewport, **When** tabs used, **Then** preview collapses below or toggles — no horizontal overflow.

---

### User Story 5 — Shared multi-step form primitives (Priority: P1 enabler)

All broken-down forms use shared `FormWizard` / `StepIndicator` components for consistent UX (progress, Back/Continue, validation gating).

**Why this priority**: Avoid one-off step logic in every page; matches design system consistency goal.

**Independent Test**: VS-1805 — Auth, track upload, checkout, and tip all render the same step indicator pattern.

**Acceptance Scenarios**:

1. **Given** any wizard form, **When** rendered, **Then** step labels and current step are visible.
2. **Given** invalid current step, **When** Continue clicked, **Then** advance blocked with inline validation — not silent failure.
3. **Given** final step, **When** primary action shown, **Then** button label matches action (Create Account, Publish, Pay, etc.).

---

### Edge Cases

- Login mode on `/auth` stays single-step (only 2 fields) — no wizard overhead.
- Draft track save allowed from review step without requiring publish.
- Payment status polling step remains separate (post-submit) — not part of wizard steps.
- Keyboard/accessibility: step nav focusable; `aria-current="step"` on active step.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-1801**: Forms with **≥5 fields** or **≥2 logical sections** MUST use multi-step or tabbed breakdown per inventory below.
- **FR-1802**: Shared components `FormWizard`, `StepIndicator` in `client/src/components/forms/`.
- **FR-1803**: **Auth register** — 2–3 steps; login unchanged.
- **FR-1804**: **TrackUploadForm** — 4 steps: Details, Pricing, Audio, Review.
- **FR-1805**: **CheckoutPage** and **TipArtistPage** — 2 steps: Amount/Review, Payment.
- **FR-1806**: **AdminBrandingPage** — tab navigation across existing editors (no API changes).
- **FR-1807**: **ThemeEditor** — keep preset grid on main tab; Advanced tokens on second tab (replace `<details>` or complement it).
- **FR-1808**: Step state preserved on Back; no API contract changes.
- **FR-1809**: Mobile-first — one step visible at a time; sticky footer with Back/Continue on wizards.

### Form inventory (in scope)

| Form / Page | Current fields/sections | Target pattern |
|-------------|-------------------------|----------------|
| `AuthPage` (register) | 7 fields | 2-step wizard |
| `TrackUploadForm` | 5+ fields + file | 4-step wizard |
| `CheckoutPage` | amount + mobile money | 2-step wizard |
| `TipArtistPage` | amount + message + mobile money | 2-step wizard |
| `AdminBrandingPage` | 4 section editors | Tabs |
| `ThemeEditor` | presets + advanced tokens | Tabs |

### Out of scope

- `ArtistProfilePage` (3 fields — already short)
- `MobileMoneyForm` internal breakdown (handled by parent wizard step 2)
- Server-side form splitting or new endpoints
- Framer Motion animations (optional polish later)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-1801**: No in-scope form displays more than **4 primary inputs** on a single step/screen (excluding review summary).
- **SC-1802**: All 6 in-scope surfaces use shared `FormWizard` or `FormTabs` primitives.
- **SC-1803**: VS-1801–VS-1805 pass manual validation; client lint/build pass.

## Assumptions

- “Long form” = ≥5 fields OR multiple distinct sections on one view.
- React Hook Form + Zod can wrap per-step validation incrementally; existing uncontrolled state may migrate step-by-step.
- Admin branding tabs reuse existing `LogoEditor`, `BackgroundEditor`, etc. without rewriting editor logic.

## Dependencies

- Existing shadcn `Tabs`, `Button`, `Card` components
- `013-payment-forms-ux` (`MobileMoneyForm` unchanged API)
- `015-admin-branding-templates` (branding editors)
