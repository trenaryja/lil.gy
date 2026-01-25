import { customAlphabet } from 'nanoid'
import { db } from '@/lib/db'
import { links } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 6)

export async function generateSlug(length: number = 6): Promise<string> {
	const id = customAlphabet(alphabet, length)

	for (let i = 0; i < 10; i++) {
		const slug = id()
		const existing = await db.query.links.findFirst({
			where: eq(links.slug, slug),
		})

		if (!existing) {
			return slug
		}
	}

	return nanoid() + nanoid().slice(0, 2)
}
