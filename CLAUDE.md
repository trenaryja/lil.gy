# CLAUDE.md

## Commands

Run `bun check` before committing (runs tsc, lint, format check, and build).

## Code Style

Beyond what prettier enforces (see `package.json`):

- Prefix unused variables with underscore (`_unused`)
- No braces for single-statement if/else blocks (e.g., `if (x) return` not `if (x) { return }`)
- Implicit return for single-expression arrow functions
- Early returns/guards on same line (e.g., `if (!user) return null`)
- Use `??` vs `||` appropriately (nullish vs falsy)

## Architecture Notes

- Next.js 16 App Router with `proxy.ts` (replaces deprecated middleware.ts)
- WorkOS AuthKit for auth - use `withAuth()` from `@workos-inc/authkit-nextjs`
- Drizzle ORM with Neon Postgres - run `bunx drizzle-kit push` to sync schema

## Environment Variables

See `.env.example` for required variables. Copy to `.env.local` for local development.
