# Contract: Tip UI

**Design system**: Reuse `DesignSystemLayout`, `Card`, `Input`, `Button`, `PaymentStatusPanel`

---

## Route

**Path**: `/tip/:artistId`  
**Query**: `?trackId=` optional (from track page link)

---

## TipArtistPage

**File**: `client/src/pages/TipArtistPage.tsx`

**Data**:
- `GET /api/v1/artists/:artistId` — artist name for header
- `usePaymentOptions()` — mobile money providers
- `useInitiateTip()` — POST tip

**Layout**:

```text
[Back link]
h1 "Support {artistName}"
subtitle "Show your appreciation with a tip"

[Preset grid]  ZMW 5 | 10 | 25 | 50  (selectable chips)
[Custom amount input]  min 1.00
[Message textarea]     optional, max 500
[Provider select]
[Phone input]
[Send tip button]

→ PaymentStatusPanel on depositId (reuse checkout pattern)
```

**States**:
- Loading artist
- Error (artist not found)
- Unauthenticated → redirect or link to `/auth`

---

## TrackPage integration

**File**: `client/src/pages/TrackPage.tsx`

Add outline button/link when logged in:

```text
Tip artist → /tip/{artistId}?trackId={trackId}
```

Placed near Buy/Download actions.

---

## Artist dashboard (optional P2 polish)

**File**: `client/src/pages/ArtistDashboardPage.tsx`

Optional section "Recent tips" using `useTipsReceived()` — may defer to implement if time-boxed; API contract supports it.

---

## Hook

**File**: `client/src/hooks/useTips.ts`

```typescript
useInitiateTip()
useTipsReceived(limit?, offset?)
```

Query keys: `['tips', 'received']`

---

## Presets

| Label | Value |
|-------|-------|
| Chip 1 | 5 |
| Chip 2 | 10 (default) |
| Chip 3 | 25 |
| Chip 4 | 50 |

Custom amount overrides preset selection when edited.

---

## Regression

- Checkout page for tracks unchanged
- Artist profile edit page unchanged
