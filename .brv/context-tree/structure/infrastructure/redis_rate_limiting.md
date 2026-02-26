## Raw Concept
**Task:**
Implement Redis-backed rate limiting for production deployments

**Changes:**
- Configured ThrottlerModule with ThrottlerStorageRedisService
- Integrated ConfigService for dynamic REDIS_URL resolution
- Applied global ThrottlerGuard using APP_GUARD provider

**Files:**
- apps/api/src/app.module.ts

**Flow:**
Request -> ThrottlerGuard -> Redis Storage Check -> Controller/Handler

**Timestamp:** 2026-02-24

## Narrative
### Structure
The rate limiting is globally applied in `AppModule` using NestJS Throttler module. It uses `nestjs-throttler-storage-redis` to persist request counts across multiple API instances.

### Dependencies
Requires `ThrottlerModule`, `ThrottlerGuard`, `ThrottlerStorageRedisService`, and a valid `REDIS_URL` in environment variables.

### Features
Default limit: 100 requests per 60 seconds (1 minute). Uses Redis for distributed state, making it suitable for production horizontal scaling.

### Rules
Rule 1: All endpoints are rate-limited by default unless explicitly skipped.
Rule 2: REDIS_URL must be provided for the storage service to initialize.
