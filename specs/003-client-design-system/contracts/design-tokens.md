# Contract: Design Tokens

**Source**: `client/DESIGN.md`  
**Consumer**: `client/tailwind.config.ts`, `client/src/components/ui/*`

## Color contract

All in-scope pages MUST use semantic Tailwind classes from this table — not raw hex or legacy `cream`/`terracotta`/`indigo` classes.

| Semantic | Tailwind class | Hex |
|----------|----------------|-----|
| Page background | `bg-canvas` | #ffffff |
| Primary text | `text-ink` | #222222 |
| Secondary text | `text-muted` | #6a6a6a |
| Tertiary text | `text-muted-soft` | #929292 |
| Brand accent | `bg-primary` / `text-primary` | #ff385c |
| Accent pressed | `bg-primary-active` | #e00b41 |
| On accent | `text-on-primary` | #ffffff |
| Border | `border-hairline` | #dddddd |
| Placeholder surface | `bg-surface-soft` | #f7f7f7 |
| Error text | `text-error` | #c13515 |

## Typography contract

| Element | Required classes |
|---------|------------------|
| Page h1 | `text-[28px] font-bold text-ink leading-tight` |
| Section h2 | `text-xl font-semibold text-ink` |
| Card title | `text-base font-semibold text-ink line-clamp-2` |
| Card subtitle | `text-sm text-muted` |
| Form label | `text-sm font-medium text-ink` |

## Radius contract

| Element | Class |
|---------|-------|
| Primary button | `rounded-sm` (8px) |
| Track card | `rounded-md` (14px) |
| Search bar | `rounded-full` |
| Form card | `rounded-md` |

## Interaction contract

- Primary buttons: min height **44px**, `bg-primary text-on-primary hover:bg-primary-active`
- Focus visible: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2`
- Outline buttons: `border border-hairline bg-canvas text-ink hover:bg-surface-soft`

## Legacy prohibition (in-scope routes only)

The following MUST NOT appear in Discover, Track, Auth, or Dashboard source after implementation:

- `text-cream`, `bg-cream`
- `text-terracotta`, `bg-terracotta`
- `text-indigo`, `bg-indigo`, `border-indigo`
