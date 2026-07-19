# Contract: UI Components

**Location**: `client/src/components/ui/`  
**Reference**: `client/DESIGN.md` component tokens

## Button

```tsx
type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: false; // links use <Link> styled with same classes via className prop on wrapper
};
```

| Variant | Visual |
|---------|--------|
| primary | Rausch fill, white label, 8px radius, min-h 44px |
| outline | White fill, hairline border, ink text |
| ghost | Transparent, ink text, underline on hover optional |

**States**: disabled → reduced opacity + `primary-disabled` tint for primary variant.

---

## Input

```tsx
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};
```

| State | Visual |
|-------|--------|
| default | 56px height, hairline border, rounded-sm, body-md text |
| focus | border-strong ring |
| error | border-error + error message below in `text-error text-sm` |

---

## Card

```tsx
type CardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md'; // md = 24px default
};
```

White surface, `rounded-md`, 1px `hairline` border, optional `shadow-card` on hover for interactive cards.

---

## SearchPill

```tsx
type SearchPillProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};
```

Full-width pill (`rounded-full`), min height 48–64px, internal padding 14px 24px. Optional trailing circular search icon area in `primary` (future); MVP may use plain input styling inside pill.

---

## TrackCard

```tsx
type TrackCardProps = {
  id: string;
  title: string;
  artistName?: string;
  coverArtUrl?: string | null;
  duration?: number;
  price?: number | null;
  pricingType?: string;
};
```

Photo-first 1:1 aspect ratio image area with `rounded-md` clip. Placeholder: `bg-surface-soft` with music note or neutral block. Meta stack: title (title-md), artist (body-sm muted), duration + price row.

**Link**: Entire card or title links to `/tracks/:id`.

---

## DesignSystemLayout

```tsx
type DesignSystemLayoutProps = {
  children: React.ReactNode;
  maxWidth?: '6xl' | '2xl' | 'md'; // page-specific
};
```

Applies `min-h-screen bg-canvas text-ink font-sans` and horizontal padding `px-4 sm:px-8`.

---

## AudioPlayer (restyle contract)

Existing props unchanged. Visual:

- Controls use ink icons/text on canvas
- Progress bar track: `surface-soft`; fill: `primary`
- Min touch target 44px on play/pause
