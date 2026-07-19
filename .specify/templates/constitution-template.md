# [PROJECT_NAME] Constitution

## Core Principles

### I. Modular Monorepo (mako layout)

Every feature MUST map to the established `api/` + `client/` yarn-workspace monorepo
pattern used in `mako`. The API is NestJS; the client is React + Vite.

### II. Feature Modules First (NestJS)

Backend work MUST live under `api/src/modules/<feature>/` with module, controller,
service, entities/, and dto/. Register new modules in `api/src/app.module.ts`.

### III. TypeORM + Migrations (NON-NEGOTIABLE)

Database access MUST use TypeORM. Schema changes MUST ship as migrations in
`api/database/migrations/`. Production MUST NOT rely on `DB_SYNCHRONIZE=true`.

### IV. API Contract Discipline

REST endpoints MUST use `/api/v1/`, Swagger tags, JwtAuthGuard, and class-validator DTOs.

### V. Client Conventions (React + Vite)

Frontend MUST use React 18 + Vite in `client/src/` with Tailwind, shadcn/ui, and TanStack Query.

### VI. Simplicity & Scope Control

Implement the smallest correct diff. Reuse existing patterns before adding abstractions.

## Technology Stack

| Layer | Stack |
|-------|-------|
| API | NestJS 11+, TypeORM, PostgreSQL, Redis |
| Client | React 18, Vite, Tailwind, shadcn/ui, TanStack Query |
| Package manager | Yarn 4 workspaces (`api`, `client`) |

See `PROJECT REQUIREMENTS.md` and `mako/api/` for full conventions.

## Governance

This constitution supersedes generic Spec Kit defaults. Amendments require version bump
and template sync.

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
