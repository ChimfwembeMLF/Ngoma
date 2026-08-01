# Quickstart & Validation Guide: Google Ads Integration (026)

## Prerequisites

1. Ngoma API running on `http://localhost:4001` (`npm --prefix api run dev`)
2. Ngoma client running on `http://localhost:5173` (`npm --prefix client run dev`)
3. At least one free track published in the database
4. An AdSense publisher account (or placeholder values for local testing)

---

## Step 1: Configure Environment Variables

In `client/.env`, add:

```env
VITE_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_GATE=1111111111
VITE_ADSENSE_SLOT_DISCOVER=2222222222
VITE_ADSENSE_SLOT_TRACK=3333333333
VITE_ADSENSE_SLOT_ARTIST=4444444444
```

> Use placeholder values locally. The `<ins>` elements will render in the DOM but remain blank until an approved publisher account serves real ads.

Restart the Vite dev server after editing `.env`.

---

## Step 2: Verify AdSense Script Loads

1. Open `http://localhost:5173` in a browser (no ad-blocker).
2. Open DevTools → Network → filter for `adsbygoogle`.
3. Confirm the request to `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX` appears (status 200 or 403 — 403 means account not yet approved, but the script loaded).
4. In DevTools Console, run: `window.adsbygoogle` — should return an array (not `undefined`).

---

## Step 3: Validate Ambient Ad Units

Navigate to each page and open DevTools → Elements:

| Page | Expected Element |
|------|-----------------|
| `http://localhost:5173/discover` | `<ins class="adsbygoogle" data-ad-slot="2222222222">` present in DOM |
| `http://localhost:5173/tracks/:id` | `<ins class="adsbygoogle" data-ad-slot="3333333333">` present below action buttons |
| `http://localhost:5173/artists/:id` | `<ins class="adsbygoogle" data-ad-slot="4444444444">` present between header and track list |

Confirm: no horizontal scroll on any page at 375px viewport width.

---

## Step 4: Validate Ad Gate Modal

1. Navigate to a free track page.
2. Click the Download button.
3. Confirm the ad gate modal opens.
4. Inspect the modal in DevTools → confirm `<ins class="adsbygoogle" data-ad-slot="1111111111">` is present inside the countdown card.
5. Wait 30 seconds (or the configured `gateSeconds` value).
6. Confirm "Download now" button becomes active.
7. Complete the download.

---

## Step 5: Validate Admin Toggle

1. Log in as an admin user.
2. Navigate to Admin → Ads.
3. Confirm the Google AdSense configuration card shows the publisher ID status and a `Google Ads` toggle.
4. Disable Google Ads via the toggle.
5. Navigate to `/discover` in a new tab.
6. Confirm no `<ins class="adsbygoogle">` elements appear in the DOM.
7. Re-enable Google Ads. Confirm units reappear on next page load.

---

## Step 6: Validate Ad-Blocker Resilience

1. Enable an ad-blocker browser extension (e.g., uBlock Origin).
2. Navigate to any of the pages from Step 3.
3. Confirm: page loads normally, no JavaScript errors in DevTools Console.
4. Navigate to a free track and trigger the ad gate.
5. Confirm: the countdown modal opens, the timer runs, and "Download now" activates after `gateSeconds` seconds (ad slot simply renders blank or is absent — the gate still works).

---

## Step 7: Validate Artist Dashboard Label

1. Log in as an artist who has at least one free track.
2. Navigate to the Artist Dashboard track list.
3. Confirm each free track row shows an "Ad-supported" badge/label.
4. Hover or tap the label — confirm tooltip text appears: "This track is free for fans. Ad revenue helps sustain the platform."

---

## Step 8: Validate Auto Ads

1. Ensure `VITE_ADSENSE_PUBLISHER_ID` is set and the AdSense account is approved and has Auto ads enabled in the AdSense dashboard.
2. Browse any fan-facing page.
3. Google may insert additional `<ins>` tags automatically in positions it determines optimal.
4. Verify these do not break the layout (use Responsive Design Mode at 375px).

> Auto ads only appear with an approved, live publisher account. This step is a post-deployment validation.
