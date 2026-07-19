# Ngoma Project Conventions (mako-aligned)

Reference for Spec Kit workflows. Authoritative rules live in `.specify/memory/constitution.md`.

## Monorepo

```json
{
  "workspaces": ["api", "client"],
  "packageManager": "yarn@4.x",
  "engines": { "node": ">=20" }
}
```

## API (`api/`)

| Concern | Convention |
|---------|------------|
| Framework | NestJS 11+ |
| ORM | TypeORM |
| Module path | `api/src/modules/<feature>/` |
| Controller prefix | `@Controller('api/v1/<resource>')` |
| Auth | `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth()` |
| Validation | DTOs + global `ValidationPipe` (class-validator) |
| Docs | Swagger via `@ApiTags` |
| Migrations | `api/database/migrations/` |
| Port (dev) | 4000 |
| Reference | `../mako/api/` |

### Module skeleton

```text
api/src/modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── entities/
│   └── <name>.entity.ts
└── dto/
    └── create-<name>.dto.ts
```

## Client (`client/`)

| Concern | Convention |
|---------|------------|
| Framework | React 18 + TypeScript + Vite |
| UI | Tailwind + shadcn/ui + Radix |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Env | `VITE_API_BASE_URL` |
| Dev proxy | `/api` → `http://localhost:4000` |
| Reference | `../mako/client/` |

## Forbidden in Ngoma specs/plans/tasks

- Next.js, Prisma, Express route files
- `backend/` or `frontend/` as project roots
- Production `DB_SYNCHRONIZE=true`
- API routes without `/api/v1/` prefix

## Key docs

- `PROJECT REQUIREMENTS.md` — product + technical requirements
- `mako/api/src/app.module.ts` — module registration pattern
- `mako/api/src/modules/payments/` — PawaPay integration pattern
