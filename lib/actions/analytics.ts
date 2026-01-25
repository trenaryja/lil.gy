'use server'

import { db } from '@/lib/db'
import { links, clickEvents } from '@/lib/db/schema'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { eq, and, desc, gte } from 'drizzle-orm'
import { kv } from '@vercel/kv'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function getLinkWithAnalytics(linkId: string): Promise<
	ActionResult<{
		link: typeof links.$inferSelect
		clicksByDay: { date: string; clicks: number }[]
		topCountries: { country: string; clicks: number }[]
		topReferrers: { referrer: string; clicks: number }[]
	}>
> {
	const { user } = await withAuth()

	if (!user?.id) {
		return { success: false, error: 'Not authenticated' }
	}

	const link = await db.query.links.findFirst({
		where: and(eq(links.id, linkId), eq(links.userId, user.id)),
	})

	if (!link) {
		return { success: false, error: 'Link not found' }
	}

	// Get click count from KV (real-time)
	let kvClicks = 0
	try {
		const count = await kv.get<number>(`count:${linkId}`)
		kvClicks = count || 0
	} catch {
		// KV not configured
	}

	// Get recent clicks from database
	const thirtyDaysAgo = new Date()
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

	const recentClicks = await db.query.clickEvents.findMany({
		where: and(eq(clickEvents.linkId, linkId), gte(clickEvents.timestamp, thirtyDaysAgo)),
		orderBy: desc(clickEvents.timestamp),
		limit: 100,
	})

	// Aggregate clicks by day
	const clicksByDayMap = new Map<string, number>()
	for (let i = 29; i >= 0; i--) {
		const date = new Date()
		date.setDate(date.getDate() - i)
		clicksByDayMap.set(date.toISOString().split('T')[0], 0)
	}

	recentClicks.forEach((click) => {
		const date = click.timestamp.toISOString().split('T')[0]
		clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1)
	})

	const clicksByDay = Array.from(clicksByDayMap.entries()).map(([date, clicks]) => ({
		date,
		clicks,
	}))

	// Aggregate by country
	const countryMap = new Map<string, number>()
	recentClicks.forEach((click) => {
		const country = click.country || 'Unknown'
		countryMap.set(country, (countryMap.get(country) || 0) + 1)
	})

	const topCountries = Array.from(countryMap.entries())
		.map(([country, clicks]) => ({ country, clicks }))
		.sort((a, b) => b.clicks - a.clicks)
		.slice(0, 10)

	// Aggregate by referrer
	const referrerMap = new Map<string, number>()
	recentClicks.forEach((click) => {
		let referrer = click.referrer || 'Direct'
		try {
			if (referrer !== 'Direct') {
				referrer = new URL(referrer).hostname
			}
		} catch {
			referrer = 'Direct'
		}
		referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1)
	})

	const topReferrers = Array.from(referrerMap.entries())
		.map(([referrer, clicks]) => ({ referrer, clicks }))
		.sort((a, b) => b.clicks - a.clicks)
		.slice(0, 10)

	// Update link with combined clicks (database + KV)
	const totalClicks = Math.max(link.clicks, kvClicks)

	return {
		success: true,
		data: {
			link: { ...link, clicks: totalClicks },
			clicksByDay,
			topCountries,
			topReferrers,
		},
	}
}
