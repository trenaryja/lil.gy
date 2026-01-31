import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { clickEvents, db, links } from '@/db'
import { attempt } from '@trenaryja/ui/utils'
import { eq } from 'drizzle-orm'
import { kv } from '@vercel/kv'

type ClickEvent = {
	linkId: string
	timestamp: Date
	referrer: string | null
	userAgent: string | null
	country: string | null
	city: string | null
}

const syncLinkClicks = async (link: typeof links.$inferSelect): Promise<number> => {
	// Get click count from KV
	const kvCount = await kv.get<number>(`count:${link.id}`)

	if (kvCount && kvCount > link.clicks) {
		// Update link click count
		await db.update(links).set({ clicks: kvCount, updatedAt: new Date() }).where(eq(links.id, link.id))
	}

	// Process click events from KV
	const clicksKey = `clicks:${link.id}`
	const clickDataList = await kv.lrange<string>(clicksKey, 0, 99)

	if (!clickDataList || clickDataList.length === 0) return 0

	const events = clickDataList
		.map((data) =>
			attempt(
				() => {
					const parsed = JSON.parse(data)
					return {
						linkId: link.id,
						timestamp: new Date(parsed.timestamp),
						referrer: parsed.referrer,
						userAgent: parsed.userAgent,
						country: parsed.country,
						city: parsed.city,
					}
				},
				{ fallback: null },
			),
		)
		.filter(Boolean) as ClickEvent[]

	if (events.length === 0) return 0

	await db.insert(clickEvents).values(events)
	await kv.ltrim(clicksKey, events.length, -1)

	return events.length
}

export const GET = async (req: NextRequest) => {
	// Verify cron secret
	const authHeader = req.headers.get('authorization')
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) return new NextResponse('Unauthorized', { status: 401 })

	try {
		// Get all links
		const allLinks = await db.query.links.findMany()

		// Process all links in parallel
		const results = await Promise.all(allLinks.map(syncLinkClicks))
		const totalSynced = results.reduce((sum, count) => sum + count, 0)

		return NextResponse.json({ success: true, synced: totalSynced })
	} catch (error) {
		console.error('Sync failed:', error)
		return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 })
	}
}
