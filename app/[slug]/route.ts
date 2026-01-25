import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { links } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { kv } from '@vercel/kv'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params

	const link = await db.query.links.findFirst({
		where: eq(links.slug, slug),
	})

	if (!link || !link.isActive) {
		return new NextResponse('Not Found', { status: 404 })
	}

	// Fire-and-forget click tracking
	const clickData = {
		linkId: link.id,
		timestamp: Date.now(),
		referrer: req.headers.get('referer'),
		userAgent: req.headers.get('user-agent'),
		country: req.headers.get('x-vercel-ip-country'),
		city: req.headers.get('x-vercel-ip-city'),
	}

	// Track clicks in KV (non-blocking)
	Promise.all([
		kv.lpush(`clicks:${link.id}`, JSON.stringify(clickData)).catch(() => {}),
		kv.incr(`count:${link.id}`).catch(() => {}),
	])

	return NextResponse.redirect(link.url, 308)
}
