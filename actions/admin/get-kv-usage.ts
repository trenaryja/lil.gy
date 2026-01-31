'use server'

import { requireAdmin } from '@/auth'
import { kv } from '@vercel/kv'

export const getKvUsage = async () => {
	await requireAdmin()

	try {
		const pendingSyncCount = await kv.llen('sync:pending').catch(() => 0)
		const rateLimitKeys = await kv
			.keys('rl:*')
			.then((k) => k.length)
			.catch(() => 0)
		const clickCountKeys = await kv
			.keys('count:*')
			.then((k) => k.length)
			.catch(() => 0)

		return {
			success: true as const,
			data: { pendingSyncCount, rateLimitKeys, clickCountKeys },
		}
	} catch (error) {
		console.error('KV usage error:', error)
		return { success: false as const, error: 'Failed to fetch KV usage' }
	}
}
