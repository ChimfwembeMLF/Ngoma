# Implementation Plan: Break Down Long Forms

**Branch**: `018-break-down-long-forms` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/018-break-down-long-forms/spec.md`

## Summary

Replace long single-page forms with **multi-step wizards** (linear flows) and **tabs** (admin settings). Introduce shared `FormWizard`, `StepIndicator`, and `FormTabs` in `client/src/components/forms/`. Refactor six in-scope surfaces: register, track upload, checkout, tip, admin branding, theme editor. Client-only — no API changes.

## Technical Context

**Language/Version**: TypeScript, React 18, Vite, Tailwind + shadcn/ui

**Primary Dependencies**: Existing shadcn `Tabs`, `Button`, `Card`; optional React Hook Form per step (incremental)

**Storage**: None

**Testing**: Manual VS-1801–VS-1806; client lint/build

**Target Platform**: Web SPA (mobile-first)

**Project Type**: Yarn monorepo — `client/src/components/forms/`, pages listed in inventory

**Constraints**:
- Login stays single-step
- `MobileMoneyForm` API unchanged — embedded in payment step
- No new npm wizard libraries
- ≤4 primary inputs per wizard step

**Scale/Scope**: 3 shared components + 6 surface refactors (~12–18 files)

**Reference**: `specs/013-payment-forms-ux/`, `specs/015-admin-branding-templates/`, `client/DESIGN.md`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Client-only — no API module changes
- [x] Work in `client/src/` with shadcn + TanStack Query unchanged
- [x] Smallest diff — shared primitives first, then per-form migration
- [x] No new backend roots or Prisma
- [x] Reuse existing editor components (LogoEditor, etc.)

**Post-design re-check**: PASS

## Project Structure

### Documentation (this feature)

```text
specs/018-break-down-long-forms/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── form-wizard-ui.md
│   └── long-form-inventory.md
└── tasks.md             # (/speckit-tasks)
```

### Source Code (repository root)

```text
client/src/
├── components/
│   ├── forms/
│   │   ├── FormWizard.tsx        # NEW
│   │   ├── StepIndicator.tsx     # NEW
│   │   ├── FormTabs.tsx          # NEW
│   │   └── index.ts
│   ├── tracks/
│   │   └── TrackUploadForm.tsx   # wizard refactor
│   ├── admin/
│   │   └── ThemeEditor.tsx       # tabs refactor
│   └── payments/
│       └── MobileMoneyForm.tsx   # unchanged; used in step 2
└── pages/
    ├── AuthPage.tsx              # register wizard
    ├── CheckoutPage.tsx          # 2-step wizard
    ├── TipArtistPage.tsx         # 2-step wizard
    └── AdminBrandingPage.tsx     # tabs
```

**Structure Decision**: Shared form primitives first; each page refactors to compose them without duplicating step logic.

## Complexity Tracking

> No constitution violations.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Phase 0: Research (complete)

See [research.md](./research.md):
- Long form threshold: ≥5 fields or ≥2 sections
- Wizard for linear flows; tabs for admin
- Six in-scope surfaces identified

## Phase 1: Design (complete)

See:
- [data-model.md](./data-model.md) — step/tab mappings
- [contracts/form-wizard-ui.md](./contracts/form-wizard-ui.md) — wizard behavior
- [contracts/long-form-inventory.md](./contracts/long-form-inventory.md) — full inventory
- [quickstart.md](./quickstart.md) — VS-1801–VS-1806

## Implementation Notes (for /speckit-tasks)

Suggested phases:
1. **Shared primitives** — FormWizard, StepIndicator, FormTabs
2. **P1 wizards** — Auth register, TrackUpload, Checkout, Tip
3. **P2 admin tabs** — AdminBranding, ThemeEditor
4. **Polish** — mobile sticky footer, a11y, lint/build

**Estimated effort**: ~20–25 tasks, client-only.

## MVP scope

Shared primitives + **Register wizard** (F-01) — immediate UX win on `/auth`.
