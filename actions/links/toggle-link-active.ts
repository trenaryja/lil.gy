'use server'

import { db, links } from '@/db'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const toggleLinkActive = async (linkId: string) => {
	const { user } = await withAuth()

	if (!user?.id) return { success: false as const, error: 'Not authenticated' }

	const link = await db.query.links.findFirst({
		where: and(eq(links.id, linkId), eq(links.userId, user.id)),
	})

	if (!link) return { success: false as const, error: 'Link not found' }

	const [updated] = await db
		.update(links)
		.set({ isActive: !link.isActive, updatedAt: new Date() })
		.where(eq(links.id, linkId))
		.returning()

	revalidatePath('/dashboard')
	return { success: true as const, data: updated }
}
