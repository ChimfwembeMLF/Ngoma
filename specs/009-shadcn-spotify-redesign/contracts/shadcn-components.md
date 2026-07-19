# Contract: shadcn/ui Components

**Location**: `client/src/components/ui/`  
**Config**: `client/components.json`

## Bootstrap requirements

1. `npx shadcn@latest init` in `client/` with:
   - Style: **default**
   - Base color: **zinc** (overridden by Spotify variables)
   - CSS variables: **yes**
   - `@/` alias: **yes**

2. Install components (minimum set):

```bash
cd client
npx shadcn@latest add button input label card select checkbox textarea badge separator table alert form dropdown-menu
```

## Component API contract

### Button (`@/components/ui/button`)

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Pay</Button>
<Button variant="outline">Back</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm" | "default" | "lg">...</Button>
```

**Spotify overrides** (in `button.tsx` CVA):
- All variants: `rounded-full`
- `default`: green primary, black text, uppercase optional via className
- Min height 44px for default/lg

### Input + Label

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@example.com" />
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
```

### Select

Used on: TrackPage (add to playlist), AdminUsersPage (role filter), TrackUploadForm (pricing type).

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
```

### Form (React Hook Form)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
```

Required on: `AuthPage`, `CheckoutPage` (if schema added), `ArtistProfilePage`, playlist create form.

### Table

Required on: `AdminUsersPage`, optionally `TrackEarningsTable`, `PurchaseHistoryPage`.

### Badge

Public/private playlist tags, track status on artist dashboard.

### Alert

`PaymentStatusPanel`, inline errors on forms.

## utils.ts contract

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Domain components (compose shadcn)

| Component | Path | Uses |
|-----------|------|------|
| TrackCard | `components/ui/TrackCard.tsx` | `Card`, `Button` |
| SearchPill | `components/ui/SearchPill.tsx` | `Input` + icon OR delete and inline |
| AudioPlayer | `components/player/AudioPlayer.tsx` | `Button`, `Slider` (optional add) |
| PaymentStatusPanel | `components/payments/PaymentStatusPanel.tsx` | `Alert`, `Card` |
| AnalyticsSummaryCards | `components/analytics/*` | `Card` |

## Import path standard

All new UI imports MUST use `@/components/ui/*` — not relative `../../components/ui/Button`.

## Deprecation

After migration, remove files:
- `client/src/components/ui/Button.tsx` (custom)
- `client/src/components/ui/Input.tsx` (custom)
- `client/src/components/ui/Card.tsx` (custom)

Replace `DesignSystemLayout` imports with `@/components/layout/AppShell`.
