# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev           # Start dev server (auto-switches port if 3000 is taken)
bun build         # Production build
bun lint          # Run ESLint
bun format        # Format with Prettier
bun check         # Full check: tsc + lint + format check + build
```

Note: The dev script uses `-H localhost` to bind to localhost specifically. This ensures proper port conflict detection with other local dev servers (e.g., Vite), triggering automatic fallback to the next available port.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 with DaisyUI
- @trenaryja/ui for theme switching
- Bun package manager
- Drizzle ORM with Neon Postgres
- Upstash Redis (via @vercel/kv) for rate limiting and click tracking
- WorkOS AuthKit for authentication (centralized across all apps)

## Code Style

- Tabs for indentation
- No semicolons
- Single quotes (including JSX)
- 120 character line width
- Prefix unused variables with underscore (`_unused`)

## Project Structure

- `proxy.ts` - Next.js 16 proxy (replaces deprecated middleware.ts) for auth
- `app/` - Next.js App Router pages and layouts
- `app/globals.css` - Tailwind + DaisyUI imports
- `app/[slug]/route.ts` - Edge runtime redirect handler with click tracking
- `app/dashboard/` - Protected dashboard with link management and analytics
- `app/api/auth/callback/` - WorkOS AuthKit callback handler
- `app/api/cron/` - Cron jobs for background sync (daily on Hobby plan)
- `lib/db/` - Drizzle schema and database client
- `lib/auth/` - WorkOS AuthKit exports
- `lib/actions/` - Server actions for links and analytics
- `components/` - Shared React components
- Client components use `'use client'` directive

## Database

Neon Postgres (serverless). Run Drizzle commands with:

```bash
bunx drizzle-kit generate   # Generate migrations
bunx drizzle-kit push       # Push schema to database
bunx drizzle-kit studio     # Open Drizzle Studio
```

## Authentication

Uses WorkOS AuthKit for centralized user management across all apps. Key points:

- `proxy.ts` handles auth at the edge (Next.js 16 convention, replaces middleware.ts)
- Use `withAuth()` from `@workos-inc/authkit-nextjs` in server components/actions
- Protected routes redirect to WorkOS hosted auth UI
- Callback handled at `/api/auth/callback`

```typescript
import { withAuth } from '@workos-inc/authkit-nextjs'

const { user } = await withAuth()
```

## Environment Variables

Required in `.env.local` and Vercel:

```bash
# Database (Neon)
POSTGRES_URL="postgresql://..."

# Rate Limiting (Upstash via Vercel KV)
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."

# WorkOS AuthKit
WORKOS_CLIENT_ID="client_..."
WORKOS_API_KEY="sk_test_..."
WORKOS_COOKIE_PASSWORD="<32+ char secret>"  # Generate with: openssl rand -base64 32
NEXT_PUBLIC_WORKOS_REDIRECT_URI="https://www.lil.gy/api/auth/callback"

# Cron
CRON_SECRET="..."
```

Note: `NEXT_PUBLIC_WORKOS_REDIRECT_URI` must match the redirect URI configured in WorkOS dashboard.
