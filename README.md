# Evently

Evently is a monorepo containing:

- `apps/web`: Next.js web application
- `apps/mobile`: Expo React Native application
- `apps/api`: NestJS backend application

## Prerequisites

- Node.js `20+`
- `pnpm` (required for workspace management)
- Docker (optional, for local infrastructure)

## Setup

### 1. Install Dependencies

From the root directory:

```bash
pnpm install
```

### 2. Run Applications

You can run applications individually using the root scripts:

#### Web App (`http://localhost:3000`)

```bash
pnpm dev:web
```

#### API (`http://localhost:3000` / `3001` depending on config)

```bash
pnpm dev:api
```

#### Mobile App

```bash
pnpm dev:mobile
```

Then press `i` for iOS, `a` for Android, or `w` for Web.

### 3. Local Infrastructure

Start the database and redis:

```bash
docker compose up -d
```

> **Note**: Postgres runs on port `5436` to avoid conflicts with default port `5432`.

### 4. Running Tests

Tests are managed at the root level via pnpm recursive execution.

Run unit tests for all apps:

```bash
pnpm test
```

Run end-to-end (E2E) tests for all apps:

```bash
pnpm test:e2e
```

## Project Status

We have completed the following core backend phases:

- **Phase 1**: Code Quality (ESLint, Prettier, Typescript)
- **Phase 2**: Testing setup (Jest unit + E2E with Postgres test DB)
- **Phase 3**: Authentication & Organizations (JWT, org scoping)
- **Phase 4**: Event & Ticket Core (Inventory, checkout transaction)

We are currently working on **Phase 5**: Mobile Check-In System capabilities.

## Project Structure

### Apps

- `apps/web`: Frontend web application (Next.js)
- `apps/mobile`: Mobile application (Expo)
- `apps/api`: Backend API (NestJS)

### Infrastructure

- `docker-compose.yml`: Defines `postgres`, `redis`, and `api` services.

## Dependency Management

This project uses `pnpm` workspaces.

- To add a dependency to a specific app: `pnpm add <package> --filter <app-name>`
- To add a dev dependency to the root: `pnpm add -D <package> -w`
