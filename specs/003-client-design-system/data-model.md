# Data Model: 003-client-design-system

**Date**: 2026-07-19

**Note**: This feature has no database entities. This document catalogs the **UI design model** — tokens, components, and page compositions.

## Design Token Catalog

### Colors (from `client/DESIGN.md`)

| Token key | Hex | Tailwind key | Usage |
|-----------|-----|--------------|-------|
| canvas | #ffffff | `canvas` | Page background |
| ink | #222222 | `ink` | Headlines, primary text |
| body | #3f3f3f | `body-text` | Long-form copy |
| muted | #6a6a6a | `muted` | Secondary labels |
| muted-soft | #929292 | `muted-soft` | Disabled text |
| primary | #ff385c | `primary` | Primary CTA, brand accent |
| primary-active | #e00b41 | `primary-active` | Pressed state |
| on-primary | #ffffff | `on-primary` | Text on primary buttons |
| hairline | #dddddd | `hairline` | Borders, dividers |
| surface-soft | #f7f7f7 | `surface-soft` | Placeholders, disabled fields |
| surface-strong | #f2f2f2 | `surface-strong` | Icon button backgrounds |
| error | #c13515 | `error` | Form validation messages |

### Typography roles

| Role | Size | Weight | Tailwind utility pattern |
|------|------|--------|--------------------------|
| display-xl | 28px | 700 | `text-[28px] font-bold text-ink` |
| display-lg | 22px | 500 | `text-[22px] font-medium text-ink` |
| title-md | 16px | 600 | `text-base font-semibold text-ink` |
| body-md | 16px | 400 | `text-base text-ink` |
| body-sm | 14px | 400 | `text-sm text-muted` |
| caption | 14px | 500 | `text-sm font-medium text-muted` |

### Spacing & radii

| Token | Value | Tailwind |
|-------|-------|----------|
| section gap | 64px | `mb-16` |
| card padding | 16px | `p-4` |
| rounded-sm | 8px | `rounded-sm` |
| rounded-md | 14px | `rounded-md` |
| rounded-full | pill | `rounded-full` |

### Shadow tier (elevation)

Single tier for hover cards and dropdowns:

```text
shadow-card: 0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.1)
```

## Component Catalog

| Component | Variants | States |
|-----------|----------|--------|
| Button | primary, outline, ghost | default, hover, active, disabled, focus |
| Input | text, email, password, select | default, focus, error, disabled |
| Card | default, profile | — |
| SearchPill | with trailing search action | focus within |
| TrackCard | with/without cover, with/without duration | hover elevation |
| DesignSystemLayout | full-page shell | — |
| AudioPlayer | compact | playing, paused, loading |

## Page Composition Map

| Route | Layout | Primary components |
|-------|--------|-------------------|
| `/discover` | DesignSystemLayout | SearchPill, TrackCard grid, section headings |
| `/tracks/:id` | DesignSystemLayout | display-lg title, AudioPlayer, Button group |
| `/auth` | DesignSystemLayout | Card, Input, Button, mode toggle |
| `/dashboard` | DesignSystemLayout | Card (profile), Button links by role |

## State Transitions (UI only)

| Surface | Loading | Empty | Error |
|---------|---------|-------|-------|
| Discover sections | muted "Loading…" | "No tracks yet" | TanStack Query error text in `error` color |
| Track detail | centered muted text | "Track not found" | same |
| Auth form | button disabled + pending label | — | inline `error` message below form |
| Dashboard profile | skeleton or muted | — | meQuery error in card |

## Deferred

- Dark mode tokens
- shadcn/ui component library integration
- Global nav/header shared across all app routes
- Design token documentation site / Storybook
