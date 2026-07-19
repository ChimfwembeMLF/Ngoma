# Feature Specification: Playlist Sharing & Curated Playlists

**Feature Branch**: `010-playlist-sharing-curated`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Phase 2 share links and curated playlists — public share URLs, admin curated playlists on discover"

**Depends on**: `001-platform-mvp` through `009-shadcn-spotify-redesign` (playlists module, public playlist GET, admin role, Spotify dark client)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy Share Link for Public Playlist (Priority: P1)

A listener or playlist owner copies a shareable link for a public playlist and sends it to a friend. The link opens the playlist detail without requiring sign-in.

**Why this priority**: Completes the 008 out-of-scope “share links” slice (`PROJECT REQUIREMENTS.md` §11.2 Week 17–18); public GET exists but there is no share UX or stable short URL.

**Independent Test**: VS-1001 — Owner copies link from playlist detail → paste in incognito → playlist loads with tracks.

**Acceptance Scenarios**:

1. **Given** a public playlist, **When** the owner clicks “Copy link”, **Then** clipboard contains a URL that resolves to that playlist detail.
2. **Given** a private playlist, **When** a non-owner views detail, **Then** no share button is shown (or copy is disabled with explanation).
3. **Given** an unauthenticated visitor opens a shared public playlist URL, **Then** track list renders without login prompt blocking content.

---

### User Story 2 - Resolve Playlist by Share Slug (Priority: P1)

Shared links use a human-readable slug (e.g. `/playlists/share/afrobeats-hits-a1b2`) in addition to UUID routes, so links are stable if playlist is renamed and easier to share.

**Why this priority**: Distinct “share link” product requirement vs raw UUID; slug stored on playlist row.

**Independent Test**: VS-1002 — `GET /api/v1/playlists/share/:slug` returns same detail as by id.

**Acceptance Scenarios**:

1. **Given** a public playlist with generated `shareSlug`, **When** client opens `/playlists/share/:slug`, **Then** detail page loads correctly.
2. **Given** invalid slug, **When** requested, **Then** 404.
3. **Given** playlist made private after slug issued, **When** non-owner requests by slug, **Then** 403.

---

### User Story 3 - Curated Playlists on Discover (Priority: P1)

Any visitor sees a “Curated by Ngoma” section on Discover with editorial playlists (`isCurated: true`) showing name, cover, and track count.

**Why this priority**: Wireframe §4.1.4; Week 17–18 curated playlists checkbox; `isCurated` column exists from 008 but is unused.

**Independent Test**: VS-1003 — Discover shows seeded curated cards; click opens playlist detail.

**Acceptance Scenarios**:

1. **Given** curated public playlists exist, **When** user opens `/discover`, **Then** “Curated by Ngoma” section lists them with track counts.
2. **Given** no curated playlists, **When** Discover loads, **Then** section hidden or empty state — no layout break.
3. **Given** curated playlist detail, **When** opened, **Then** tracks listed; owner actions hidden (admin-managed).

---

### User Story 4 - Admin Manages Curated Playlists (Priority: P2)

An admin creates a curated playlist, adds/removes published tracks, and publishes it to Discover. User-created playlists cannot set `isCurated` via normal API.

**Why this priority**: Editorial content requires admin-only mutation; listeners only consume.

**Independent Test**: VS-1004 — Admin creates “Afrobeats Hits”, adds tracks → appears in curated list API and Discover UI.

**Acceptance Scenarios**:

1. **Given** ADMIN JWT, **When** they `POST /api/v1/admin/playlists/curated`, **Then** playlist created with `isCurated: true`, `isPublic: true`, auto `shareSlug`.
2. **Given** LISTENER JWT, **When** they attempt curated create, **Then** 403.
3. **Given** admin adds track to curated playlist, **When** listed on Discover, **Then** track count updates.

---

### User Story 5 - Share via Web Share API (Optional Mobile) (Priority: P3)

On supported browsers, user taps “Share” and native share sheet opens with playlist title and URL.

**Independent Test**: VS-1005 — Share button calls `navigator.share` when available; falls back to copy.

**Acceptance Scenarios**:

1. **Given** `navigator.share` supported, **When** user taps Share, **Then** native sheet with title + URL.
2. **Given** unsupported browser, **When** user taps Share, **Then** copy-to-clipboard behavior (same as US1).

---

### Edge Cases

- Slug collision on create → append random suffix.
- Rename playlist does not break slug (slug immutable after create).
- Curated playlist with unpublished track removed from admin list → track excluded on add validation.
- UUID route `/playlists/:id` continues to work (backward compatible).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-1001**: System MUST add optional unique `share_slug` on `playlists` via migration.
- **FR-1002**: System MUST expose `GET /api/v1/playlists/share/:slug` for public curated/user playlists (same access rules as GET by id).
- **FR-1003**: System MUST expose `GET /api/v1/playlists/curated` (public) returning curated playlist summaries with `trackCount`.
- **FR-1004**: System MUST expose admin curated CRUD under `/api/v1/admin/playlists/curated` (create, update, delete, add/remove tracks) with `ADMIN` role.
- **FR-1005**: User playlist create/update MUST NOT allow setting `isCurated: true`.
- **FR-1006**: Client MUST show “Copy link” / “Share” on public playlist detail (owner or any viewer for public playlists).
- **FR-1007**: Client MUST register route `/playlists/share/:slug` resolving to playlist detail.
- **FR-1008**: Client MUST show “Curated by Ngoma” section on `DiscoverPage` using shadcn cards.
- **FR-1009**: Migration seed MUST insert 2–4 demo curated playlists for dev validation (optional tracks from seed data).
- **FR-1010**: No changes to payments, tipping, or checkout.

### Key Entities

- **Playlist** (extended): `shareSlug` (unique, nullable until public share enabled)
- **CuratedPlaylist**: Same table, `isCurated: true`, admin-owned `userId` (system admin user)

## Success Criteria *(mandatory)*

- **SC-1001**: Share link copy + incognito open works for public playlist.
- **SC-1002**: VS-1001–VS-1005 quickstart scenarios pass.
- **SC-1003**: Discover shows curated section when seed data present.
- **SC-1004**: User playlist flows from 008 unchanged (regression).
- **SC-1005**: Private playlists not shareable via slug to non-owners.

## Assumptions

- Share URL format: `{CLIENT_ORIGIN}/playlists/share/{slug}`.
- Slug generated on first share or on curated create (lowercase, hyphenated name + short id).
- Admin curated playlists owned by first ADMIN user in seed or dedicated system user.
- Embed codes / Open Graph meta tags deferred to follow-up slice.
- Playlist following (“Trending Playlists” wireframe) out of scope.

## Out of Scope

- Playlist following / social feed
- Algorithmic recommendations
- Embed iframe codes
- Open Graph / Twitter card meta tags (can be 010b)
- Trending user playlists ranking
- Playlist reorder drag-drop
