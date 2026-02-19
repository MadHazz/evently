# EVENTLY - Modern Event Ticketing & Check-In Platform

## Technical Plan & Progress Document (v1)

### 1. Project Overview

Evently is a modern, scalable event ticketing and on-site check-in platform built from scratch using a clean, maintainable architecture.
**Core goals:**

- Build a real production system, not a demo
- Learn modern backend + DevOps properly (step-by-step)
- Avoid WordPress / no-code tools
- Use Docker, PostgreSQL, Prisma, NestJS
- Prepare for future scale without over-engineering

### 2. Tech Stack (Locked In)

**Backend**

- **NestJS** – API framework
- **Prisma ORM** – database access & migrations
- **PostgreSQL** – main database
- **Redis** – caching, rate-limiting, queues
- **Node.js 20 LTS**
  **Frontend (planned)**
- **Next.js** – admin dashboard + checkout pages
  **Mobile (planned)**
- **React Native** – staff check-in app (QR scanner)
  **Infrastructure**
- **Docker + Docker Compose** (`pnpm` monorepo)
- **Hostinger VPS** (KVM 2: 2 vCPU, 8 GB RAM, 100 GB SSD)

### 3. Current Folder Structure

evently/ docker-compose.yml package.json # Root pnpm configuration pnpm-workspace.yaml apps/ api/ # NestJS backend (Dockerized) web/ # Next.js (not Dockerized yet) mobile/ # React Native (not Dockerized)

**Architectural Decisions:**

- One [docker-compose.yml](file:///Users/ahmadghazali.hanipah/Documents/Personal/Projects/evently/docker-compose.yml) at root
- Multi-stage Dockerfiles for services using root context
- React Native handled outside Docker
- PostgreSQL (port 5436) + Redis run as containers
- API runs inside Docker (port 3000 mapped to host 3001)

### 4. What Has Been Completed (✅)

**4.1 Docker Infrastructure**

- [x] Root [docker-compose.yml](file:///Users/ahmadghazali.hanipah/Documents/Personal/Projects/evently/docker-compose.yml) with Postgres (5436), Redis, and API
- [x] Docker network and volume persistence
- [x] Monorepo-compatible Docker builds
- [x] Verified connection between services
      **4.2 Prisma Setup**
- [x] Prisma installed & initialized
- [x] Docker-safe `DATABASE_URL` (using env vars)
- [x] Initial schema (`User`, `Org`, `OrgMember`)
- [x] Migrations working inside Docker
      **4.3 API ↔ Database Validation**
- [ ] `/health` endpoint
- [ ] `/db-check` endpoint

### 5. Next Phase Roadmap (What We Will Do Next)

#### PHASE 1 — Code Quality & Safety (CURRENT)

**Goal**: Catch errors before runtime

- [x] ESLint installed (basic)
- [ ] Prettier configuration
- [ ] `npm run typecheck` script (`tsc --noEmit`)
- [ ] Consistent formatting rules

#### PHASE 2 — Testing

**Goal**: Confidence when changing code

- [ ] Jest unit tests set up
- [ ] Jest e2e tests (Supertest)
- [ ] Test database strategy
- [ ] Tests for `/health` and `/db-check`

#### PHASE 3 — Authentication & Organizations

**Goal**: Real users, real permissions

- [ ] User registration & Password hashing
- [ ] JWT auth & AuthGuard
- [ ] Organization creation & Rules

#### PHASE 4 — Event & Ticket Core

**Goal**: Core business logic

- [ ] Events
- [ ] Ticket types
- [ ] Orders & Ticket issuance

#### PHASE 5 — Check-In System

**Goal**: On-site usage

- [ ] Ticket validation endpoint
- [ ] Check-in records
- [ ] React Native simple scanner

#### PHASE 6 — Admin Web

**Goal**: Usable product

- [ ] Admin dashboard UI
- [ ] Event management
- [ ] Live stats

#### PHASE 7 — Production Hardening

**Goal**: Public-ready system

- [ ] Nginx reverse proxy / HTTPS
- [ ] Log rotation & Rate limiting
