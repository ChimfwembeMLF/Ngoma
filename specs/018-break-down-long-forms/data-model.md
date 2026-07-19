# Data Model: 018-break-down-long-forms

**Feature**: Break down long forms

## Database Changes

**None** — client-only UX.

## Client UI Models

### FormWizard

```typescript
type FormWizardStep = {
  id: string;
  label: string;
  content: React.ReactNode;
  validate?: () => boolean | Promise<boolean>;
};

type FormWizardProps = {
  steps: FormWizardStep[];
  onComplete: () => void;
  completeLabel?: string;
  cancelLabel?: string;
};
```

### StepIndicator

```typescript
type StepIndicatorProps = {
  steps: { id: string; label: string }[];
  currentIndex: number;
  completedThrough?: number;
};
```

### FormTabs (admin)

```typescript
type FormTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};
```

## Step mappings

### Register (`AuthPage`)

| Step | Fields |
|------|--------|
| account | email, password |
| profile | fullName, phone, country, role, artistName (conditional) |

### Track upload (`TrackUploadForm`)

| Step | Fields |
|------|--------|
| details | title, genre |
| pricing | pricingType, price \| minPrice |
| audio | audio file |
| review | read-only summary + Save draft / Publish |

### Checkout / Tip

| Step | Content |
|------|---------|
| review | track/artist summary, amount (PWYW/custom), tip message |
| payment | `MobileMoneyForm` + submit |

### Admin branding tabs

| Tab | Component |
|-----|-----------|
| logo | `LogoEditor` |
| background | `BackgroundEditor` |
| layout | `LayoutTemplatePicker` |
| templates | `BrandingTemplateGrid` |

### Theme tabs

| Tab | Content |
|-----|---------|
| presets | `ThemeSwatchGrid` + save actions |
| advanced | Token color grid (from current `<details>` body) |

## No State Transitions (server)

Submit payloads unchanged from current implementations.
