'use server'

import { db, links } from '@/db'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const deleteLink = async (linkId: string) => {
	const { user } = await withAuth()

	if (!user?.id) return { success: false as const, error: 'Not authenticated' }

	const link = await db.query.links.findFirst({
		where: and(eq(links.id, linkId), eq(links.userId, user.id)),
	})

	if (!link) return { success: false as const, error: 'Link not found or you do not have permission to delete it' }

	await db.delete(links).where(eq(links.id, linkId))

	revalidatePath('/dashboard')
	return { success: true as const, data: null }
}
