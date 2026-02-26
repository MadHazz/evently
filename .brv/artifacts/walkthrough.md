# Monorepo Migration Walkthrough

The project has been successfully converted to a pnpm monorepo.

## Changes Made

- Created root `package.json`, `pnpm-workspace.yaml`, and `.npmrc`.
- Removed individual lockfiles and `node_modules`.
- Unified dependencies under pnpm control.
- Updated `README.md` with new instructions.

## Verification Results

### Installation

`pnpm install` completed successfully.

### Applications

- **Web**: Run `pnpm dev:web` to start.
- **API**: Run `pnpm dev:api` to start (Running on port 3001 to avoid conflict).
- **Mobile**: Run `pnpm dev:mobile` to start.

> [!NOTE]
> Peer dependency warnings for `react@19` vs `react@18` (used by Expo) are expected and handled by `public-hoist-pattern` in `.npmrc`.

> [!TIP]
> Fixed a missing `url` in `apps/api/prisma/schema.prisma` by referencing `DATABASE_URL` from the environment. `prisma generate` now runs successfully.

### Docker Configuration

- **Postgres Port**: Changed to `5436` to avoid conflicts with local services (VS Code / other DBs).
- **API Build**: Updated `Dockerfile` to use `pnpm` and build from root context to access workspace dependencies.
- **Local Dev**: `apps/api/.env` updated to connect to `localhost:5436`.

### Common Commands

- **Migration**: `docker compose exec api pnpm --filter api exec prisma migrate dev --name <name>`
- **Generate Client**: `docker compose exec api pnpm --filter api exec prisma generate` (automatically runs after migration)
- **Studio**: `docker compose exec api pnpm --filter api exec prisma studio` (runs on port 5555, map it in docker-compose if needed)

## What We Built So Far

### Core Infrastructure & Architecture (Phases 1-3)

- **Dockerized Services**: PostgreSQL running on port `5436` and Redis inside Docker.
- **Monorepo Ready**: API, Web, and Mobile apps configured in the `evently` monorepo using `pnpm`.
- **Database ORM**: Prisma generating native client.
- **Code Quality**: Prettier, ESLint, and TypeScript configured for `api`.
- **Testing Confidence**: Jest unit & E2E configuring. Isolated test databases leveraging `.env.test`.
- **Authentication**: JWT authentication with `bcrypt` password hashing. Registration and Login flow tested.
- **Organizations**: Simple multi-tenant logic. Users can create organizations and are automatically assigned as `OWNER`.

### Testing

- **Unit Tests**: `pnpm -r run test` or `pnpm --filter api test`
- **E2E Tests**: `pnpm --filter api test:e2e`
  - Requires `postgres` and `redis` containers running (`docker compose up -d postgres redis`).
  - Requires `dotnet` migration (`pnpm --filter api exec prisma migrate deploy`).
  - Note: Used `apps/api/src/generated/client` for Prisma to support pnpm aliases and correct type checking.
