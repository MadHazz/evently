# Start from Node 20
FROM node:20-alpine AS base

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy api package.json
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies (frozen lockfile for CI/reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api

# Generate Prisma Client
RUN pnpm --filter api exec prisma generate

# Build the NestJS app
RUN pnpm --filter api run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["node", "apps/api/dist/src/main.js"]
