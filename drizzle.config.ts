import { defineConfig } from 'drizzle-kit'
import { env } from './env' // relative, not `@/env`: drizzle-kit runs outside Next's path-alias resolver

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.POSTGRES_URL,
	},
})
