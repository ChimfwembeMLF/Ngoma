# Feature Specification: MVP Hardening & Convergence

**Feature Branch**: `002-mvp-hardening`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Close MVP gaps after 001-platform-mvp: admin UI, audio duration extraction, PostgreSQL FTS search, dev config documentation, quickstart validation"

**Depends on**: `001-platform-mvp` (implemented)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin User Management UI (Priority: P1)

An admin signs in and views a paginated list of platform users, filters by role, and deactivates abusive accounts without using Swagger or curl.

**Why this priority**: FR-011 requires admin user management; API exists but no client UI blocks MVP launch criteria ("Admin can manage users").

**Independent Test**: Sign in as ADMIN, open `/admin/users`, see user list, deactivate a test user, confirm `isActive=false` via API.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** they open the admin users page, **Then** they see email, name, role, status, and join date.
2. **Given** an active user, **When** admin clicks deactivate, **Then** the user cannot sign in and the list reflects inactive status.
3. **Given** a non-admin user, **When** they navigate to `/admin/users`, **Then** access is denied (redirect or 403).

---

### User Story 2 - Accurate Track Duration (Priority: P2)

When an artist uploads an MP3, the track record stores the correct duration in seconds and discovery/track pages display it.

**Why this priority**: Duration is core metadata for listeners; currently stays 0 after upload.

**Independent Test**: Upload MP3, verify `duration > 0` on track detail and discovery cards.

**Acceptance Scenarios**:

1. **Given** an artist uploads a valid MP3, **When** upload completes, **Then** `tracks.duration` is set from audio metadata.
2. **Given** a track with duration, **When** a listener views track or discovery, **Then** duration displays as mm:ss.

---

### User Story 3 - Full-Text Search (Priority: P2)

Listeners search tracks by title, artist name, or genre using PostgreSQL full-text search instead of slow ILIKE scans.

**Why this priority**: Discovery contract specifies FTS; ILIKE fallback does not scale and misses relevance ranking.

**Independent Test**: Publish tracks with distinct titles; search partial terms; results ranked and faster than ILIKE baseline.

**Acceptance Scenarios**:

1. **Given** published tracks exist, **When** user searches `q=afro`, **Then** matching tracks return ordered by relevance.
2. **Given** search with no matches, **When** query runs, **Then** empty list returns without error.

---

### User Story 4 - Dev Environment & Quickstart Alignment (Priority: P3)

Developers follow quickstart.md and successfully run the stack when local Postgres occupies port 5432 or Mako API occupies port 4000.

**Why this priority**: Documented gaps from 001 implementation (ports 5433/4001) block onboarding.

**Independent Test**: New developer follows quickstart on machine with port conflicts; all VS-1–VS-5 scenarios pass.

**Acceptance Scenarios**:

1. **Given** quickstart instructions, **When** developer starts infra and services, **Then** health check succeeds without manual guesswork on ports.
2. **Given** running stack, **When** VS-1 through VS-5 are executed, **Then** each scenario passes or documented exceptions are explicit.

---

### Edge Cases

- Admin cannot deactivate their own account.
- Corrupt or zero-length audio files reject upload with clear error; duration not set.
- FTS special characters in search query are sanitized.
- Deactivated user's existing download access policy unchanged (read-only until expiry).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-101**: System MUST provide an admin-only client page listing users with pagination.
- **FR-102**: Admin MUST deactivate users via existing `POST /api/v1/admin/users/:id/deactivate`.
- **FR-103**: System MUST extract audio duration on track upload and persist to `tracks.duration`.
- **FR-104**: System MUST implement PostgreSQL FTS for `GET /api/v1/discovery/search`.
- **FR-105**: Client MUST display track duration in mm:ss on discovery and track pages.
- **FR-106**: Quickstart MUST document port 5433 (Docker Postgres) and configurable API port.
- **FR-107**: At least one seed ADMIN user path MUST be documented for local dev (migration or script).

### Key Entities

- **User** (existing): `isActive` toggled by admin; no schema change.
- **Track** (existing): `duration` populated on upload; optional `search_vector tsvector` column for FTS.

## Success Criteria *(mandatory)*

- **SC-101**: Admin completes user deactivation in under 30 seconds from dashboard.
- **SC-102**: 100% of valid MP3 uploads get non-zero duration within upload request.
- **SC-103**: Search returns results in < 200ms p95 for 10k tracks (indexed FTS).
- **SC-104**: Quickstart VS-1–VS-5 pass on clean dev machine following docs only.

## Assumptions

- Builds on existing `001-platform-mvp` codebase; no greenfield rewrite.
- FTS uses PostgreSQL `tsvector` + GIN index (English config sufficient for MVP).
- Duration extraction uses server-side library (e.g. `music-metadata`) on upload buffer.
- Admin role assignment for dev via SQL seed or env bootstrap script.

## Out of Scope

- Content moderation beyond user deactivate (reports, track takedown UI).
- Phase 2 features (analytics, PWYW, playlists, payouts).
- Production CI/CD pipeline setup.
