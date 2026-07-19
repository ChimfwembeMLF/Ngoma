# Contract: Animated Backgrounds UI

**Feature**: 015-admin-branding-templates

## Component: `AnimatedBackground.tsx`

**Path**: `client/src/components/layout/AnimatedBackground.tsx`

Renders fixed full-viewport layer **behind** app content (`z-index` below shell, above base background).

### Props

```typescript
type AnimatedBackgroundProps = {
  background: BrandingBackground;
};
```

### Layer Stack

```text
z-0  AnimatedBackground (fixed inset-0)
z-10 AppShell content (relative)
```

### Static Image Mode

When `background.type === 'image'`:

```text
fixed inset-0 bg-cover bg-center bg-no-repeat
style={{ backgroundImage: `url(${imageUrl})` }}
```

Overlay div: `fixed inset-0 bg-black` with opacity from `overlayOpacity`.

### Animated Preset Mode

When `background.type === 'animated'`:

Map `animatedId` → CSS class on root div:

| ID | Class | Description |
|----|-------|-------------|
| `gradient-drift` | `ngoma-bg-gradient-drift` | Slow multi-stop gradient shift |
| `aurora` | `ngoma-bg-aurora` | Green/violet aurora bands |
| `mesh-pulse` | `ngoma-bg-mesh-pulse` | Radial mesh breathing |
| `starfield` | `ngoma-bg-starfield` | Subtle moving dots |

Keyframes in `client/src/lib/animated-backgrounds.css` (imported once in `main.tsx` or provider).

### None Mode

Render `null` — theme `bg-background` on shell only.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .ngoma-bg-gradient-drift,
  .ngoma-bg-aurora,
  .ngoma-bg-mesh-pulse,
  .ngoma-bg-starfield {
    animation: none !important;
  }
}
```

Show static gradient matching preset's first keyframe colours.

### Performance

- Use `transform` and `opacity` animations only (GPU-friendly)
- No `filter` blur animation on full viewport
- `pointer-events-none` on background layer

## AppShell Integration

`AppShell` root becomes:

```text
<div className="relative min-h-screen">
  <AnimatedBackground />   // from BrandingProvider context
  <div className="relative z-10 ...">
    <header>...</header>
    <main>...</main>
  </div>
</div>
```

Header may use `bg-background/80 backdrop-blur` when animated background active for readability.

## Logo in Header

When `logoUrl` set:

```tsx
<img src={logoUrl} alt="Ngoma" style={{ width: logoWidth }} className="h-auto max-h-16 object-contain" />
```

Else: text link "Ngoma" (current behaviour).

## Layout Variants

| `layoutTemplateId` | Header classes |
|--------------------|----------------|
| `default` | `py-4` (current) |
| `minimal` | `py-2`, `text-sm` nav |
| `hero` | `py-8`, larger logo max-h-24 |

## Admin Preview

BackgroundEditor animated cards use same CSS classes at reduced height (`h-24 rounded-md overflow-hidden`) for WYSIWYG preset selection.
