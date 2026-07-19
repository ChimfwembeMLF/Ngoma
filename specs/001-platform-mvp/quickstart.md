# Quickstart: 001-platform-mvp

**Purpose**: Validate MVP user stories end-to-end after implementation.

**Prerequisites**:
- Node.js 20+, Yarn 4 (Corepack)
- Docker (PostgreSQL + Redis) or local Postgres/Redis
- PawaPay sandbox token in `api/.env`

## 1. Start infrastructure

```bash
cd /path/to/Ngoma
docker compose up -d postgres redis
```

## 2. Configure API

Copy `api/.env.example` → `api/.env` and set at minimum:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://ngoma:ngoma@localhost:5432/ngoma
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_jwt_secret_change_me
JWT_REFRESH_SECRET=dev_refresh_secret_change_me
PAWAPAY_ENVIRONMENT=sandbox
PAWAPAY_SANDBOX_API_TOKEN=<your_token>
PAWAPAY_WEBHOOK_URL=http://localhost:4000/api/v1/payments/webhook
```

## 3. Install and migrate

```bash
corepack enable
yarn install
cd api && yarn migrations:run
```

## 4. Run services

```bash
# Terminal 1 — API
yarn workspace @ngoma/api dev

# Terminal 2 — Client
yarn workspace @ngoma/client dev
```

Client: http://localhost:5173  
API docs: http://localhost:4000/documentation

## Validation Scenarios

### VS-1: Registration and login (US1)

1. Open client `/auth`, register as Artist with valid Zambian phone (+260).
2. Sign in and confirm redirect to dashboard; `GET /api/v1/auth/me` returns user and role.
3. **Expected**: 201 on register, 200 on login, JWT stored in client.

### VS-2: Artist publish track (US2)

1. Complete artist profile (name, bio, genre).
2. Upload MP3 and cover; set price 10 ZMW; publish.
3. **Expected**: Track on dashboard; public list returns it when published.

### VS-3: Mobile money purchase (US3)

1. Sign in as Listener; open priced track; start checkout.
2. Use sandbox success number from PROJECT REQUIREMENTS.
3. Poll `GET /api/v1/payments/status/:depositId` or wait for webhook.
4. **Expected**: Payment COMPLETED; download access and earnings created.

### VS-4: Discovery and playback (US4)

1. Open `/discover` without login — see published tracks.
2. Play track — audio starts in player.
3. After purchase, download track.
4. **Expected**: Stream works; download requires access.

### VS-5: Swagger smoke test

1. Open http://localhost:4000/documentation
2. Authorize with Bearer token from login.
3. Call `GET /api/v1/tracks` — 200 paginated list.

## Troubleshooting

| Issue | Check |
|-------|-------|
| CORS errors | Vite proxy in `client/vite.config.ts` → port 4000 |
| Migration fails | Postgres running; `DATABASE_URL` correct |
| Payment stuck PENDING | Webhook URL; API logs for PawaPay events |
| Upload fails | Local `api/uploads/` writable (default storage for MVP) |

## Implementation gaps (2026-07-19)

- **VS-3 sandbox without PawaPay token**: In `NODE_ENV=development` with no `PAWAPAY_API_TOKEN` / `PAWAPAY_SANDBOX_API_TOKEN`, deposits auto-complete for local testing.
- **VS-3 with real token**: Requires valid PawaPay sandbox credentials and phone number; webhook must be reachable for production-like flow.
- **Audio duration**: Not extracted from uploaded MP3 yet (`duration` stays 0).
- **PostgreSQL FTS**: Search uses ILIKE fallback, not full-text search indexes.
- **Admin UI**: Admin API exists (`/api/v1/admin/users`); no client admin page yet.
- **Download auth from browser**: Paid downloads use authenticated `fetch` + blob (not direct link).

## Contract references

- [contracts/auth.md](./contracts/auth.md)
- [contracts/tracks.md](./contracts/tracks.md)
- [contracts/payments.md](./contracts/payments.md)
- [contracts/discovery.md](./contracts/discovery.md)
