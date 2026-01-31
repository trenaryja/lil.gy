# lil.gy

A fast, simple URL shortener with analytics.

## Features

- **Quick link creation** - Create short links instantly, with or without an account
- **Click analytics** - Track clicks with geographic data, referrers, and timestamps
- **Dashboard** - Manage all your links and view detailed analytics
- **Edge runtime** - Redirects run at the edge for minimal latency

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4 + DaisyUI
- Drizzle ORM + Neon Postgres
- WorkOS AuthKit for authentication

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Push database schema
bunx drizzle-kit push

# Start dev server
bun dev
```
