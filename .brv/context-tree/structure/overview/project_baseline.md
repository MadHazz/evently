## Raw Concept
**Task:**
Document initial project setup and dependency baseline

**Changes:**
- Created root README with setup instructions
- Defined infrastructure in docker-compose.yml
- Established dependency versions for web and mobile apps

**Files:**
- README.md
- docker-compose.yml
- apps/web/package.json
- apps/mobile/package.json

**Flow:**
developer setup -> install dependencies (pnpm/npm) -> start dev servers -> optional docker infra

**Timestamp:** 2026-02-16

## Narrative
### Structure
Monorepo with Next.js web app (apps/web) and Expo mobile app (apps/mobile). Infrastructure services managed via Docker.

### Dependencies
Web: Next.js 16.1.6, React 19.2.3. Mobile: Expo 54.0.33, React Native 0.81.5. Infra: Postgres 15, Redis 7-alpine.

### Features
Support for web and mobile development, local postgres and redis instances, placeholder for future API service.

### Rules
1. Node.js 20+ required
2. Use pnpm for apps/web
3. Use npm for apps/mobile
4. docker-compose api service expects apps/api which is currently missing

### Examples
Web setup: cd apps/web && pnpm install && pnpm dev
Mobile setup: cd apps/mobile && npm install && npm start
