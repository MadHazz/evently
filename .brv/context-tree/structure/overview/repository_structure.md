## Raw Concept
**Task:**
Document repository folder structure and organization

**Files:**
- apps/mobile
- apps/web
- docker-compose.yml

**Flow:**
Monorepo containing mobile (Expo) and web (Next.js) applications

**Timestamp:** 2026-02-16

## Narrative
### Structure
The repository is organized as a monorepo with two main applications in the `apps/` directory:

1. `apps/mobile`: An Expo/React Native mobile application.
   - `app/`: Contains the main application routes using Expo Router (tabs, modal, etc.).
   - `components/`: Reusable UI components including a `ui/` subfolder for base components.
   - `hooks/`: Custom React hooks for theme and color scheme management.
   - `constants/`: Application constants like theme definitions.
   - `assets/`: Images and other static assets.

2. `apps/web`: A Next.js web application.
   - `app/`: Next.js App Router structure with layouts and pages.
   - `public/`: Static assets for the web application.

The root directory contains a `docker-compose.yml` file, suggesting containerized environment support.

### Dependencies
The web application uses `pnpm` for package management (`pnpm-workspace.yaml`, `pnpm-lock.yaml`), while the mobile application appears to use `npm` (`package-lock.json`).

### Features
Support for cross-platform development with shared service potential (though currently separate apps).
