# Research: 005-artist-analytics

**Date**: 2026-07-19

## R1 — Data sources for metrics

**Decision**: Use existing tables only:
- **Net earnings**: `SUM(earnings.amount)` grouped by `artist_id`
- **Platform fees**: `SUM(earnings.platform_fee)` (optional transparency field)
- **Unique supporters**: `COUNT(DISTINCT earnings.user_id)`
- **Plays / downloads (totals)**: `SUM(tracks.plays)`, `SUM(tracks.downloads)` for artist's active tracks
- **Per-track row**: `tracks` LEFT JOIN aggregated earnings subquery on `track_id`

**Rationale**: `payments.service.ts` already writes earnings on completed purchases; track counters increment on stream/download. No duplicate event store needed.

**Alternatives considered**:
- New `analytics_events` table — over-engineering for first Phase 2 slice
- Artist `total_plays` / `total_downloads` columns — may drift; prefer SUM from tracks for consistency with per-track view

---

## R2 — Timeline aggregation

**Decision**: SQL `DATE_TRUNC('day', earnings.created_at)` grouped sum for last N days, filtered by `artist_id`. Default N=30; clamp query param to 7–90.

**Rationale**: Simple, index-friendly, no ORM complexity beyond QueryBuilder.

**Alternatives considered**:
- Client-side grouping — wastes bandwidth
- Materialized views — premature for MVP scale

---

## R3 — Performance index

**Decision**: Migration `1719000000005-EarningsArtistIndex.ts` adds:

```sql
CREATE INDEX idx_earnings_artist_created ON earnings(artist_id, created_at DESC);
```

**Rationale**: Timeline and recent earnings queries filter by artist + date range.

**Alternatives considered**:
- No index — acceptable for dev only; index is cheap insurance per SC-402

---

## R4 — Authorization pattern

**Decision**: Mirror tracks module — `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ARTIST)`. Resolve `artistId` from `req.user['artistId']`; throw `ForbiddenException` if missing.

**Rationale**: Consistent with existing artist endpoints; prevents cross-artist access.

**Alternatives considered**:
- Lookup artist by user sub on every request — redundant when JWT already carries `artistId`

---

## R5 — Client visualization

**Decision**: No chart library. Use:
- **Summary**: 4-column responsive grid of `Card` stat tiles
- **Per-track**: HTML table with design-system borders (reuse admin table patterns from 004)
- **Timeline**: vertical list of day + amount rows, or horizontal CSS flex bars proportional to max day

**Rationale**: Constitution prefers smallest diff; avoids Recharts/Chart.js dependency for first slice.

**Alternatives considered**:
- Recharts — better UX but new dependency; defer until export/charts feature

---

## R6 — Dashboard placement

**Decision**: Extend existing `/artist/dashboard` (`ArtistDashboardPage.tsx`) — analytics sections **above** upload form (summary first, then charts/tables, then upload + track list).

**Rationale**: PROJECT REQUIREMENTS wireframe merges analytics with artist dashboard; avoids new route until needed.

**Alternatives considered**:
- Separate `/artist/analytics` route — valid follow-up; not required for SC-401

---

## R7 — Seed / validation data

**Decision**: Document using existing `api/scripts/seed-demo-data.sql` + sandbox checkout to generate earnings; optionally extend seed script with sample earnings rows for artists without live PawaPay.

**Rationale**: Enables VS-401 without manual payment flow every time.

**Alternatives considered**:
- Analytics-only seed SQL file — optional polish in implement phase
