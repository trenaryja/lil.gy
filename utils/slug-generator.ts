import { customAlphabet } from 'nanoid'
import { db, links } from '@/db'
import { inArray } from 'drizzle-orm'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 6)

export const generateSlug = async (length: number = 6): Promise<string> => {
	const id = customAlphabet(alphabet, length)

	// Generate 10 candidate slugs upfront
	const candidates = Array.from({ length: 10 }, () => id())

	// Check all candidates in a single query
	const existing = await db.query.links.findMany({
		where: inArray(links.slug, candidates),
		columns: { slug: true },
	})

	const existingSlugs = new Set(existing.map((l) => l.slug))
	const available = candidates.find((slug) => !existingSlugs.has(slug))

	if (available) return available

	// Fallback: generate a longer slug
	return nanoid() + nanoid().slice(0, 2)
}
