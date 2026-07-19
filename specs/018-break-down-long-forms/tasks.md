# Tasks: Break Down Long Forms

**Input**: Design documents from `/specs/018-break-down-long-forms/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Depends on**: `013-payment-forms-ux` (`MobileMoneyForm`), `015-admin-branding-templates` (admin editors)

**Tests**: Not requested in spec — manual VS-1801–VS-1806 only.

---

## Phase 1: Setup — Verify Form Baseline

**Purpose**: Confirm in-scope forms and contracts before shared primitive work

- [X] T001 Verify in-scope files exist per `contracts/long-form-inventory.md`: `client/src/pages/AuthPage.tsx`, `client/src/components/tracks/TrackUploadForm.tsx`, `client/src/pages/CheckoutPage.tsx`, `client/src/pages/TipArtistPage.tsx`, `client/src/pages/AdminBrandingPage.tsx`, `client/src/components/admin/ThemeEditor.tsx`
- [X] T002 [P] Review wizard contract in `specs/018-break-down-long-forms/contracts/form-wizard-ui.md` — step validation, Back/Continue footer, `aria-current="step"`

---

## Phase 2: Foundational — Shared Form Primitives (User Story 5 enabler)

**Purpose**: Reusable wizard and tab components — blocks all form refactors

**Independent Test**: VS-1805 (partial) — StepIndicator and FormWizard render with sample steps

**⚠️ CRITICAL**: No user story form refactors until this phase completes

- [X] T003 Create `StepIndicator` with labels, active/completed states, and `aria-current="step"` in `client/src/components/forms/StepIndicator.tsx` per `contracts/form-wizard-ui.md`
- [X] T004 Create `FormWizard` with step gating, Back/Continue/Submit footer, and `validate` callback support in `client/src/components/forms/FormWizard.tsx`
- [X] T005 [P] Create `FormTabs` wrapper over shadcn Tabs with consistent admin styling in `client/src/components/forms/FormTabs.tsx`
- [X] T006 Export shared form components from `client/src/components/forms/index.ts`

**Checkpoint**: FormWizard + StepIndicator + FormTabs ready for page integration

---

## Phase 3: User Story 1 — Registration Guided Flow (Priority: P1) 🎯 MVP

**Goal**: Register mode on `/auth` uses 2-step wizard; login stays single-step

**Independent Test**: VS-1801 — Account step (email, password) → Profile step (name, phone, country, role, artist name)

- [X] T007 [US1] Refactor register flow in `client/src/pages/AuthPage.tsx` — wrap register fields in `FormWizard` with steps Account and Profile; preserve existing submit payload to `registerMutation`
- [X] T008 [US1] Add per-step validation in `client/src/pages/AuthPage.tsx` — block Continue when email/password empty on step 1; show artist name when role is ARTIST on step 2; login mode unchanged

**Checkpoint**: Register wizard works end-to-end; login unaffected

---

## Phase 4: User Story 2 — Track Upload Wizard (Priority: P1)

**Goal**: Track upload progresses Details → Pricing → Audio → Review

**Independent Test**: VS-1802 — 4 steps; FREE hides price; Publish requires audio; review shows summary

- [X] T009 [US2] Refactor `TrackUploadForm` in `client/src/components/tracks/TrackUploadForm.tsx` to use `FormWizard` with steps Details, Pricing, Audio, Review per `data-model.md`
- [X] T010 [US2] Add step validation and review summary in `client/src/components/tracks/TrackUploadForm.tsx` — conditional pricing fields on step 2; audio required for Publish on step 4; Save draft from review step

**Checkpoint**: Artist dashboard upload is a 4-step wizard

---

## Phase 5: User Story 3 — Payment Flows Split (Priority: P1)

**Goal**: Checkout and tip separate amount/review from mobile money payment

**Independent Test**: VS-1803 — 2-step flow on both pages; step 2 embeds unchanged `MobileMoneyForm`

- [X] T011 [US3] Refactor pre-payment flow in `client/src/pages/CheckoutPage.tsx` — Step 1: track summary + PWYW amount; Step 2: `MobileMoneyForm` + Pay; preserve `PaymentStatusPanel` post-submit outside wizard
- [X] T012 [P] [US3] Refactor pre-payment flow in `client/src/pages/TipArtistPage.tsx` — Step 1: amount presets + message; Step 2: `MobileMoneyForm` + Send tip; preserve status panel post-submit

**Checkpoint**: Checkout and tip use consistent 2-step payment wizards

---

## Phase 6: User Story 4 — Admin Branding Tabs (Priority: P2)

**Goal**: Admin branding uses tab navigation instead of one long scroll

**Independent Test**: VS-1804 — Tabs Logo | Background | Layout | Templates; preview persists on desktop

- [X] T013 [US4] Refactor `AdminBrandingPage` in `client/src/pages/AdminBrandingPage.tsx` — use `FormTabs` for LogoEditor, BackgroundEditor, LayoutTemplatePicker, BrandingTemplateGrid; keep sticky preview aside on `lg+`

**Checkpoint**: Admin branding is tabbed with one section visible at a time

---

## Phase 7: Theme Editor Tabs (FR-1807)

**Goal**: Theme presets and advanced tokens on separate tabs

**Independent Test**: Theme page shows Presets tab + Advanced tab; save/reset actions remain functional

- [X] T014 Refactor `ThemeEditor` in `client/src/components/admin/ThemeEditor.tsx` — use `FormTabs` for Presets (swatch grid + save actions) and Advanced (token color grid from current `<details>` body)

**Checkpoint**: Theme editor no longer exposes 20+ tokens on the same view as presets

---

## Phase 8: Polish & Cross-Cutting

- [X] T015 Add mobile sticky footer styling for `FormWizard` in `client/src/components/forms/FormWizard.tsx` — Back/Continue always reachable on small screens (FR-1809)
- [X] T016 [P] Verify login mode on `client/src/pages/AuthPage.tsx` remains single-step with no wizard chrome (VS-1806)
- [X] T017 Run `yarn workspace @ngoma/client lint` and `yarn workspace @ngoma/client build`
- [X] T018 Validate VS-1801–VS-1806 from `specs/018-break-down-long-forms/quickstart.md`; document results in quickstart.md

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 (shared primitives) → Phase 3–5 (P1 wizards) can proceed sequentially or Phase 3 first for MVP
- Phase 6–7 (admin tabs) depend on Phase 2 `FormTabs` only — can parallel with Phase 3–5 after Phase 2
- Phase 8 last

### Parallel opportunities

| Batch | Tasks | Notes |
|-------|-------|-------|
| Setup | T001, T002 | Baseline + contract review |
| Primitives | T005 | FormTabs parallel to StepIndicator if split dev |
| Payment wizards | T011, T012 | Different page files |
| Admin tabs | T013, T014 | After FormTabs; different files |
| Polish | T016, T017 | Login check + build |

### Suggested MVP scope

Phases 1–3 — **8 tasks** (T001–T008): shared primitives + register wizard

### Task count summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Setup | 2 | — |
| Foundational (US5) | 4 | P1 enabler |
| US1 Register | 2 | P1 |
| US2 Track upload | 2 | P1 |
| US3 Payment flows | 2 | P1 |
| US4 Admin branding | 1 | P2 |
| Theme tabs | 1 | FR-1807 |
| Polish | 4 | — |
| **Total** | **18** | |

### Independent test criteria

| Story | Test ID | Validates |
|-------|---------|-----------|
| US1 | VS-1801 | Register 2-step wizard |
| US2 | VS-1802 | Track upload 4-step wizard |
| US3 | VS-1803 | Checkout + tip 2-step payment |
| US4 | VS-1804 | Admin branding tabs |
| US5 | VS-1805 | Shared step indicator pattern |
| — | VS-1806 | Login unchanged |

---

## Implementation Strategy

### MVP First (Register wizard)

1. Complete Phase 1–2 (shared primitives)
2. Complete Phase 3 (register wizard)
3. **STOP and VALIDATE**: VS-1801 on `/auth`
4. Continue track upload → payments → admin tabs → theme → polish

### Incremental Delivery

1. Shared FormWizard/StepIndicator/FormTabs → consistent UX foundation
2. Register wizard → biggest single-page form fixed
3. Track upload + payment wizards → artist/listener flows
4. Admin branding + theme tabs → operator UX
5. Mobile sticky footer + a11y polish

---

## Notes

- Do NOT modify `client/src/components/payments/MobileMoneyForm.tsx` API — parent pages own step 2
- Submit payloads unchanged — no API work
- ≤4 primary inputs per wizard step (review/summary steps excepted)
- Artist name on register step 2 when role is ARTIST (fits ≤4 with name, phone, country, role)
