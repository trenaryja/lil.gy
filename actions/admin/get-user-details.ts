'use server'

import { requireAdmin } from '@/auth'
import { db, links } from '@/db'
import { desc, eq } from 'drizzle-orm'

export const getUserDetails = async (userId: string) => {
	await requireAdmin()

	try {
		const userLinks = await db
			.select({
				id: links.id,
				slug: links.slug,
				url: links.url,
				clicks: links.clicks,
				isActive: links.isActive,
				createdAt: links.createdAt,
			})
			.from(links)
			.where(eq(links.userId, userId))
			.orderBy(desc(links.createdAt))

		return { success: true as const, data: { userId, links: userLinks } }
	} catch (error) {
		console.error('Get user details error:', error)
		return { success: false as const, error: 'Failed to fetch user details' }
	}
}
