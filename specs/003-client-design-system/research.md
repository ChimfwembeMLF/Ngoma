# Research: 003-client-design-system

**Date**: 2026-07-19

## R1 — Tailwind token mapping

**Decision**: Extend `client/tailwind.config.ts` with semantic color keys from `client/DESIGN.md`: `canvas`, `ink`, `body`, `muted`, `muted-soft`, `hairline`, `hairline-soft`, `border-strong`, `surface-soft`, `surface-strong`, `primary` (#ff385c), `primary-active`, `primary-disabled`, `error` (from primary-error-text). Map radii: `rounded-sm` (8px), `rounded-md` (14px), `rounded-full` (pill). Add `fontFamily.sans` stack: `Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif`.

**Rationale**: Tailwind is already in use; extending theme keeps pages declarative and matches constitution client conventions without new CSS-in-JS libraries.

**Alternatives considered**:
- CSS custom properties only — harder to use with existing Tailwind utility classes
- shadcn/ui full init — no components exist yet; adds Radix deps for minimal button/input needs

---

## R2 — Font loading

**Decision**: Do **not** ship Airbnb Cereal VF (licensed font). Use the DESIGN.md fallback stack via Tailwind `font-sans`. Display sizes/weights mapped as Tailwind `text-*` + `font-*` utilities per typography tokens.

**Rationale**: Spec assumption allows fallback; avoids licensing risk. Visual hierarchy preserved via size/weight, not proprietary face.

**Alternatives considered**:
- Self-host Cereal — legal/licensing unclear
- Google Font substitute (Nunito) — adds dependency; system stack sufficient for MVP rollout

---

## R3 — Scoped layout vs global body restyle

**Decision**: Add `DesignSystemLayout` wrapper applied on the four in-scope pages. Layout sets `min-h-screen bg-canvas text-ink`. Leave `index.css` body defaults (`bg-cream text-indigo`) for out-of-scope routes (Artist, Admin, Checkout, etc.).

**Rationale**: Spec limits scope to four pages; global body change would force a half-migrated product appearance on every route.

**Alternatives considered**:
- Change `index.css` globally — breaks out-of-scope pages until they are migrated
- Route-based CSS modules — heavier than a layout wrapper

---

## R4 — Component library shape

**Decision**: Create lightweight primitives in `client/src/components/ui/`:

| Component | DESIGN.md mapping |
|-----------|-------------------|
| `Button` | `button-primary`, `button-secondary`, `button-outline` |
| `Input` | `text-input` |
| `Card` | bordered surface with `rounded-md`, hairline border, optional shadow tier |
| `SearchPill` | `search-bar-pill` |
| `TrackCard` | `property-card` adapted for music metadata |

Use `cn()` helper (clsx + tailwind-merge) in `client/src/lib/utils.ts` if not present.

**Rationale**: DRY across four pages; enforces FR-205/FR-206 consistency.

**Alternatives considered**:
- Inline Tailwind on each page only — duplicates radii/colors; fails SC-205
- Full shadcn Button/Input — overkill for five primitives

---

## R5 — Audio player restyle

**Decision**: Restyle `client/src/components/player/AudioPlayer.tsx` in place using design tokens (ink/muted/primary for progress and controls). No playback logic changes.

**Rationale**: Track page includes player; leaving it on legacy colors breaks US2/SC-201.

---

## R6 — Legacy color deprecation strategy

**Decision**: On in-scope pages, remove all `cream`, `terracotta`, `indigo-*` Tailwind classes. Keep legacy keys in `tailwind.config.ts` until a follow-up migrates remaining pages.

**Rationale**: FR-208 requires no legacy appearance on in-scope routes without breaking out-of-scope pages still using old tokens.

---

## R7 — Responsive and accessibility defaults

**Decision**: Minimum 44px touch height on `Button` and `SearchPill` submit areas; focus rings using `ring-2 ring-primary/30 ring-offset-2`; truncate long titles with `line-clamp-2` on `TrackCard`.

**Rationale**: Spec SC-203 and FR-209; aligns with DESIGN.md soft interactive shapes.
