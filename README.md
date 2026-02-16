# Evently

Evently is a monorepo with two client apps:

- `apps/web`: Next.js web app
- `apps/mobile`: Expo React Native app

## Prerequisites

- Node.js `20+`
- `pnpm` (used by `apps/web`)
- `npm` (used by `apps/mobile`)
- Docker (optional, for local infra in `docker-compose.yml`)

## Setup

### 1. Web App

```bash
cd apps/web
pnpm install
pnpm dev
```

Web runs at `http://localhost:3000`.

### 2. Mobile App

```bash
cd apps/mobile
npm install
npm start
```

Useful alternatives:

```bash
npm run ios
npm run android
npm run web
```

### 3. Optional Local Infrastructure

```bash
docker compose up -d postgres redis
```

`docker-compose.yml` also defines an `api` service that expects `apps/api` to exist. That folder is not present yet in the current repository snapshot.

## Required Files (Current)

### Root

- `docker-compose.yml`
- `AGENTS.md`

### Web (`apps/web`)

- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `next.config.ts`
- `tsconfig.json`
- `app/layout.tsx`
- `app/page.tsx`

### Mobile (`apps/mobile`)

- `package.json`
- `package-lock.json`
- `app.json`
- `tsconfig.json`
- `app/_layout.tsx`

## Dependency Baseline

### Web Runtime

- `next@16.1.6`
- `react@19.2.3`
- `react-dom@19.2.3`

### Mobile Runtime

- `expo@~54.0.33`
- `expo-router@~6.0.23`
- `react@19.1.0`
- `react-native@0.81.5`

### Infra Images

- `postgres:15`
- `redis:7-alpine`
