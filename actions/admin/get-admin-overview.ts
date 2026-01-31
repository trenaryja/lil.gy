'use server'

import { requireAdmin } from '@/auth'
import { clickEvents, db, links } from '@/db'
import { getToday } from '@/utils'
import { kv } from '@vercel/kv'
import { count, gte, sql, sum } from 'drizzle-orm'

const fetchLinkStats = async () => {
	const [result] = await db
		.select({
			total: count(),
			totalClicks: sum(links.clicks),
			active: count(sql`CASE WHEN ${links.isActive} = true THEN 1 END`),
			inactive: count(sql`CASE WHEN ${links.isActive} = false THEN 1 END`),
		})
		.from(links)
	return result
}

const fetchUserStats = async () => {
	const [result] = await db
		.select({ uniqueUsers: count(sql`DISTINCT ${links.userId}`) })
		.from(links)
		.where(sql`${links.userId} IS NOT NULL`)
	return result
}

const fetchTodayStats = async (today: Date) => {
	const [[todayLinks], [todayClicks]] = await Promise.all([
		db.select({ count: count() }).from(links).where(gte(links.createdAt, today)),
		db.select({ count: count() }).from(clickEvents).where(gte(clickEvents.timestamp, today)),
	])
	return { todayLinks: todayLinks?.count ?? 0, todayClicks: todayClicks?.count ?? 0 }
}

const fetchOverviewData = async () => {
	const today = getToday()

	const [linkStats, userStats, todayStats, pendingSync] = await Promise.all([
		fetchLinkStats(),
		fetchUserStats(),
		fetchTodayStats(today),
		kv.llen('sync:pending').catch(() => 0),
	])

	return {
		totalLinks: linkStats?.total ?? 0,
		totalClicks: Number(linkStats?.totalClicks) || 0,
		activeLinks: linkStats?.active ?? 0,
		inactiveLinks: linkStats?.inactive ?? 0,
		totalUsers: userStats?.uniqueUsers ?? 0,
		todayNewLinks: todayStats.todayLinks,
		todayClicks: todayStats.todayClicks,
		pendingSync,
	}
}

export const getAdminOverview = async () => {
	await requireAdmin()

	try {
		const data = await fetchOverviewData()
		return { success: true as const, data }
	} catch (error) {
		console.error('Admin overview error:', error)
		return { success: false as const, error: 'Failed to fetch admin overview' }
	}
}
