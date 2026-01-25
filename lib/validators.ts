import { z } from 'zod'

export const urlSchema = z
	.string()
	.min(1, 'URL is required')
	.refine(
		(url) => {
			try {
				new URL(url.startsWith('http') ? url : `https://${url}`)
				return true
			} catch {
				return false
			}
		},
		{ message: 'Please enter a valid URL' },
	)
	.transform((url) => (url.startsWith('http') ? url : `https://${url}`))

export const slugSchema = z
	.string()
	.min(3, 'Slug must be at least 3 characters')
	.max(50, 'Slug must be at most 50 characters')
	.regex(/^[a-zA-Z0-9_-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores')
	.optional()

export const createLinkSchema = z.object({
	url: urlSchema,
	customSlug: slugSchema,
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>
