<!--
Sync Impact Report
- Version change: (unset template) → 1.0.0
- Modified principles: All placeholders replaced with Ngoma + mako-aligned rules
- Added sections: Technology Stack, Project Structure, API Conventions, Client Conventions
- Templates updated: plan-template.md, tasks-template.md, constitution-template.md
- Skills updated: speckit-analyze, speckit-tasks, speckit-plan, speckit-implement
- Follow-up TODOs: none
-->

# Ngoma Constitution

## Core Principles

### I. Modular Monorepo (mako layout)

Every feature MUST map to the established `api/` + `client/` yarn-workspace monorepo
pattern used in `mako`. The API is NestJS; the client is React + Vite. Do not introduce
alternate backend or frontend roots (`backend/`, `frontend/`, Next.js app router, etc.)
without an explicit constitution amendment.

### II. Feature Modules First (NestJS)

Backend work MUST live under `api/src/modules/<feature>/` with:
`<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`, `entities/`,
and `dto/`. Register new modules in `api/src/app.module.ts`. Shared cross-cutting code
belongs in `api/src/common/`, `filters/`, `guards/`, or `interceptors/` — not in
feature modules.

### III. TypeORM + Migrations (NON-NEGOTIABLE)

Database access MUST use TypeORM entities and repositories. Schema changes MUST ship as
TypeORM migrations in `api/database/migrations/`. Production MUST NOT rely on
`DB_SYNCHRONIZE=true`. Dev may use synchronize only for local bootstrap; migrations are
the source of truth for shared environments.

### IV. API Contract Discipline

REST endpoints MUST be prefixed with `/api/v1/`, documented with Swagger
(`@ApiTags`, `@ApiBearerAuth`), protected with `JwtAuthGuard` where auth is required,
and validated with DTOs + global `ValidationPipe` (class-validator). Rate limiting MUST
use `@nestjs/throttler`. Payment and webhook flows MUST follow the patterns in
`mako/api/src/modules/payments/`.

### V. Client Conventions (React + Vite)

Frontend features MUST use React 18 + TypeScript + Vite in `client/src/`. UI MUST use
Tailwind CSS + shadcn/ui + Radix. Server state MUST use TanStack Query. Forms MUST use
React Hook Form + Zod. API calls MUST target the NestJS API via `VITE_API_BASE_URL` or
the Vite dev proxy (`/api` → `http://localhost:4000`). Do not use Next.js, Prisma, or
Express route handlers in this project.

### VI. Simplicity & Scope Control

Implement the smallest correct diff. Reuse existing modules, entities, and UI patterns
before adding abstractions. New dependencies require justification in plan.md. Tests
are added when requested or when they cover non-trivial behavior — not for trivial
wrappers.

## Technology Stack

| Layer | Stack | Reference |
|-------|-------|-----------|
| Runtime | Node.js 20+ | `mako/package.json` engines |
| Package manager | Yarn 4 (Corepack) | `mako` monorepo workspaces |
| API | NestJS 11+, TypeORM, PostgreSQL, Redis, BullMQ | `mako/api/` |
| Auth | @nestjs/jwt, Passport, JwtAuthGuard | `mako/api/src/modules/auth/` |
| Client | React 18, Vite, Tailwind, shadcn/ui, TanStack Query | `mako/client/` |
| Storage | Supabase Storage / S3 | `mako/api/src/modules/media/` |
| Payments | PawaPay via payments module | `mako/api/src/modules/payments/` |
| Testing | Jest (api), Vitest + Testing Library (client) | workspace scripts |

Full product requirements live in `PROJECT REQUIREMENTS.md` at the repo root.

## Project Structure

```text
ngoma/
├── api/                          # NestJS API (mirror mako/api layout)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── modules/<feature>/
│   │   ├── common/
│   │   ├── database/
│   │   ├── filters/
│   │   └── guards/
│   ├── database/migrations/
│   ├── test/
│   └── Dockerfile
├── client/                       # React + Vite SPA (mirror mako/client)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── vite.config.ts
├── specs/                        # Spec Kit feature artifacts
├── .specify/                     # Spec Kit config & templates
└── PROJECT REQUIREMENTS.md
```

## Development Workflow

1. **Specify** → user-facing spec in `specs/<feature>/spec.md` (technology-agnostic)
2. **Plan** → technical design in `plan.md` using `api/` + `client/` paths
3. **Tasks** → executable tasks with exact file paths under `api/` or `client/`
4. **Implement** → one module/feature at a time; run `yarn lint` / tests in each workspace
5. **Migrate** → `yarn migrations:run` in `api/` for any schema change

Local dev defaults: API on port **4000**, Vite client with `/api` proxy to the API.

## Governance

This constitution supersedes generic Spec Kit defaults and any conflicting stack
guidance. Amendments require updating this file, bumping the version (semver), and
syncing `.specify/templates/` and affected `.cursor/skills/speckit-*` files.

All plans MUST pass a Constitution Check before Phase 0 research. Violations MUST be
documented in plan.md Complexity Tracking with justification.

Compliance review: every PR implementing spec-kit work MUST verify module layout,
TypeORM migrations, `/api/v1/` prefix, and client path conventions.

**Version**: 1.0.0 | **Ratified**: 2026-07-19 | **Last Amended**: 2026-07-19
