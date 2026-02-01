'use server'

import { requireAdmin } from '@/auth'
import { db, links } from '@/db'
import type { LinkBreakdownItem } from '@/types'
import { sql } from 'drizzle-orm'

export const getLinkBreakdown = async (): Promise<LinkBreakdownItem[]> => {
	await requireAdmin()

	const result = await db
		.select({
			isAnonymous: sql<boolean>`${links.userId} IS NULL`.as('is_anonymous'),
			isCustomSlug: links.isCustomSlug,
			isActive: links.isActive,
			linkCount: sql<number>`count(*)::int`.as('link_count'),
			clickCount: sql<number>`coalesce(sum(${links.clicks}), 0)::int`.as('click_count'),
		})
		.from(links)
		.groupBy(sql`${links.userId} IS NULL`, links.isCustomSlug, links.isActive)

	return result.map((row) => ({
		authStatus: row.isAnonymous ? 'anonymous' : 'owned',
		slugType: row.isCustomSlug ? 'custom' : 'generated',
		activityStatus: row.isActive ? 'active' : 'inactive',
		linkCount: row.linkCount,
		clickCount: row.clickCount,
	}))
}
