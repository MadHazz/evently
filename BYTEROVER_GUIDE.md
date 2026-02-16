# ByteRover Quick Guide

This guide explains the simplest way to use ByteRover in this repository.

## 1. One-Time Setup

1. Install ByteRover CLI (`brv`) if not already installed.
2. Authenticate:

```bash
brv login -k <YOUR_API_KEY>
```

3. Confirm login and project status:

```bash
brv status --headless --format json
```

## 2. Start ByteRover Session

`query` and `curate` require a running ByteRover instance.

Run this in a terminal:

```bash
brv
```

Keep it running, then use commands below from your project directory.

## 3. Daily Workflow (Recommended)

1. Query first (before coding):

```bash
brv query "How is authentication implemented?"
```

2. Do your code changes.

3. Curate important knowledge after changes:

```bash
brv curate "Auth uses JWT in middleware; refresh token rotation in auth service." \
  --files apps/api/src/middleware/auth.ts \
  --files apps/api/src/services/auth.service.ts
```

4. Push local context tree to ByteRover cloud:

```bash
brv push -y
```

## 4. Useful Commands

- Check status:

```bash
brv status --headless --format json
```

- Pull latest context tree from ByteRover cloud:

```bash
brv pull
```

- Push to a specific ByteRover branch:

```bash
brv push --branch main -y
```

## 5. What Makes Good Curation

Write memory entries that are:

- Specific: exact implementation pattern
- Actionable: what to do next time
- Contextual: where it applies in this repo
- Sourced: include key files with `--files`

Bad example: `"Authentication added"`

Good example: `"Web auth uses HTTP-only cookie sessions in Next.js middleware; RBAC enforced in route guards."`

## 6. Common Issues

- `Not authenticated`:
  Run `brv login -k <YOUR_API_KEY>`.
- `Requires a running brv instance`:
  Start it with `brv`.
- `No changes to push`:
  Nothing new in local `.brv/context-tree` yet; run `brv curate` first if needed.
