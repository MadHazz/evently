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
