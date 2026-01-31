'use server'

import { clickEvents, db, links } from '@/db'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { and, desc, eq, gte } from 'drizzle-orm'
import { aggregateByCountry, aggregateByReferrer, aggregateClicksByDay } from '../shared/analytics-aggregation'

export const getLinkWithAnalytics = async (linkId: string) => {
	const { user } = await withAuth()
	if (!user?.id) return { success: false as const, error: 'Not authenticated' }

	const link = await db.query.links.findFirst({
		where: and(eq(links.id, linkId), eq(links.userId, user.id)),
	})
	if (!link) return { success: false as const, error: 'Link not found' }

	// Get recent clicks from database
	const thirtyDaysAgo = new Date()
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

	const recentClicks = await db.query.clickEvents.findMany({
		where: and(eq(clickEvents.linkId, linkId), gte(clickEvents.timestamp, thirtyDaysAgo)),
		orderBy: desc(clickEvents.timestamp),
		limit: 100,
	})

	// Aggregate clicks by day
	const clicksByDay = aggregateClicksByDay(recentClicks, 30)

	// Aggregate by country
	const topCountries = aggregateByCountry(recentClicks, 10)

	// Aggregate by referrer
	const topReferrers = aggregateByReferrer(recentClicks, 10)

	return {
		success: true as const,
		data: {
			link,
			clicksByDay,
			topCountries,
			topReferrers,
		},
	}
}
