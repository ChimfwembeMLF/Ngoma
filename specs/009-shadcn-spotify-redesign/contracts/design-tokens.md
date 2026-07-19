# Contract: Spotify Design Tokens

**Source**: `client/DESIGN.md`  
**Consumer**: `client/tailwind.config.cjs`, `client/src/index.css`, shadcn CSS variables

## Required global setup

```html
<!-- client/index.html -->
<html lang="en" class="dark">
```

## shadcn CSS variable contract (`index.css`)

All migrated pages MUST consume colors via shadcn semantic classes — not legacy 003 tokens.

| shadcn class | Spotify role | Must NOT use |
|--------------|--------------|--------------|
| `bg-background` | Page `#121212` | `bg-canvas` |
| `text-foreground` | Primary `#ffffff` | `text-ink` |
| `text-muted-foreground` | Secondary `#b3b3b3` | `text-muted` (legacy) |
| `bg-card` | Surface `#181818` | white cards |
| `bg-primary` | Green `#1ed760` | `bg-primary` (#ff385c) |
| `text-primary` | Green accent text | pink accent |
| `border-border` | `#4d4d4d` | `border-hairline` |

## Typography contract

| Element | Required classes |
|---------|------------------|
| Page h1 | `text-[28px] font-bold text-foreground` |
| Section h2 | `text-xl font-semibold text-foreground` |
| Card title | `text-base font-semibold text-foreground line-clamp-2` |
| Card subtitle | `text-sm text-muted-foreground` |
| Button label | `text-sm font-bold uppercase tracking-wider` |

## Button contract (shadcn variants)

| Variant | When | Spotify styling |
|---------|------|-----------------|
| `default` | Primary CTA (pay, submit, play) | Green bg, black text, `rounded-full` |
| `secondary` | Secondary actions | `#1f1f1f` bg, white text, pill |
| `outline` | Tertiary | transparent, `#7c7c7c` border, pill |
| `ghost` | Nav links, back | transparent hover `#1f1f1f` |
| `destructive` | Delete, deactivate | `#f3727f` |

## Input contract

- Background: `bg-input` / `#1f1f1f`
- Text: `text-foreground`
- Search: add `rounded-full` + horizontal padding for icon
- Focus: `ring-ring` (green) or inset border per DESIGN.md §4

## Card contract

- `bg-card text-card-foreground rounded-md` (6–8px)
- Hover (grid items): `hover:bg-accent/50` or shadow `0 8px 8px rgba(0,0,0,0.3)`

## Legacy prohibition (post-migration)

The following MUST NOT appear in any `client/src/pages/**` or `client/src/components/**` after implementation:

- `bg-canvas`, `text-ink`, `text-body-text`
- `bg-primary` when referring to Tailwind extended `#ff385c` (use shadcn `bg-primary` = green)
- `border-hairline`, `bg-surface-soft` (legacy light tokens)
- Direct imports from deleted `components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`

## Verification grep (quickstart)

```bash
rg "bg-canvas|text-ink|#ff385c|border-hairline" client/src/pages client/src/components
# Expected: zero matches after migration
```
