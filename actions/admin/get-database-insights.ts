'use server'

import { requireAdmin } from '@/auth'
import { clickEvents, db, links } from '@/db'
import { count, desc } from 'drizzle-orm'

export const getDatabaseInsights = async () => {
	await requireAdmin()

	try {
		// Get table counts
		const [linkCountResult] = await db.select({ count: count() }).from(links)
		const [clickCountResult] = await db.select({ count: count() }).from(clickEvents)

		// Get recent links
		const recentLinks = await db
			.select({
				id: links.id,
				slug: links.slug,
				url: links.url,
				userId: links.userId,
				createdAt: links.createdAt,
			})
			.from(links)
			.orderBy(desc(links.createdAt))
			.limit(10)

		// Get recent clicks
		const recentClicks = await db
			.select({
				id: clickEvents.id,
				linkId: clickEvents.linkId,
				country: clickEvents.country,
				timestamp: clickEvents.timestamp,
			})
			.from(clickEvents)
			.orderBy(desc(clickEvents.timestamp))
			.limit(10)

		return {
			success: true as const,
			data: {
				linkCount: linkCountResult?.count ?? 0,
				clickEventCount: clickCountResult?.count ?? 0,
				recentLinks,
				recentClicks,
			},
		}
	} catch (error) {
		console.error('Database insights error:', error)
		return { success: false as const, error: 'Failed to fetch database insights' }
	}
}
