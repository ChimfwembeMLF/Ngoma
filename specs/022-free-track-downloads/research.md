# Research: Free Track Downloads & Download Access UX

**Feature**: 022-free-track-downloads  
**Date**: 2026-07-19

---

## R1: Should we allow free downloads?

**Decision**: **Yes** — FREE tracks (`pricingType = FREE`) MUST allow download for authenticated listeners without checkout.

**Rationale**:
- Documented in spec 001 (MVP listener loop), spec 006 (PWYW regression SC-605), and `tracks.service.ts` already implements this path.
- FREE means zero-cost; download is the primary value exchange for listeners.
- Stream is already public; download adds file ownership and increments analytics counters.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Require checkout even for FREE | Contradicts existing product specs and API |
| Anonymous free download | Out of scope; login enables download analytics and abuse throttling |
| Block all downloads | Breaks MVP |

---

## R2: Root cause of reported 403

**Decision**: The 403 is **expected API behavior for paid tracks without purchase**, exacerbated by a **client UI bug**.

**Findings**:

| Layer | Behavior |
|-------|----------|
| `tracks.service.download()` | FREE → allow; paid → require `download_access` or 403 |
| `TrackPage.tsx` | Shows Download on **all** logged-in paid tracks (lines 133–135) without checking entitlement |
| `GET /tracks/:id` | Does not return `canDownload`; client cannot gate UI |

**Rationale**: User clicks Download on a paid track → API correctly returns 403 → client throws uncaught "Download failed".

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Remove download for paid tracks entirely | Post-purchase download is required MVP behavior |
| Auto-grant access on login | Revenue leakage |

---

## R3: How to expose download entitlement to client

**Decision**: Add `canDownload: boolean` to track detail response using existing `OptionalJwtAuthGuard` on `GET /api/v1/tracks/:id`.

**Rationale**:
- `OptionalJwtAuthGuard` already used in playlists module — consistent pattern.
- `TracksService.hasDownloadAccess(userId, trackId)` already exists — reuse, no new tables.
- Single round-trip; TrackPage already fetches track detail.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Separate `GET /tracks/:id/access` | Extra request for every TrackPage view |
| Client-only heuristic (`pricingType === FREE`) | Insufficient for paid+owned case |
| Infer from checkout redirect only | Stale after purchase on another device |

---

## R4: Download error UX

**Decision**: TrackPage download handler sets visible error state; parse API message when available.

**Rationale**: Uncaught promise pollutes console and confuses users; aligns with checkout error patterns.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Toast library (new dep) | Over-scoped for one button |
| Silent failure | Poor UX |

---

## R5: Auth requirement for FREE download

**Decision**: Keep **JWT required** for download endpoint; FREE tracks show "Sign in to download" when logged out.

**Rationale**:
- Matches current `JwtAuthGuard` on download route and spec 001 quickstart ("authenticated fetch + blob").
- Enables per-user download counts and future rate limits.

**Alternatives considered**:
| Alternative | Rejected because |
|-------------|------------------|
| Public download for FREE | Scope expansion; no product request |
