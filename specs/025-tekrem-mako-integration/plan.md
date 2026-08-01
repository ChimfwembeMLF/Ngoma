# Implementation Plan: Tekrem & Mako Ecosystem Integration

**Branch**: `025-tekrem-mako-integration` | **Date**: 2026-08-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/025-tekrem-mako-integration/spec.md`

## Summary

Integrate Ngoma (Music Commerce & Distribution) directly with Tekrem ID (Unified OIDC/OAuth 2.0 Authentication) and Mako (AI Marketing Engine & Fan CRM) without introducing breaking changes or schema modifications to either external project. This architecture establishes single sign-on across the artist suite, enables one-click song promotion with automated metadata synchronization into Mako's social suite, generates traceable smart links with conversion attribution, presents a unified ROI analytics dashboard composited with Ngoma's sales revenue, and powers automated Fan CRM audience segmentation.

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM, @nestjs/jwt, @nestjs/throttler, class-validator, BullMQ, axios/fetch for Mako API reads
- Client: React 18, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod

**Storage**: PostgreSQL 15+ (TypeORM entities + migrations in `api/database/migrations/`)

**Testing**: Jest (`api/test/`, `api/src/**/*.spec.ts`), Vitest (`client/src/**/*.test.tsx`)

**Target Platform**: Web (mobile-first SPA + REST API)

**Project Type**: Yarn-workspace monorepo — `api/` (NestJS) + `client/` (React + Vite)

**Performance Goals**: API p95 < 150ms for ROI calculation and analytics dashboard aggregation; sub-second smart link redirection and referral tracking.

**Constraints**: Follow `mako/api` module layout; all routes under `/api/v1/`; no Prisma/Next.js/Express; strictly respect external OIDC 1.0 specifications for Tekrem Auth and multi-tenant isolation in Mako.

**Scale/Scope**: Scales to support tens of thousands of artists managing catalog releases, tracking concurrent smart link campaigns across global messaging platforms (WhatsApp, Telegram, Facebook, Instagram), and generating aggregated financial return analyses.

**Reference**: `PROJECT REQUIREMENTS.md`, `mako/api/`, and `mako/client/` for structural conventions.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Feature maps to `api/src/modules/<feature>/` (new module) or extends an existing module
- [x] No alternate backend/frontend roots introduced
- [x] Schema changes use TypeORM migrations (not synchronize-only in shared envs)
- [x] API endpoints use `/api/v1/`, DTOs, JwtAuthGuard, Swagger tags
- [x] Client work stays in `client/src/` with TanStack Query for server state
- [x] Payment/webhook work reuses payments module patterns from `mako/api`

## Project Structure

### Documentation (this feature)

```text
specs/025-tekrem-mako-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── mako-integration-api.yaml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
api/
├── src/
│   ├── app.module.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── tekrem-oidc.service.ts
│   │   │   └── tekrem-oidc.controller.ts
│   │   └── marketing-integration/
│   │       ├── marketing-integration.module.ts
│   │       ├── marketing-integration.controller.ts
│   │       ├── marketing-integration.service.ts
│   │       ├── entities/
│   │       │   ├── tekrem-account-link.entity.ts
│   │       │   ├── mako-promotion-campaign.entity.ts
│   │       │   ├── smart-link-attribution.entity.ts
│   │       │   └── fan-segment.entity.ts
│   │       └── dto/
│   │           ├── promote-release.dto.ts
│   │           ├── create-smart-link.dto.ts
│   │           └── roi-filter.dto.ts
│   ├── common/
│   └── database/
│       └── migrations/
│           └── 1722470000000-CreateMarketingIntegrationTables.ts
└── test/
    └── marketing-integration.e2e-spec.ts

client/
├── src/
│   ├── pages/
│   │   ├── marketing/
│   │   │   ├── PromotionDashboardPage.tsx
│   │   │   ├── RoiAnalyticsPage.tsx
│   │   │   └── FanCrmPage.tsx
│   ├── components/
│   │   └── marketing/
│   │       ├── PromoteWithMakoDialog.tsx
│   │       ├── RoiSummaryCard.tsx
│   │       ├── SmartLinkGenerator.tsx
│   │       └── AudienceSegmentTable.tsx
│   └── hooks/
│       └── useMarketingIntegration.ts
└── vite.config.ts
```

**Structure Decision**: Ngoma uses the established mako monorepo layout. Backend integration logic resides cleanly within a new NestJS module (`api/src/modules/marketing-integration/`) alongside OIDC enhancements in `api/src/modules/auth/`. Frontend user experiences map to dedicated React Vite components and pages in `client/src/`.

## Complexity Tracking

> No complexity violations identified. All modules strictly adhere to existing project rules and monorepo boundaries.
