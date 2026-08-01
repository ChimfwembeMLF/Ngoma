# Research: Google Ads Integration (026)

## Decision 1: Ad Unit Architecture — Hybrid (Auto + Manual)

**Decision**: Use Google AdSense **Hybrid** model — Auto ads enabled globally via the publisher-level script tag, PLUS four manually placed `<ins class="adsbygoogle">` units at controlled positions.

**Rationale**: The ad-gate modal requires a precisely framed ad inside a timed countdown overlay — Auto ads cannot reliably target a specific modal element. The four manual placements (discover, track, artist profile, ad-gate) guarantee predictable layout. Auto ads fill the rest of the page with Google-optimised placements.

**Alternatives considered**:
- *Auto ads only*: Cannot control ad-gate modal placement. Rejected.
- *Manual only*: Misses revenue from Google-identified high-value positions. Rejected.

---

## Decision 2: Ad Gate Default Duration — 30 Seconds

**Decision**: Change `DEFAULT_ADS_CONFIG.gateSeconds` from `5` to `30` when Google Ads is active. The `gateSeconds` value remains fully admin-configurable via the existing platform settings panel.

**Rationale**: Google measures viewability as ≥1 second for display ads (MRC standard), but longer viewable time directly correlates with higher CPM rates in the active view metric. 30 seconds matches the upper bound of Google's standard ad view window. The existing `gateSeconds` admin control means operators can tune without a code change.

**Alternatives considered**:
- *5 seconds (current default)*: Poor viewability score; leaves revenue on the table. Rejected for Google Ads mode.
- *20 seconds*: Architecture doc reference; good but 30s maximises CPM per spec clarification. Superseded.

---

## Decision 3: AdSense Experiments — Out of Scope

**Decision**: AdSense Experiments (A/B testing of configurations) is explicitly excluded. Auto ads optimisation by Google's ML is sufficient.

**Rationale**: Experiments require live traffic data and an approved publisher account to be meaningful. They add implementation complexity without a clear payoff at launch. Auto ads uses Google's own ML to continuously optimise.

---

## Decision 4: Script Injection Strategy

**Decision**: Inject the AdSense `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=PUBLISHER_ID">` in `client/index.html` `<head>`, conditioned on `VITE_ADSENSE_PUBLISHER_ID` being non-empty. A Vite plugin or inline `%VITE_ADSENSE_PUBLISHER_ID%` interpolation will control whether the tag renders in the built HTML.

**Rationale**: Script must load before React mounts to ensure `window.adsbygoogle` is available when `<ins>` tags are pushed. `index.html` is the correct injection point per Google's documentation.

**Alternatives considered**:
- *Dynamic script tag in React useEffect*: Race conditions with early-mounted ad components. Rejected.
- *Third-party adsbygoogle npm wrapper*: Adds dependency churn; thin wrapper over the official script. Rejected.

---

## Decision 5: Backend Config Extension

**Decision**: Extend `AdsConfig` type and `DEFAULT_ADS_CONFIG` in `api/src/common/ads-config.util.ts` to add:
- `googleAdsEnabled: boolean` (default: `true` — enabled when publisher ID is configured)
- `gateSeconds` default changed from `5` → `30`

The `PlatformSettings.adsConfig` JSONB column already stores the full `AdsConfig` object — no migration is needed for the new field (JSONB is schema-flexible; TypeORM synchronize handles it in dev; in prod, no DDL change is required since it is additive JSON).

**Rationale**: All ads config already lives in `PlatformSettings.adsConfig` JSONB. Adding a new key is purely additive and requires no migration.

---

## Decision 6: Client Environment Variables

**New env vars required**:

| Variable | Purpose |
|----------|---------|
| `VITE_ADSENSE_PUBLISHER_ID` | Google AdSense publisher ID (e.g. `ca-pub-XXXXXXXXXX`) |
| `VITE_ADSENSE_SLOT_DISCOVER` | Ad unit slot ID for Discover page leaderboard |
| `VITE_ADSENSE_SLOT_TRACK` | Ad unit slot ID for Track page rectangle |
| `VITE_ADSENSE_SLOT_ARTIST` | Ad unit slot ID for Artist Profile leaderboard |
| `VITE_ADSENSE_SLOT_GATE` | Ad unit slot ID for Ad Gate modal rectangle |

All are optional-at-build-time; when absent, `GoogleAdUnit` renders nothing and no errors fire.

---

## Decision 7: Graceful Degradation Strategy

**Decision**: The `GoogleAdUnit` React component:
1. Checks `VITE_ADSENSE_PUBLISHER_ID` — if absent, renders `null`.
2. Wraps the `<ins>` push in a `try/catch` — if `window.adsbygoogle` is not available (blocked), silently no-ops.
3. Does NOT throw or log errors to console.
4. The ad-gate countdown and download flow have NO dependency on the Google ad rendering — the timer runs independently (existing `AdGateModal` logic unchanged).

---

## Existing Code Reuse Map

| Existing Asset | Reuse |
|---------------|-------|
| `api/src/common/ads-config.util.ts` | Extend `AdsConfig` type + add `googleAdsEnabled` field |
| `api/src/modules/ads/ads.service.ts` | Extend `updateConfig` / `getPublicConfig` to include `googleAdsEnabled` |
| `api/src/modules/ads/dto/update-ads-config.dto.ts` | Add optional `googleAdsEnabled` field |
| `client/src/hooks/useAds.ts` | Extend `AdsConfig` type + `useAdsConfig` return shape |
| `client/src/components/ads/AdGateModal.tsx` | Add `GoogleAdUnit` slot inside countdown area; custom creative becomes fallback |
| `client/src/pages/AdminAdsPage.tsx` | Add Google AdSense status card section |
| `client/index.html` | Inject AdSense `<script>` tag |

**New files required**:
- `client/src/components/ads/GoogleAdUnit.tsx` — reusable AdSense `<ins>` wrapper
