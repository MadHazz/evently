# Phase 2: Testing Implementation

## Goal

Establish a robust testing environment with working Unit and E2E tests.

## Proposed Changes

### Apps/API

#### [VERIFY] [jest-e2e.json](file:///Users/ahmadghazali.hanipah/Documents/Personal/Projects/evently/apps/api/test/jest-e2e.json)

- Ensure configuration is correct for monorepo structure.

#### [MODIFY] [app.e2e-spec.ts](file:///Users/ahmadghazali.hanipah/Documents/Personal/Projects/evently/apps/api/test/app.e2e-spec.ts)

- Update e2e tests to include `/health` and `/db-check`.
- Ensure `PrismaService` is properly mocked or handled in E2E environment.

## Verification Plan

### Automated

- `pnpm --filter api test` -> Unit tests (already passing).
- `pnpm --filter api test:e2e` -> E2E tests.
