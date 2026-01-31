import { attempt } from '@trenaryja/ui/utils'
import { z } from 'zod'

const urlSchema = z
	.string()
	.min(1, 'URL is required')
	.refine((url) => !!attempt(() => new URL(url.startsWith('http') ? url : `https://${url}`)), {
		message: 'Please enter a valid URL',
	})
	.transform((url) => (url.startsWith('http') ? url : `https://${url}`))

const slugSchema = z
	.string()
	.min(3, 'Slug must be at least 3 characters')
	.max(50, 'Slug must be at most 50 characters')
	.regex(/^[\w-]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores')
	.optional()

export const createLinkSchema = z.object({
	url: urlSchema,
	customSlug: slugSchema,
})
