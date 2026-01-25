# Getting Started

## Prerequisites

- [Bun](https://bun.sh/)
- [Vercel](https://vercel.com/) account
- [WorkOS](https://workos.com/) account

## 1. Deploy to Vercel

Fork or clone the repo, then import it into Vercel.

### Add Storage Integrations

From your Vercel project dashboard:

1. Go to **Storage** tab
2. Add **Neon Postgres**
   - Creates database and sets `POSTGRES_URL` automatically
3. Add **Upstash KV**
   - Creates Redis instance and sets `KV_*` env vars automatically

### Push Database Schema

```bash
bunx drizzle-kit push
```

## 2. Configure WorkOS

### Get Credentials

1. Sign up at [workos.com](https://workos.com/)
2. Copy your **Client ID** and **API Key** from the dashboard

### Set Redirect URIs

In WorkOS dashboard → **Redirects**:

- Add `https://your-app.vercel.app/api/auth/callback`
- For local dev, also add `http://localhost:3000/api/auth/callback`

### Enable Auth Methods

In WorkOS dashboard → **Authentication**, enable what you need:

- Email + Password
- Magic Auth (passwordless)
- Social providers (Google, GitHub, etc.)

## 3. Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

| Variable                          | Value                                           |
| --------------------------------- | ----------------------------------------------- |
| `WORKOS_CLIENT_ID`                | From WorkOS dashboard                           |
| `WORKOS_API_KEY`                  | From WorkOS dashboard                           |
| `WORKOS_COOKIE_PASSWORD`          | Run `openssl rand -base64 32`                   |
| `NEXT_PUBLIC_WORKOS_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/callback` |

## 4. Local Development

```bash
cp .env.example .env.local
vercel env pull        # Pull env vars from Vercel
bun dev
```
