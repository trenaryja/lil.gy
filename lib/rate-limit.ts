import { kv } from '@vercel/kv'

interface RateLimitResult {
	allowed: boolean
	remaining: number
	reset: number
}

export async function checkRateLimit(identifier: string, limit: number, windowMs: number): Promise<RateLimitResult> {
	const key = `ratelimit:${identifier}`
	const now = Date.now()
	const windowStart = now - windowMs

	try {
		await kv.zremrangebyscore(key, 0, windowStart)

		const count = await kv.zcard(key)

		if (count >= limit) {
			const oldest = await kv.zrange<{ score: number }[]>(key, 0, 0, { withScores: true })
			const reset = oldest.length ? Number(oldest[0].score) + windowMs : now + windowMs
			return { allowed: false, remaining: 0, reset }
		}

		await kv.zadd(key, { score: now, member: `${now}:${Math.random()}` })
		await kv.expire(key, Math.ceil(windowMs / 1000))

		return { allowed: true, remaining: limit - count - 1, reset: now + windowMs }
	} catch {
		// If KV is not configured, allow the request (for local development)
		return { allowed: true, remaining: limit, reset: now + windowMs }
	}
}

export const RATE_LIMITS = {
	anonymous: { limit: 5, window: 60 * 60 * 1000 }, // 5/hour
	authenticated: { limit: 50, window: 60 * 60 * 1000 }, // 50/hour
}
