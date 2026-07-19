# Research: Playlist Sharing & Curated Playlists

**Feature**: 010-playlist-sharing-curated | **Date**: 2026-07-19

## R1: Share link format

**Decision**: Add `share_slug` column (unique, nullable). Client URL: `/playlists/share/{slug}`. API: `GET /api/v1/playlists/share/:slug`.

**Rationale**: Human-readable links distinct from UUID; slug stable across renames; 008 UUID route preserved for backward compatibility.

**Alternatives considered**:
- UUID-only copy link — rejected; satisfies minimal sharing but not “share links” product wording
- Separate `playlist_shares` table — rejected; overkill for MVP

## R2: Slug generation

**Decision**: On public playlist create or when user first copies share link (or always on curated create): `slugify(name)-{6 char random}` lowercase, max 80 chars. Immutable after assignment.

**Rationale**: Collision-resistant; readable; no user-editable slug UI in MVP.

**Alternatives considered**:
- User-chosen slug — deferred; moderation risk

## R3: Curated playlist ownership

**Decision**: Curated playlists use `userId` of creating ADMIN user; `isCurated: true`, `isPublic: true`. Only admin API can set `isCurated`.

**Rationale**: Reuses 008 schema; no system user table needed if admin creates via API/seed.

**Alternatives considered**:
- Nullable `userId` for system playlists — rejected; FK constraint requires user

## R4: Admin API placement

**Decision**: Routes on `AdminController` at `/api/v1/admin/playlists/curated/*` delegating to `PlaylistsService` methods with `isCurated` guard.

**Rationale**: Matches existing admin pattern (`/admin/users`); keeps playlist domain logic in PlaylistsService.

**Alternatives considered**:
- Separate `CuratedPlaylistsController` in playlists module with RolesGuard — acceptable but splits admin surface

## R5: Discover curated section

**Decision**: `GET /api/v1/playlists/curated` returns summaries; DiscoverPage horizontal scroll or grid section “Curated by Ngoma” above Trending.

**Rationale**: Wireframe §4.1.4; minimal diff on existing Discover layout.

## R6: Share UX

**Decision**: Playlist detail shows “Copy link” button for public playlists; optional “Share” uses `navigator.share` when available. Link uses slug URL if slug exists; else trigger slug generation via `POST /api/v1/playlists/:id/share` (owner) or use UUID fallback.

**Rationale**: Private playlists not shareable; owner can enable slug on demand.

**Alternatives considered**:
- Auto-generate slug on every public playlist create — simpler; adopt for curated + lazy-generate for user public playlists on first copy

## R7: Seed data

**Decision**: Migration or SQL seed inserts 2 curated playlists (“Afrobeats Hits”, “Zambian Gold”) with tracks from existing demo seed if available.

**Rationale**: VS-1003 requires visible curated content in dev without manual admin steps.

## R8: Controller route ordering

**Decision**: Register `GET curated` and `GET share/:slug` **before** `GET :id` in `PlaylistsController`.

**Rationale**: NestJS matches in order; prevents `curated` captured as id.
