import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { links, clickEvents } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { kv } from '@vercel/kv'

export async function GET(req: NextRequest) {
	// Verify cron secret
	const authHeader = req.headers.get('authorization')
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	try {
		// Get all links
		const allLinks = await db.query.links.findMany()

		let totalSynced = 0

		for (const link of allLinks) {
			// Get click count from KV
			const kvCount = await kv.get<number>(`count:${link.id}`)

			if (kvCount && kvCount > link.clicks) {
				// Update link click count
				await db.update(links).set({ clicks: kvCount, updatedAt: new Date() }).where(eq(links.id, link.id))
			}

			// Process click events from KV
			const clicksKey = `clicks:${link.id}`
			const clickDataList = await kv.lrange<string>(clicksKey, 0, 99)

			if (clickDataList && clickDataList.length > 0) {
				const events = clickDataList
					.map((data) => {
						try {
							const parsed = JSON.parse(data)
							return {
								linkId: link.id,
								timestamp: new Date(parsed.timestamp),
								referrer: parsed.referrer,
								userAgent: parsed.userAgent,
								country: parsed.country,
								city: parsed.city,
							}
						} catch {
							return null
						}
					})
					.filter(Boolean) as {
					linkId: string
					timestamp: Date
					referrer: string | null
					userAgent: string | null
					country: string | null
					city: string | null
				}[]

				if (events.length > 0) {
					await db.insert(clickEvents).values(events)
					totalSynced += events.length

					// Remove processed clicks from KV
					await kv.ltrim(clicksKey, events.length, -1)
				}
			}
		}

		return NextResponse.json({ success: true, synced: totalSynced })
	} catch (error) {
		console.error('Sync failed:', error)
		return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 })
	}
}
