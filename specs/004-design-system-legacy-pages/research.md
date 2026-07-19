# Research: 004-design-system-legacy-pages

**Date**: 2026-07-19

## R1 — Migration order

**Decision**: Migrate in priority order: **Checkout (P1)** → **Artist dashboard + TrackUploadForm (P1)** → **Admin users + UserTable (P2)** → **Artist profile (P2)** → **Global cleanup (P1)**.

**Rationale**: Checkout is highest revenue risk; artist dashboard is highest creator traffic; admin is lower frequency. Global CSS cutover only after all consumers of legacy body styles are migrated.

**Alternatives considered**:
- Big-bang single PR — harder to review and bisect regressions
- Admin first — lower user impact than checkout

---

## R2 — Table styling without new dependencies

**Decision**: Restyle `UserTable` with semantic Tailwind utilities: `border-hairline`, `bg-surface-soft` header, `text-ink` / `text-muted` cells, `divide-y divide-hairline` rows. Action buttons use `Button` ghost variant or native `<button>` with `buttonVariants('outline')`.

**Rationale**: Constitution prefers smallest diff; admin table is simple (5 columns, paginated). No shadcn Table/Radix needed.

**Alternatives considered**:
- shadcn/ui Table component — adds dependency for one admin view
- CSS module for table — inconsistent with 003 Tailwind-first approach

---

## R3 — Textarea on Artist profile

**Decision**: Extend `Input` usage pattern for single-line fields; for bio textarea apply matching classes inline (`min-h`, `rounded-sm`, `border-hairline`, focus ring) or add optional `Input` `as="textarea"` prop if it reduces duplication.

**Rationale**: Auth page only uses single-line inputs; profile needs multiline. Prefer inline textarea with shared class string from `Input` export if extracted.

**Alternatives considered**:
- New `Textarea` component file — justified only if classes duplicated in 2+ places; acceptable in 004 if bio is sole textarea

---

## R4 — Global body style cutover

**Decision**: After all pages migrated, change `client/src/index.css` body from legacy defaults to `@apply min-h-screen bg-canvas font-sans text-ink antialiased` (already partially set in 003). Delete `LegacyLayout.tsx`.

**Rationale**: 003 R3 scoped layout to four pages; 004 completes rollout so global body can match `DesignSystemLayout` without split theme.

**Alternatives considered**:
- Keep LegacyLayout as no-op wrapper — dead code; violates SC-302

---

## R5 — Legacy Tailwind token removal

**Decision**: After migration, remove `cream`, `indigo`, `terracotta`, `amber` from `tailwind.config.cjs` if `rg` shows zero usage in `client/src/`.

**Rationale**: Prevents accidental reintroduction of dark theme; keeps token set aligned with `DESIGN.md`.

**Alternatives considered**:
- Keep legacy tokens indefinitely — confusing for future contributors

---

## R6 — PaymentStatusPanel status colors

**Decision**: Map payment statuses to design tokens: `COMPLETED` → `text-ink`, `PENDING` → `text-muted`, `FAILED` → `text-error`. Panel container uses `Card` with default border.

**Rationale**: Matches `PurchaseHistoryPage.statusColor` pattern already in codebase.

**Alternatives considered**:
- Keep green/red Tailwind defaults — breaks SC-301 visual consistency

---

## R7 — Reference implementation

**Decision**: Use `PurchaseHistoryPage.tsx` as the canonical list/card pattern for 004 page refactors (header row, `DesignSystemLayout`, `Card` for grouped content, `buttonVariants` for links).

**Rationale**: Already migrated and validated during 003 bugfix work; reduces design decisions.

**Alternatives considered**:
- Re-derive layouts from DESIGN.md per page — slower; PurchaseHistory already matches spec intent
