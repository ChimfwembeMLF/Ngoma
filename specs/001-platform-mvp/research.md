# Research: 001-platform-mvp

**Date**: 2026-07-19

## R1: Monorepo & project bootstrap

**Decision**: Yarn 4 workspaces with `api/` (NestJS) and `client/` (React + Vite), mirroring `mako/`.

**Rationale**: Constitution mandates mako layout. Existing reference implementation covers auth, payments, media, migrations, and deployment patterns.

**Alternatives considered**:
- Separate repos — rejected; harder to share types and coordinate releases.
- Next.js full-stack — rejected; constitution requires SPA + NestJS API.

## R2: Database & ORM

**Decision**: PostgreSQL 15+ with TypeORM entities and migrations in `api/database/migrations/`.

**Rationale**: Matches mako/api, supports JSONB (social links, credits), arrays (genres), and ACID transactions for payments.

**Alternatives considered**:
- Prisma — rejected by constitution.
- MongoDB — rejected; relational model fits payments and access control.

## R3: Authentication

**Decision**: @nestjs/jwt + Passport JWT strategy; access token 24h, refresh 7d; bcrypt password hashing.

**Rationale**: Identical pattern in `mako/api/src/modules/auth/`. Roles: LISTENER, ARTIST, ADMIN.

**Alternatives considered**:
- Session-only cookies — rejected for mobile-first SPA; JWT + refresh is simpler for API client.

## R4: File & media storage

**Decision**: Supabase Storage (production) with local `api/uploads/` fallback for dev; media module pattern from `mako/api/src/modules/media/`.

**Rationale**: Requirements specify Supabase/S3; mako already integrates Supabase for uploads.

**Alternatives considered**:
- Direct browser-to-S3 only — rejected for MVP; server-mediated upload simplifies auth and validation.

## R5: Payments (PawaPay)

**Decision**: Port payment flow from `mako/api/src/modules/payments/` — deposit initiate, webhook handler, status polling, mobile-money provider list.

**Rationale**: mako already ships working PawaPay client, FX helpers, and webhook patterns adapted for Ngoma entities (Payment, DownloadAccess, Earnings).

**Alternatives considered**:
- PHP SDK from requirements doc — rejected; NestJS TypeScript client already proven in mako.

## R6: Audio playback & upload limits

**Decision**: Howler.js on client; accept MP3/WAV/FLAC up to 50MB per track for MVP; stream via signed URL or proxied `/api/v1/tracks/:id/stream`.

**Rationale**: Stated in PROJECT REQUIREMENTS; Howler.js listed in frontend stack.

**Alternatives considered**:
- HLS adaptive streaming — deferred; overkill for MVP single-file tracks.

## R7: Search & discovery

**Decision**: PostgreSQL full-text search on track title + artist name for MVP; dedicated search module optional in Phase 2.

**Rationale**: Requirements allow PostgreSQL FTS before Elasticsearch; reduces infra for MVP.

**Alternatives considered**:
- Elasticsearch — deferred to scale phase per requirements §6.1.3.

## R8: Rate limiting & security

**Decision**: @nestjs/throttler with Redis store; Helmet in production; class-validator on all DTOs.

**Rationale**: mako/api main.ts and AppModule already configure these patterns.

## R9: CI/CD (MVP)

**Decision**: GitHub Actions — lint + build api/client on PR; Docker Compose for local dev (postgres, redis, api, client).

**Rationale**: Aligns with mako CI_CD.md and requirements §11.1 Week 1-2.

**Alternatives considered**:
- PM2 single-app deploy — post-MVP production target; local dev uses Docker Compose first.
