import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

// Validated at boot — a missing secret throws here with a named message, not `undefined` mid-request.
// Most of these are read internally by @vercel/postgres and authkit, which never see this module;
// declaring them here is validation-only, so the SDKs fail loudly at start instead of on first use.
export const env = createEnv({
	server: {
		POSTGRES_URL: z.url(),
		WORKOS_CLIENT_ID: z.string().min(1),
		WORKOS_API_KEY: z.string().min(1),
		WORKOS_COOKIE_PASSWORD: z.string().min(32), // authkit throws below 32 chars
		// Parsed here so consumers get string[] instead of re-splitting a comma string per call.
		ADMIN_USER_IDS: z
			.string()
			.default('')
			.transform((ids) =>
				ids
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean),
			),
	},
	client: {
		NEXT_PUBLIC_WORKOS_REDIRECT_URI: z.url(),
	},
	// Only client vars are listed. Next replaces `process.env.NEXT_PUBLIC_*` by literal text match
	// at build time, so those must appear verbatim to reach the browser. Server vars are read from
	// `process.env` at runtime and need no mapping — Next stopped static-analyzing them in 13.4.4.
	experimental__runtimeEnv: {
		NEXT_PUBLIC_WORKOS_REDIRECT_URI: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
	},
	emptyStringAsUndefined: true, // a set-but-blank var reads as missing, not ''
	skipValidation: !!process.env.SKIP_ENV_VALIDATION, // escape hatch for lint/typecheck-only CI
})
