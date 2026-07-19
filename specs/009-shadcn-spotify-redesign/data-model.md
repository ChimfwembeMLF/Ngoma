# Data Model: shadcn/ui + Spotify Dark Redesign

**Feature**: 009-shadcn-spotify-redesign | **Date**: 2026-07-19

> UI design catalog — not database entities. No TypeORM migrations.

## Token Catalog

### Color tokens (CSS variables → Tailwind)

| Token | Variable | Hex | Usage |
|-------|----------|-----|-------|
| background | `--background` | `#121212` | Page shell |
| foreground | `--foreground` | `#ffffff` | Primary text |
| card | `--card` | `#181818` | Cards, panels |
| card-foreground | `--card-foreground` | `#ffffff` | Card text |
| popover | `--popover` | `#282828` | Dropdowns, menus |
| primary | `--primary` | `#1ed760` | Play, CTA, active |
| primary-foreground | `--primary-foreground` | `#000000` | Text on green |
| secondary | `--secondary` | `#1f1f1f` | Secondary buttons |
| muted | `--muted` | `#1f1f1f` | Muted backgrounds |
| muted-foreground | `--muted-foreground` | `#b3b3b3` | Secondary text |
| accent | `--accent` | `#1f1f1f` | Hover surfaces |
| destructive | `--destructive` | `#f3727f` | Errors |
| border | `--border` | `#4d4d4d` | Dividers |
| input | `--input` | `#1f1f1f` | Input backgrounds |
| ring | `--ring` | `#1ed760` | Focus ring |

### Typography scale

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Page title | 28px | 700 | Section headers |
| Section title | 24px | 700 | DESIGN.md §3 |
| Feature heading | 18px | 600 | Subsections |
| Body | 16px | 400 | Default |
| Button | 14px | 700 | Uppercase, tracking 1.4px |
| Caption | 14px | 400 | Metadata |
| Small | 12px | 400 | Counts, tags |

### Radius scale

| Name | Value | Use |
|------|-------|-----|
| sm | 4px | Badges |
| md | 6px | Cards, album art |
| lg | 8px | Dialogs |
| full | 9999px | Pills, search |

### Shadow scale

| Name | Value | Use |
|------|-------|-----|
| card-hover | `0 8px 8px rgba(0,0,0,0.3)` | Elevated cards |
| dialog | `0 8px 24px rgba(0,0,0,0.5)` | Modals |
| input-inset | inset `#7c7c7c` 1px | Search/input |

## Component Catalog (shadcn)

| Component | File | Spotify customization |
|-----------|------|----------------------|
| Button | `ui/button.tsx` | Pill, uppercase variants |
| Input | `ui/input.tsx` | Dark bg, inset border, pill option |
| Textarea | `ui/textarea.tsx` | Dark surface |
| Label | `ui/label.tsx` | Muted label color |
| Card | `ui/card.tsx` | `#181818`, 6–8px radius |
| Select | `ui/select.tsx` | Dark dropdown |
| Checkbox | `ui/checkbox.tsx` | Green checked state |
| Badge | `ui/badge.tsx` | Public/private tags |
| Separator | `ui/separator.tsx` | `#b3b3b3` at low opacity |
| Table | `ui/table.tsx` | Admin users |
| Alert | `ui/alert.tsx` | Payment status |
| Form | `ui/form.tsx` | RHF integration |

## Layout: AppShell

```text
AppShell
├── TopNav (optional links: Discover, Playlists, Dashboard, Sign in)
├── Main (max-width content, px-4 py-8)
└── PlayerSlot (optional — TrackPage / future global player)
```

## Legacy → shadcn mapping

| Legacy | Replacement |
|--------|-------------|
| `Button` / `buttonVariants` | `@/components/ui/button` |
| `Input` | `@/components/ui/input` + `label` |
| `Card` | `@/components/ui/card` |
| `SearchPill` | shadcn `Input` with `rounded-full` + icon |
| `DesignSystemLayout` | `AppShell` |

## Validation rules

- No raw `#ff385c`, `bg-canvas`, `text-ink` on migrated pages
- Green accent only on functional CTAs (play, pay, submit, active nav)
- All interactive controls min 44px touch target where applicable
