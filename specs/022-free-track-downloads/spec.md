# Feature Specification: Free Track Downloads & Download Access UX

**Feature Branch**: `022-free-track-downloads`

**Created**: 2026-07-19

**Status**: Draft

**Input**: TrackPage download returns 403 Forbidden. User question: "should we allow free downloads?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Download free tracks (Priority: P1)

A signed-in listener opens a track with `pricingType: FREE` and downloads the audio file without checkout.

**Why this priority**: Free downloads are core MVP behavior (spec 001/006); 403 breaks trust on free content.

**Independent Test**: Publish FREE track → sign in → TrackPage → "Download free" → file saves successfully.

**Acceptance Scenarios**:

1. **Given** a published FREE track and authenticated listener, **When** `GET /api/v1/tracks/:id/download` is called, **Then** response is `200` with audio attachment (no `download_access` row required).
2. **Given** FREE track TrackPage, **When** listener clicks "Download free", **Then** download completes without error.
3. **Given** anonymous visitor on FREE track, **When** page loads, **Then** user is prompted to sign in to download (unchanged — login required for download analytics).

---

### User Story 2 - Paid tracks require purchase (Priority: P1)

A listener cannot download SET_PRICE or PAY_WHAT_YOU_WANT tracks until payment completes and `download_access` exists.

**Why this priority**: Prevents revenue leakage; 403 is correct server behavior for unpaid paid tracks.

**Independent Test**: Paid track without purchase → download API returns 403; UI does not offer download until entitled.

**Acceptance Scenarios**:

1. **Given** paid track and listener without `download_access`, **When** download is attempted, **Then** API returns `403` with message "Purchase required to download".
2. **Given** paid track TrackPage without access, **When** page loads, **Then** only "Buy" / checkout CTA is shown — **no** Download button.
3. **Given** completed purchase, **When** TrackPage loads, **Then** Download button appears and works.

---

### User Story 3 - Clear download entitlement on TrackPage (Priority: P1)

Track detail exposes whether the current user can download, so the UI never promises a download that will 403.

**Why this priority**: Current bug — Download button shown on paid tracks before purchase causes the reported error.

**Independent Test**: Paid track, logged in, not purchased → no Download button; after purchase → button appears.

**Acceptance Scenarios**:

1. **Given** authenticated request to `GET /api/v1/tracks/:id`, **When** track loads, **Then** response includes `canDownload: boolean`.
2. **Given** `canDownload: false` on paid track, **When** TrackPage renders, **Then** Download button is hidden.
3. **Given** download fails (network or 403), **When** user clicked download, **Then** friendly error message is shown (not uncaught promise).

---

### Edge Cases

- FREE track, logged in, no audio file uploaded → 404 "Audio not available" (unchanged).
- Expired `download_access.expiresAt` → `canDownload: false`, download 403.
- Artist owns their own paid track → no automatic download unless access row exists (out of scope; artists use dashboard).
- Deactivated user with existing access → policy unchanged per spec 002 (read-only until expiry).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-2201**: API MUST allow download for `pricingType = FREE` when user is authenticated — no purchase or `download_access` row required.
- **FR-2202**: API MUST require valid `download_access` for SET_PRICE and PAY_WHAT_YOU_WANT downloads (unchanged).
- **FR-2203**: `GET /api/v1/tracks/:id` MUST include `canDownload` when request carries valid JWT (optional auth).
- **FR-2204**: TrackPage MUST show Download only when `canDownload === true` (FREE + logged in, or paid + entitled).
- **FR-2205**: TrackPage MUST surface user-visible error on failed download instead of uncaught promise.
- **FR-2206**: FREE tracks MUST continue to require sign-in for download (no anonymous free download in this feature).

### Key Entities

- **Track** — `pricingType` determines free vs paid download path.
- **DownloadAccess** — grants paid download entitlement after successful payment.

## Success Criteria *(mandatory)*

- **SC-2201**: FREE track download succeeds for signed-in user (VS-2201).
- **SC-2202**: Paid track without purchase shows no Download button and API returns 403 if forced (VS-2202).
- **SC-2203**: Paid track after purchase shows Download and succeeds (VS-2203).
- **SC-2204**: No uncaught errors in browser console on failed download (VS-2204).

## Out of Scope

- Ad-supported anonymous free downloads (deferred per PROJECT REQUIREMENTS).
- Changing stream rules (stream remains public for published tracks).
- Artist self-download of own catalog without purchase.
