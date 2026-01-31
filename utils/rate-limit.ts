import { and, count, eq, gt, lt } from 'drizzle-orm'
import { db, rateLimitEvents } from '@/db'

type RateLimitResult = {
	allowed: boolean
	remaining: number
	reset: number
}

export const checkRateLimit = async (identifier: string, limit: number, windowMs: number): Promise<RateLimitResult> => {
	const now = Date.now()
	const windowStart = new Date(now - windowMs)
	const fallback: RateLimitResult = { allowed: true, remaining: limit, reset: now + windowMs }

	return (async () => {
		// Count events in window for this identifier
		const [result] = await db
			.select({ count: count() })
			.from(rateLimitEvents)
			.where(and(eq(rateLimitEvents.identifier, identifier), gt(rateLimitEvents.timestamp, windowStart)))

		const currentCount = result?.count ?? 0

		if (currentCount >= limit) return { allowed: false, remaining: 0, reset: now + windowMs }

		// Insert new event
		await db.insert(rateLimitEvents).values({ identifier, action: 'create' })

		// Cleanup old events (fire-and-forget)
		db.delete(rateLimitEvents).where(lt(rateLimitEvents.timestamp, windowStart)).catch(console.error)

		return { allowed: true, remaining: limit - currentCount - 1, reset: now + windowMs }
	})().catch(() => fallback)
}

export const RATE_LIMITS = {
	anonymous: { limit: 5, window: 60 * 60 * 1000 }, // 5/hour
	authenticated: { limit: 50, window: 60 * 60 * 1000 }, // 50/hour
}
