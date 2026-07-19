# Contract: TrackPage Download UI

**Feature**: 022-free-track-downloads  
**File**: `client/src/pages/TrackPage.tsx`

---

## Download button visibility

| Condition | UI |
|-----------|-----|
| `!isLoggedIn` + FREE | Link: "Sign in to download" → `/auth` |
| `!isLoggedIn` + paid | Link: "Sign in to buy" → `/auth` (unchanged) |
| `isLoggedIn` + `canDownload` | Button: "Download" or "Download free" |
| `isLoggedIn` + paid + `!canDownload` | Buy/PWYW checkout only — **no Download button** |

`canDownload` comes from `GET /api/v1/tracks/:id` (sent with auth header via `apiFetch`).

---

## Download action

- Use authenticated `fetch` + blob (existing pattern).
- On failure: set `downloadError` state; display below action buttons.
- Parse JSON error body for message when `Content-Type` is JSON; fallback "Download failed".

---

## Label mapping

| pricingType | Button label when `canDownload` |
|-------------|----------------------------------|
| FREE | Download free |
| SET_PRICE / PWYW | Download |

---

## Regression

- Checkout flow unchanged for paid tracks.
- Audio stream player unchanged (public stream URL).
- Post-checkout link from CheckoutPage still routes to track for download.
