# Contract: Ad Gate UI (TrackPage)

**Feature**: 023-ad-supported-free-downloads  
**File**: `client/src/pages/TrackPage.tsx`, `client/src/components/ads/AdGateModal.tsx`

---

## Trigger

User clicks **Download free** on FREE track when `canDownload === true` and `adsEnabled === true`.

Do **not** trigger for paid tracks or when `adsEnabled === false`.

---

## AdGateModal layout

```
┌─────────────────────────────────────┐
│  Sponsored                          │
│  ┌───────────────────────────────┐  │
│  │  [Banner image]               │  │
│  └───────────────────────────────┘  │
│  Title / optional "Learn more" link │
│                                     │
│  Download available in 5…4…3…       │
│  [Download now] (disabled until 0)  │
│  [Cancel]                           │
└─────────────────────────────────────┘
```

---

## Flow

1. Fetch `POST /tracks/:id/ad-session`
2. Show modal with creative + countdown from `gateSeconds`
3. On countdown complete → enable **Download now**
4. On click → `POST /ad-sessions/:id/complete` then download with `X-Ad-Session-Id`
5. On success → close modal, trigger blob download (existing pattern)
6. On cancel → close modal, no download

---

## TrackUploadForm label

Change FREE option label to **"Free download (ad-supported)"** with helper text: "Listeners watch a short ad before downloading. You earn exposure; Ngoma earns from ads."

**File**: `client/src/components/tracks/TrackUploadForm.tsx`

---

## Error states

- Ad session fails → show error; offer retry
- Download 403 after complete → "Session expired, try again"
- No creatives → show Ngoma placeholder image + countdown still works
