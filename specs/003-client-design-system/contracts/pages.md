# Contract: Page Compositions

**Scope**: Four routes only

## `/discover` — DiscoverPage

**Layout**: `DesignSystemLayout` maxWidth `6xl`

**Structure**:

```text
[Header row]
  h1 "Discover" (display-xl)
  SearchPill + ghost/outline "Sign in" link

[Section × N]
  h2 section title (title-md / xl semibold)
  Grid: TrackCard (responsive 2–4 columns)

[Empty section]
  p.text-muted "No tracks in this section yet."
```

**Data**: Unchanged — `useTrending`, `useNewReleases`, `useSearch`.

---

## `/tracks/:id` — TrackPage

**Layout**: `DesignSystemLayout` maxWidth `2xl`

**Structure**:

```text
Ghost link "← Back to discover"

[Hero block]
  Cover art (rounded-md, max-w-xs) OR placeholder
  h1 title (display-lg)
  artist, genre, duration (body-sm muted stack)

AudioPlayer (restyled)

[Actions row]
  Primary: Buy / Download / Sign in to purchase
  Outline: secondary actions
```

**States**: loading, not-found use muted text on canvas (no indigo/cream).

---

## `/auth` — AuthPage

**Layout**: `DesignSystemLayout` centered, maxWidth `md`

**Structure**:

```text
Card (max-w-md, centered vertically)
  h1 "Ngoma" (display-lg, ink)
  p tagline (body-sm muted)

  [Mode toggle] two outline/primary segmented buttons

  Form
    Input fields per mode (register extras)
    error banner (text-error)
    primary submit Button full width
```

**Behavior**: Unchanged auth mutations and navigation.

---

## `/dashboard` — DashboardPage

**Layout**: `DesignSystemLayout` maxWidth `3xl`

**Structure**:

```text
[Header]
  h1 "Dashboard" (display-lg)
  ghost "Sign out"

Card — profile fields (label muted, value ink)

[Action links flex wrap]
  outline: Discover, Purchases
  primary: Artist dashboard (ARTIST role)
  outline: Edit profile (ARTIST)
  primary or outline: Admin users (ADMIN)
```

**Role rules**: Same visibility logic as current page; only styling changes.
