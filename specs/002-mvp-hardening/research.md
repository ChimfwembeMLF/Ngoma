# Research: 002-mvp-hardening

**Date**: 2026-07-19

## R1 — Audio duration extraction

**Decision**: Use `music-metadata` to parse duration from the upload buffer in `MediaService.saveAudio` (or immediately after in `TracksService.uploadFiles`).

**Rationale**: Pure-JS parser works in Node without ffprobe dependency; reads MP3/M4A/WAV headers from buffer already in memory from Multer.

**Alternatives considered**:
- `ffprobe` / `fluent-ffmpeg` — accurate but requires system binary in Docker
- Client-side duration — unreliable; server must be source of truth

---

## R2 — PostgreSQL full-text search

**Decision**: Add `search_vector tsvector` column on `tracks` with GIN index. Populate via TypeORM `@BeforeInsert/@BeforeUpdate` hook or explicit service method combining `title`, `genre`, and joined `artist_name` (denormalized snippet or subquery).

**Rationale**: Native Postgres FTS with `plainto_tsquery('english', q)` gives relevance ranking via `ts_rank`. Matches discovery contract and scales beyond ILIKE.

**Alternatives considered**:
- ILIKE only — already implemented; rejected for scale and ranking
- Elasticsearch — overkill for MVP hardening scope

**Query pattern**:
```sql
WHERE search_vector @@ plainto_tsquery('english', :q)
ORDER BY ts_rank(search_vector, plainto_tsquery('english', :q)) DESC
```

---

## R3 — Admin UI bootstrap

**Decision**: Document SQL seed script `api/scripts/seed-admin.sql` to promote a user to ADMIN by email. Optional: one-time dev endpoint guarded by `NODE_ENV=development` (not in MVP hardening unless seed is insufficient).

**Rationale**: No self-registration as ADMIN in production; devs need a documented path for VS-101.

**Alternatives considered**:
- Hard-coded admin in migration — security risk if deployed blindly
- Separate admin app — out of scope

---

## R4 — Local dev port conflicts

**Decision**: Document in quickstart:
- Docker Postgres maps host **5433** when local Postgres uses 5432
- API default **4000**; set `PORT=4001` in `api/.env` when Mako occupies 4000
- Update `client/vite.config.ts` proxy target to match

**Rationale**: Observed on developer machine during 001 implement/run.

**Alternatives considered**:
- Stop local Postgres/Mako — not always possible on shared dev machines

---

## R5 — Admin client routing

**Decision**: Route `/admin/users` behind `ProtectedRoute` + role check (`user.role === 'ADMIN'`). Reuse TanStack Query hook `useAdminUsers`, `useDeactivateUser`.

**Rationale**: Consistent with existing auth patterns; no new auth system.

**Alternatives considered**:
- Separate admin SPA — rejected per constitution simplicity
