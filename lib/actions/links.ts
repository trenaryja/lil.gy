'use server'

import { db } from '@/lib/db'
import { links } from '@/lib/db/schema'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { headers } from 'next/headers'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { generateSlug } from '@/lib/slug-generator'
import { createLinkSchema } from '@/lib/validators'
import { eq, desc, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

export async function createLink(formData: FormData): Promise<ActionResult<typeof links.$inferSelect>> {
	const url = formData.get('url') as string
	const customSlug = (formData.get('customSlug') as string) || undefined

	const parsed = createLinkSchema.safeParse({ url, customSlug })
	if (!parsed.success) {
		return { success: false, error: parsed.error.issues[0].message }
	}

	const { user } = await withAuth()
	const headersList = await headers()
	const identifier = user?.id || headersList.get('x-forwarded-for') || 'unknown'
	const limits = user ? RATE_LIMITS.authenticated : RATE_LIMITS.anonymous

	const rateCheck = await checkRateLimit(`create:${identifier}`, limits.limit, limits.window)
	if (!rateCheck.allowed) {
		const minutes = Math.ceil((rateCheck.reset - Date.now()) / 60000)
		return { success: false, error: `Rate limit exceeded. Try again in ${minutes} minutes.` }
	}

	const slug = customSlug || (await generateSlug())

	const existing = await db.query.links.findFirst({ where: eq(links.slug, slug) })
	if (existing) {
		return { success: false, error: 'Slug already taken' }
	}

	const [link] = await db
		.insert(links)
		.values({
			slug,
			url: parsed.data.url,
			userId: user?.id,
		})
		.returning()

	revalidatePath('/dashboard')
	return { success: true, data: link }
}

export async function getMyLinks(): Promise<ActionResult<(typeof links.$inferSelect)[]>> {
	const { user } = await withAuth()

	if (!user?.id) {
		return { success: false, error: 'Not authenticated' }
	}

	const userLinks = await db.query.links.findMany({
		where: eq(links.userId, user.id),
		orderBy: desc(links.createdAt),
	})

	return { success: true, data: userLinks }
}

export async function deleteLink(linkId: string): Promise<ActionResult<null>> {
	const { user } = await withAuth()

	if (!user?.id) {
		return { success: false, error: 'Not authenticated' }
	}

	const link = await db.query.links.findFirst({
		where: and(eq(links.id, linkId), eq(links.userId, user.id)),
	})

	if (!link) {
		return { success: false, error: 'Link not found or you do not have permission to delete it' }
	}

	await db.delete(links).where(eq(links.id, linkId))

	revalidatePath('/dashboard')
	return { success: true, data: null }
}

export async function toggleLinkActive(linkId: string): Promise<ActionResult<typeof links.$inferSelect>> {
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

	const [updated] = await db
		.update(links)
		.set({ isActive: !link.isActive, updatedAt: new Date() })
		.where(eq(links.id, linkId))
		.returning()

	revalidatePath('/dashboard')
	return { success: true, data: updated }
}
