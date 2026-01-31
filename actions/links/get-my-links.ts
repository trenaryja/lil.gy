'use server'

import { db, links } from '@/db'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { desc, eq } from 'drizzle-orm'

export const getMyLinks = async () => {
	const { user } = await withAuth()

	if (!user?.id) return { success: false as const, error: 'Not authenticated' }

	const userLinks = await db.query.links.findMany({
		where: eq(links.userId, user.id),
		orderBy: desc(links.createdAt),
	})

	return { success: true as const, data: userLinks }
}
