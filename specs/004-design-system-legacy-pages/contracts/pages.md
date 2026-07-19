# Contract: Legacy Page Compositions

**Scope**: Routes deferred from `003-client-design-system`  
**Reference**: [003 pages contract](../003-client-design-system/contracts/pages.md), `PurchaseHistoryPage.tsx`

---

## `/artist/dashboard` — ArtistDashboardPage

**Layout**: `DesignSystemLayout` maxWidth `3xl`

**Structure**:

```text
[Header row]
  h1 "Artist dashboard" (display-lg)
  outline/ghost link "Edit profile" → /artist/profile

[Card — TrackUploadForm]
  Restyled upload form (see components.md)

[Section]
  h2 "Your tracks" (title-md)
  [Track rows]
    Card or bordered row: title (ink), status/price (muted)
    ghost link "View" → /tracks/:id
  [Empty] muted copy
  [Loading] muted copy
```

**Data**: Unchanged — `useArtistTracks`, `TrackUploadForm` mutations.

---

## `/artist/profile` — ArtistProfilePage

**Layout**: `DesignSystemLayout` maxWidth `2xl`

**Structure**:

```text
h1 "Artist profile" (display-lg)

Card
  Input: artist name
  textarea (bio) — matches Input border/focus styles
  Input: genres (comma separated)
  primary Button "Save profile"
  success message (text-sm text-muted or text-ink)
```

**Data**: Unchanged — `useUpdateArtistProfile`, `useAuth`.

---

## `/checkout/:trackId` — CheckoutPage

**Layout**: `DesignSystemLayout` maxWidth `md`

**Structure**:

```text
ghost link "← Back to track"

h1 "Checkout" (display-lg)

Card — order summary
  track title (title-md)
  price line (body-sm muted)

Form
  Input: phone (mobile money)
  primary Button "Pay with mobile money"

PaymentStatusPanel (when deposit initiated)
```

**States**: loading track → muted text on canvas inside layout.

**Data**: Unchanged — track query, deposit mutation, PaymentStatusPanel polling.

---

## `/admin/users` — AdminUsersPage

**Layout**: `DesignSystemLayout` maxWidth `6xl`

**Structure**:

```text
[Header row]
  h1 "Admin — Users" (display-lg)
  outline link "Back to dashboard"

[Filters]
  role select styled as Input or native select with hairline border

UserTable

[Pagination row]
  muted text "Showing X–Y"
  outline Button prev / next
```

**Data**: Unchanged — `useAdminUsers`, `useDeactivateUser`.

---

## `/purchases` — PurchaseHistoryPage (reference)

Already conforms to design system. **Do not regress** during 004. Use as layout reference for list/card pages.
