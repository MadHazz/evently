# Phase 3: Authentication & Organizations

This phase implements user authentication using JWTs and bcrypt for password hashing. It also covers the fundamentals of Organization management, ensuring users can create and retrieve organizations they belong to.

## Proposed Changes

### 1. Dependencies Setup

- Install necessary packages in `apps/api`:
  - `bcrypt`, `@types/bcrypt`
  - `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`
  - `class-validator`, `class-transformer`

---

### 2. Authentication Module (`AuthModule`)

Implement user registration, login, and JWT token issuing.

#### [NEW] `apps/api/src/auth/auth.module.ts`

- Configures `JwtModule` securely using `ConfigModule` and environment variables (`JWT_SECRET`, `JWT_EXPIRES_IN`).
- Registers `AuthService` and `JwtStrategy`.

#### [NEW] `apps/api/src/auth/auth.controller.ts`

- `POST /auth/register`: Accepts email/password, hashes password, creates `User`.
- `POST /auth/login`: Verifies credentials, issues JWT token access.
- `GET /auth/me`: Protected route to get the current authenticated user's profile.

#### [NEW] `apps/api/src/auth/auth.service.ts`

- `register()`: Handles `bcrypt.hash()` and Prisma user creation. Includes conflict checking for existing emails.
- `login()`: Fetches user, compares `bcrypt.compare()`, generates payload, signs token.

#### [NEW] `apps/api/src/auth/jwt.strategy.ts`

- Implements `PassportStrategy(Strategy)`.
- Validates token payload and fetches user from `PrismaService`.

#### [NEW] `apps/api/src/auth/guards/jwt-auth.guard.ts`

- Implements `AuthGuard('jwt')`. Can be applied globally or per-route/controller.

#### [NEW] `apps/api/src/auth/decorators/current-user.decorator.ts`

- Custom decorator `@CurrentUser()` to easily extract the user object from the `req.user` inside controllers.

#### [NEW] `apps/api/src/auth/dto/auth.dto.ts`

- `RegisterDto` and `LoginDto` with `class-validator` rules (`@IsEmail`, `@IsString`, `@MinLength`).

---

### 3. Organizations Module (`OrgModule`)

Implement organization creation and membership tracking.

#### [NEW] `apps/api/src/org/org.module.ts`

- Registers `OrgController` and `OrgService`.

#### [NEW] `apps/api/src/org/org.controller.ts`

- `POST /org`: Create a new organization (requires authentication).
- `GET /org`: List organizations the current user belongs to.

#### [NEW] `apps/api/src/org/org.service.ts`

- `createOrg()`: Uses Prisma transaction.
  1. Creates the `Org` record.
  2. Creates the `OrgMember` record linking the `Org` to the `User` with role `OWNER`.
- `getUserOrgs()`: Queries `Org` records through the current user's memberships.

#### [NEW] `apps/api/src/org/dto/org.dto.ts`

- `CreateOrgDto` with rules (`@IsString`, `@IsNotEmpty`).

---

### 4. Application Plumbing

Global configurations to enable the new features.

#### [MODIFY] `apps/api/src/main.ts`

- Enable global validation pipe (`app.useGlobalPipes(new ValidationPipe({ whitelist: true }))`).

#### [MODIFY] `apps/api/src/app.module.ts`

- Import `AuthModule` and `OrgModule`.

## Verification Plan

### Automated Tests

- Unit tests for `AuthService` and `OrgService`.
- E2E tests for registration and login flows (`/auth/register`, `/auth/login`).
- E2E tests for protected routes to ensure 401 Unauthorized without a valid token.
- E2E tests simulating organization creation to verify `OrgMember` relationship is properly established.

### Manual Verification

- Provide curl/HTTP commands for the User to manually create an account, log in, get a token, and create an organization.
