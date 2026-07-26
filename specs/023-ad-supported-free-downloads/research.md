# Research: Ad-Supported Free Track Downloads

**Feature**: 023-ad-supported-free-downloads  
**Date**: 2026-07-19

---

## R1: What does "Free Download (Ad-supported)" mean in Ngoma?

**Decision**: `pricingType = FREE` means **zero purchase price** but **ad gate required before download**. Streaming remains free without ads.

**Rationale**: Matches `PROJECT REQUIREMENTS.md` §3.3.1 pricing radio "Free Download (Ad-supported)" and Phase 2 Week 15–16. Feature 022 established direct FREE download; 023 adds monetization layer without new pricing enum.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| New `FREE_AD_SUPPORTED` enum | Duplicates FREE; migration + UI churn |
| Ads on stream too | Scope creep; bandwidth cost without clear PRD |
| Optional per-track ad flag | PRD treats free tier as ad-supported by default |

---

## R2: Ad format for MVP

**Decision**: **House creatives** — admin-managed banner image + optional link, shown in modal with **countdown timer** (default 5s). No external ad SDK in MVP.

**Rationale**: No AdSense approval cycle; full control; works offline in dev; matches African market where house/promo ads are common for launch.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Google AdSense iframe | Policy, CSP, payout setup, latency |
| Full video pre-roll | Heavy media pipeline; overkill for MVP |
| Honor-system client-only timer | Trivial API bypass |

---

## R3: Server-side ad session validation

**Decision**: Two-step flow with TTL:
1. `POST /api/v1/tracks/:id/ad-session` → returns `sessionId`, `creative`, `gateSeconds`
2. After countdown, `POST /api/v1/ad-sessions/:id/complete`
3. `GET /api/v1/tracks/:id/download` requires header `X-Ad-Session-Id` matching completed session for FREE tracks

**Rationale**: Prevents curl bypass; session bound to `userId` + `trackId`; short TTL (2 min).

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Query param only | Easier to share/leak |
| Embed proof in JWT claims | Heavier; session table simpler |

---

## R4: Revenue attribution

**Decision**: MVP — **100% platform revenue** from ad-supported downloads. Record impressions for reporting; **no artist earnings row** until CPM/pricing model defined.

**Rationale**: Product question "how does company make money" — ads supplement 30% download fees and 5% tip fees. Artist value = exposure + funnel to paid/tips. Rev share can be Phase 2 when CPM exists.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| 70/30 artist split like downloads | No CPM rate yet; premature |
| Pay artist per impression | Requires payout accounting |

---

## R5: Storage for creatives & settings

**Decision**: 
- Migration adds `ad_creatives` table + `ad_sessions` + `ad_impressions`
- `platform_settings` JSONB column `ads_config`: `{ adsEnabled: true, gateSeconds: 5 }`

**Rationale**: Creatives are relational (admin CRUD); config is singleton like theme/branding.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Creatives only in JSONB | Harder to query impressions by creative |
| Separate ads module | Good — use `api/src/modules/ads/` |

---

## R6: Admin kill switch

**Decision**: `adsEnabled: false` in platform settings bypasses ad gate; FREE downloads behave like feature 022 (direct download).

**Rationale**: Launch safety; staging/dev convenience; admin can disable if no campaigns.

---

## R7: UI placement

**Decision**: `AdGateModal` component opened from `TrackPage` on Download free click; blocks download until complete.

**Rationale**: Single conversion point; contract in `track-page-ad-gate-ui.md`.
