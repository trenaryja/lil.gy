import { clickEvents, db, links } from '@/db'
import { eq, sql } from 'drizzle-orm'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export const GET = async (req: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = await params

	const link = await db.query.links.findFirst({
		where: eq(links.slug, slug),
	})

	if (!link || !link.isActive) return new NextResponse('Not Found', { status: 404 })

	// Fire-and-forget click tracking
	Promise.all([
		db.insert(clickEvents).values({
			linkId: link.id,
			referrer: req.headers.get('referer'),
			userAgent: req.headers.get('user-agent'),
			country: req.headers.get('x-vercel-ip-country'),
			city: req.headers.get('x-vercel-ip-city'),
		}),
		db
			.update(links)
			.set({ clicks: sql`${links.clicks} + 1`, updatedAt: new Date() })
			.where(eq(links.id, link.id)),
	]).catch(console.error)

	return NextResponse.redirect(link.url, 308)
}
