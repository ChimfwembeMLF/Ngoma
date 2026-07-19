# Research: shadcn/ui + Spotify Dark Redesign

**Feature**: 009-shadcn-spotify-redesign | **Date**: 2026-07-19

## R1: shadcn initialization strategy

**Decision**: Run `npx shadcn@latest init` in `client/` with **Vite**, **TypeScript**, **Tailwind CSS**, **`@/*` alias** (already in `tsconfig.json`), **CSS variables**, **default style**, **base color zinc** then override variables to Spotify palette in `index.css`.

**Rationale**: Constitution mandates shadcn/ui; official CLI generates `components.json`, updates Tailwind, and installs peer deps. Zinc base is closest neutral dark starting point before Spotify token override.

**Alternatives considered**:
- Manual Radix + copy-paste without CLI — rejected; loses upgrade path and `components.json` registry
- Keep custom components and only restyle — rejected; user explicitly requested shadcn for all inputs/components

## R2: Dark theme application

**Decision**: Set `class="dark"` on `<html>` in `index.html` or root wrapper; map shadcn CSS variables (`--background`, `--foreground`, `--primary`, `--card`, `--muted`, etc.) to Spotify hex values from DESIGN.md.

**Rationale**: shadcn v3 uses CSS variables for theming; single dark default matches DESIGN.md (dark-only MVP). No `next-themes` needed for Vite SPA without toggle.

**Alternatives considered**:
- Tailwind `darkMode: 'class'` with user toggle — deferred (out of scope)
- Hardcode hex in every component — rejected; unmaintainable vs variable layer

## R3: Spotify token mapping

**Decision**: Replace 003/004 light tokens with semantic Spotify mapping:

| Semantic | Spotify hex | shadcn variable |
|----------|-------------|-----------------|
| Page bg | `#121212` | `--background` |
| Card/surface | `#181818` / `#1f1f1f` | `--card` |
| Primary text | `#ffffff` | `--foreground` |
| Muted text | `#b3b3b3` | `--muted-foreground` |
| Accent (functional) | `#1ed760` | `--primary` |
| Accent foreground | `#000000` | `--primary-foreground` |
| Destructive | `#f3727f` | `--destructive` |
| Border | `#4d4d4d` / inset shadow | `--border` |
| Input bg | `#1f1f1f` | `--input` |

**Rationale**: DESIGN.md §2–§4 defines exact palette; shadcn variables give one source for all Radix components.

**Alternatives considered**:
- Keep `canvas`/`ink`/`primary` (#ff385c) names — rejected; conflicts with new Spotify spec

## R4: Button geometry (pill vs shadcn default)

**Decision**: Extend shadcn `Button` with CVA variants: `default` (green pill CTA), `secondary` (dark `#1f1f1f` pill), `outline` (transparent + `#7c7c7c` border), `ghost`, `destructive`. Apply `rounded-full`, uppercase, `tracking-wider` via variant classes per DESIGN.md §4.

**Rationale**: shadcn Button uses CVA — customize variants once, use everywhere.

**Alternatives considered**:
- Separate `PillButton` component — rejected; duplicates shadcn pattern

## R5: Layout shell

**Decision**: Replace `DesignSystemLayout` with `AppShell`: `#121212` full viewport, optional compact top nav (Discover, Playlists, Dashboard links), content area with max-width, footer slot for `AudioPlayer` on track routes. Full sidebar deferred — use top nav for MVP to minimize diff.

**Rationale**: DESIGN.md describes sidebar + bottom bar; top nav + bottom player achieves 80% with less layout risk. Sidebar can be 009b.

**Alternatives considered**:
- Full Spotify sidebar in first slice — rejected; large structural change across all routes

## R6: Form migration pattern

**Decision**: Auth, upload, checkout, profile, playlist create forms adopt shadcn `Form` + `FormField` + RHF + Zod where validation exists; simple forms use controlled shadcn `Input`/`Button` without full Form wrapper if no schema yet.

**Rationale**: Constitution requires RHF + Zod; shadcn Form is standard integration.

**Alternatives considered**:
- Uncontrolled native inputs with shadcn styling only — rejected for auth/checkout trust surfaces

## R7: Legacy component removal

**Decision**: After all imports migrate, delete `client/src/components/ui/Button.tsx`, `Input.tsx`, `Card.tsx`, `SearchPill.tsx` — replace with shadcn equivalents. `TrackCard` remains domain component composing shadcn `Card`.

**Rationale**: Prevents dual systems; grep gate in quickstart.

**Alternatives considered**:
- Re-export shadcn from old filenames permanently — rejected; confusing indirection

## R8: Dependencies to add

**Decision**: Add via shadcn init + component adds:
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`, `lucide-react`
- Radix packages per component (`@radix-ui/react-slot`, `label`, `select`, `checkbox`, etc.)

**Rationale**: Standard shadcn stack; `utils.ts` upgraded to `tailwind-merge` for conflict-safe `cn()`.

## R9: Migration order

**Decision**: Phase order — (1) shadcn init + tokens, (2) AppShell + core shadcn components, (3) Discover/Track/Auth, (4) Dashboard/Playlists/Purchases, (5) Artist/Checkout/Admin/Tip, (6) shared components + delete legacy.

**Rationale**: P1 user stories first; shared components last once variant API stable.

**Alternatives considered**:
- Page-by-page without token foundation — rejected; rework risk

## R10: Font stack

**Decision**: Use DESIGN.md fallback stack in `tailwind.config.cjs`: `Circular`, `-apple-system`, `system-ui`, `Roboto`, `Helvetica Neue`, sans-serif. Do not bundle SpotifyMixUI proprietary fonts.

**Rationale**: Legal/practical; fallbacks match DESIGN.md §3.
