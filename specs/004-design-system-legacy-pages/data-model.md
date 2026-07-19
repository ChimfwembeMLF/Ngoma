# Data Model: 004-design-system-legacy-pages

**Date**: 2026-07-19

**Note**: No database entities. Extends the UI design model from [003 data-model](../003-client-design-system/data-model.md).

## Extended Page Composition Map

| Route | Layout | Primary components | Status |
|-------|--------|-------------------|--------|
| `/artist/dashboard` | DesignSystemLayout `3xl` | Card (upload), track list rows, Button, Input via TrackUploadForm | Migrate |
| `/artist/profile` | DesignSystemLayout `2xl` | Card, Input, textarea (bio), primary Button | Migrate |
| `/checkout/:trackId` | DesignSystemLayout `md` | Card summary, Input (phone), Button pay, PaymentStatusPanel | Migrate |
| `/admin/users` | DesignSystemLayout `6xl` | role filter Input/select, UserTable, pagination Button | Migrate |
| `/purchases` | DesignSystemLayout `3xl` | Card list (reference) | Done (003) |

## Extended Component Catalog

| Component | Change in 004 | Variants / states |
|-----------|---------------|-------------------|
| TrackUploadForm | Full restyle | file inputs styled; primary upload + outline cancel |
| PaymentStatusPanel | Card wrapper; ink/muted/error text | PENDING, COMPLETED, FAILED |
| UserTable | Light table on canvas | header surface-soft; row hover optional |
| AdminRoute | Loading uses DesignSystemLayout | centered muted text |
| LegacyLayout | **Remove** | — |

## Table Visual Model (UserTable)

| Region | Token / utility |
|--------|-----------------|
| Container | `rounded-md border border-hairline overflow-x-auto` |
| Header row | `bg-surface-soft text-muted text-xs uppercase` |
| Body rows | `text-ink text-sm divide-y divide-hairline` |
| Deactivate action | `Button` ghost or `text-error` link with confirm |
| Empty state | `text-muted text-sm py-8 text-center` |

## State Transitions (UI only)

| Surface | Loading | Empty | Error |
|---------|---------|-------|-------|
| Artist track list | muted "Loading…" | "No tracks yet — upload your first track" | Query error in `text-error` |
| Checkout | muted centered | N/A (redirect if missing track) | deposit error in `text-error` |
| Admin users | muted "Loading users…" | "No users found" | API error banner in Card |
| Payment status | muted status label | — | failed status in `text-error` |

## Dependencies on 003 Artifacts

- [design-tokens.md](../003-client-design-system/contracts/design-tokens.md) — canonical colors
- [ui-components.md](../003-client-design-system/contracts/ui-components.md) — Button, Input, Card, Layout
- `client/src/lib/utils.ts` — `cn()` helper

## Global CSS Model (post-migration)

```css
/* client/src/index.css */
body {
  @apply min-h-screen bg-canvas font-sans text-ink antialiased;
}
```

No dual-theme body defaults after 004 completes.
