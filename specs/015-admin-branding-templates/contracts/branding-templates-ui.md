# Contract: Branding Templates Admin UI

**Feature**: 015-admin-branding-templates  
**Route**: `/admin/branding`

## Page Layout

```text
┌─────────────────────────────────────────────────────────┐
│ Admin — Branding                    [Theme] [Users]     │
│ Logo, backgrounds, layouts, and reusable templates      │
├─────────────────────────────────────────────────────────┤
│ [ Logo ] [ Background ] [ Layout ] [ Templates ]        │  ← tabs or stacked sections
├─────────────────────────────────────────────────────────┤
│  (active section content)                               │
│  Live preview panel (mini AppShell mock) on desktop     │
└─────────────────────────────────────────────────────────┘
```

## Logo Section (`LogoEditor.tsx`)

| Control | Behaviour |
|---------|-----------|
| Current logo preview | Shows uploaded image or placeholder |
| Upload button | File picker → `POST .../logo` |
| Width slider | 48–320px, live preview, saves on Save |
| Remove | `DELETE .../logo` with confirm |

**Classes**: shadcn `Button`, `Slider`, `Label`, `Card`

## Background Section (`BackgroundEditor.tsx`)

| Control | Behaviour |
|---------|-----------|
| Type radio | None / Static image / Animated |
| Image upload | Visible when type=image |
| Animated preset grid | Cards with mini CSS preview when type=animated |
| Overlay slider | 0–80% darkness over background |

## Layout Section (`LayoutTemplatePicker.tsx`)

Radio/card grid of 3 layouts with wireframe thumbnail:
- Default, Minimal, Hero

## Templates Section (`BrandingTemplateGrid.tsx`)

Two sub-grids:

1. **Starter templates** — Apply button per card; shows preset name + colour chips + background hint
2. **My templates** — Saved list with Apply + Delete; Save current button opens name dialog

**Save dialog**: Input name + Save → `POST .../templates/save`

## Live Preview

Desktop right column (or bottom on mobile): scaled `AppShell` mock showing logo, background, and layout without full page navigation.

## Navigation Links

Add to `DashboardPage`, `AdminUsersPage`, `AdminThemePage`:

```text
Link to="/admin/branding" → "Branding"
```

## Hooks (`useAdminBranding.ts`)

- `useAdminBranding()` — GET admin branding
- `useUpdateBranding()` — PUT partial
- `useUploadLogo()` — multipart
- `useRemoveLogo()`
- `useUploadBackgroundImage()`
- `useApplyBrandingTemplate()`
- `useSaveBrandingTemplate()`
- `useDeleteBrandingTemplate()`

## Success Feedback

Inline "Branding saved" or toast on successful mutation (match ThemeEditor pattern).

## Accessibility

- Logo upload: labelled file input
- Sliders: associated labels + aria-valuenow
- Template cards: keyboard selectable, visible focus ring
