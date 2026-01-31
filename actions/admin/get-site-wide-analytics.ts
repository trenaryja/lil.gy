'use server'

import { requireAdmin } from '@/auth'
import { clickEvents, db, links } from '@/db'
import { desc, gte } from 'drizzle-orm'
import { aggregateByCountry, aggregateByReferrer, aggregateClicksByDay } from '../shared/analytics-aggregation'

export const getSiteWideAnalytics = async (days: number = 30) => {
	await requireAdmin()

	try {
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - days)

		// Get all recent clicks
		const recentClicks = await db.query.clickEvents.findMany({
			where: gte(clickEvents.timestamp, startDate),
			orderBy: desc(clickEvents.timestamp),
			limit: 10000,
		})

		// Aggregate clicks by day
		const clicksByDay = aggregateClicksByDay(recentClicks, days)

		// Get top links
		const topLinks = await db
			.select({
				slug: links.slug,
				url: links.url,
				clicks: links.clicks,
			})
			.from(links)
			.orderBy(desc(links.clicks))
			.limit(10)

		// Aggregate by country
		const topCountries = aggregateByCountry(recentClicks, 10)

		// Aggregate by referrer
		const topReferrers = aggregateByReferrer(recentClicks, 10)

		return {
			success: true as const,
			data: { clicksByDay, topLinks, topCountries, topReferrers },
		}
	} catch (error) {
		console.error('Site-wide analytics error:', error)
		return { success: false as const, error: 'Failed to fetch analytics' }
	}
}
