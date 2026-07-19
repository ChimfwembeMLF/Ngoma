# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript on Node.js 20+ (api + client workspaces)

**Primary Dependencies**:
- API: NestJS 11+, TypeORM, @nestjs/jwt, @nestjs/throttler, class-validator, BullMQ
- Client: React 18, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod

**Storage**: PostgreSQL 15+ (TypeORM entities + migrations in `api/database/migrations/`)

**Testing**: Jest (`api/test/`, `api/src/**/*.spec.ts`), Vitest (`client/src/**/*.test.tsx`)

**Target Platform**: Web (mobile-first SPA + REST API)

**Project Type**: Yarn-workspace monorepo — `api/` (NestJS) + `client/` (React + Vite)

**Performance Goals**: [domain-specific, e.g., API p95 < 200ms, mobile LCP targets]

**Constraints**: Follow `mako/api` module layout; all routes under `/api/v1/`; no Prisma/Next.js/Express

**Scale/Scope**: [domain-specific]

**Reference**: `PROJECT REQUIREMENTS.md`, `mako/api/` and `mako/client/` for structural conventions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Feature maps to `api/src/modules/<feature>/` (new module) or extends an existing module
- [ ] No alternate backend/frontend roots introduced
- [ ] Schema changes use TypeORM migrations (not synchronize-only in shared envs)
- [ ] API endpoints use `/api/v1/`, DTOs, JwtAuthGuard, Swagger tags
- [ ] Client work stays in `client/src/` with TanStack Query for server state
- [ ] Payment/webhook work reuses payments module patterns from `mako/api`

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   └── [feature]/
│   │       ├── [feature].module.ts
│   │       ├── [feature].controller.ts
│   │       ├── [feature].service.ts
│   │       ├── entities/
│   │       └── dto/
│   ├── common/
│   ├── guards/
│   └── filters/
├── database/
│   └── migrations/
└── test/

client/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── lib/
└── vite.config.ts
```

**Structure Decision**: Ngoma uses the mako monorepo layout. Backend features are NestJS
modules under `api/src/modules/`. Frontend features are pages/components under
`client/src/`. Cross-cutting API code goes in `api/src/common/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., new top-level package] | [current need] | [why api/client insufficient] |
