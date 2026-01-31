'use server'

import { db, links } from '@/db'
import { checkRateLimit, createLinkSchema, generateSlug, RATE_LIMITS } from '@/utils'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export const createLink = async (formData: FormData) => {
	const url = formData.get('url') as string
	const customSlug = (formData.get('customSlug') as string) || undefined

	const parsed = createLinkSchema.safeParse({ url, customSlug })

	if (!parsed.success) return { success: false as const, error: parsed.error.issues[0].message }

	const { user } = await withAuth()
	const headersList = await headers()
	const identifier = user?.id || headersList.get('x-forwarded-for') || 'unknown'
	const limits = user ? RATE_LIMITS.authenticated : RATE_LIMITS.anonymous

	const rateCheck = await checkRateLimit(`create:${identifier}`, limits.limit, limits.window)

	if (!rateCheck.allowed) {
		const minutes = Math.ceil((rateCheck.reset - Date.now()) / 60000)
		return { success: false as const, error: `Rate limit exceeded. Try again in ${minutes} minutes.` }
	}

	const slug = customSlug || (await generateSlug())

	const existing = await db.query.links.findFirst({ where: eq(links.slug, slug) })

	if (existing) return { success: false as const, error: 'Slug already taken' }

	const [link] = await db
		.insert(links)
		.values({
			slug,
			url: parsed.data.url,
			userId: user?.id,
		})
		.returning()

	revalidatePath('/dashboard')
	return { success: true as const, data: link }
}
