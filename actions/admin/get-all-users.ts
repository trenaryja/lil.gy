'use server'

import { requireAdmin } from '@/auth'
import { db, links } from '@/db'
import { count, desc, sql, sum } from 'drizzle-orm'

export const getAllUsers = async () => {
	await requireAdmin()

	try {
		const users = await db
			.select({
				userId: links.userId,
				linkCount: count(),
				totalClicks: sum(links.clicks),
			})
			.from(links)
			.where(sql`${links.userId} IS NOT NULL`)
			.groupBy(links.userId)
			.orderBy(desc(sum(links.clicks)))

		return {
			success: true as const,
			data: users.map((u) => ({
				userId: u.userId!,
				linkCount: u.linkCount,
				totalClicks: Number(u.totalClicks) || 0,
			})),
		}
	} catch (error) {
		console.error('Get all users error:', error)
		return { success: false as const, error: 'Failed to fetch users' }
	}
}
