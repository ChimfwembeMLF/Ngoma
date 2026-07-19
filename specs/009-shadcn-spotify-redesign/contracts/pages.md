# Contract: Page Migration Map

**Scope**: All client routes — restyle + shadcn imports  
**Layout**: Wrap with `AppShell` instead of `DesignSystemLayout`

## Migration matrix

| Route | Page file | Priority | Key shadcn components | Notes |
|-------|-----------|----------|----------------------|-------|
| `/discover` | `DiscoverPage.tsx` | P1 | Input (search), Card, Button | Track grid, top nav link |
| `/tracks/:id` | `TrackPage.tsx` | P1 | Button, Select, Card | Player, buy/tip/add-to-playlist |
| `/auth` | `AuthPage.tsx` | P1 | Form, Input, Label, Button | Login/register toggle |
| `/dashboard` | `DashboardPage.tsx` | P2 | Card, Button | Profile hub |
| `/playlists` | `PlaylistsPage.tsx` | P2 | Card, Input, Textarea, Checkbox, Button | Create form |
| `/playlists/:id` | `PlaylistDetailPage.tsx` | P2 | Card, Button, Badge | Track list, owner actions |
| `/purchases` | `PurchaseHistoryPage.tsx` | P2 | Card or Table | History list |
| `/artist/dashboard` | `ArtistDashboardPage.tsx` | P2 | Card, Form, Input, Select, Table | Upload + analytics |
| `/artist/profile` | `ArtistProfilePage.tsx` | P2 | Form, Input, Textarea, Button | Profile edit |
| `/checkout/:trackId` | `CheckoutPage.tsx` | P2 | Form, Input, Button, Alert | Payment |
| `/tip/:artistId` | `TipArtistPage.tsx` | P2 | Button, Input, Textarea, Card | Preset amounts |
| `/admin/users` | `AdminUsersPage.tsx` | P2 | Table, Select, Button | Admin table |
| `/` | `App.tsx` | P1 | — | No visual change; routes unchanged |

## Shared components

| Component | File | Priority |
|-----------|------|----------|
| App shell | `layout/AppShell.tsx` | P1 |
| Track card | `ui/TrackCard.tsx` | P1 |
| Audio player | `player/AudioPlayer.tsx` | P2 |
| Track upload | `tracks/TrackUploadForm.tsx` | P2 |
| Payment status | `payments/PaymentStatusPanel.tsx` | P2 |
| Analytics | `analytics/*.tsx` | P3 |
| Admin table | `admin/UserTable.tsx` | P2 |
| Route guards | `ProtectedRoute`, `AdminRoute` | P3 | Loading states only |

## Per-page checklist

For each page migration:

1. Replace `DesignSystemLayout` → `AppShell`
2. Replace legacy `Button`/`Input`/`Card` imports → `@/components/ui/*`
3. Replace light token classes → shadcn semantic classes (`bg-background`, etc.)
4. Verify mobile width (375px) — no horizontal overflow
5. Verify functional flows unchanged (navigation, mutations, playback)

## Regression scope

These flows MUST work after restyle:

- Discover search and track navigation
- Stream + download on TrackPage
- Auth login/register
- Checkout deposit initiation
- Tip artist
- Playlist CRUD + add from track
- Artist track upload
- Admin deactivate user

## Out of scope per page

- No new routes or features
- No API hook changes unless required for Form typing
- No sidebar navigation (top nav only in MVP)
