import { getKvUsage } from '@/actions'
import { StatCard } from '@/components'

export default async function AdminKvPage() {
	const result = await getKvUsage()

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const { pendingSyncCount, rateLimitKeys, clickCountKeys } = result.data

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-2xl font-bold'>KV Store</h1>
				<p className='opacity-70'>Redis/Upstash key usage and sync status</p>
			</div>

			{/* KV stats */}
			<div>
				<h2 className='text-lg font-semibold mb-4'>Key Statistics</h2>
				<div className='stats stats-vertical md:stats-horizontal shadow w-full bg-base-200'>
					<StatCard
						title='Pending Sync'
						value={pendingSyncCount}
						description={pendingSyncCount > 0 ? 'Items in sync:pending queue' : 'Queue is empty'}
					/>
					<StatCard title='Rate Limit Keys' value={rateLimitKeys} description='rl:* keys' />
					<StatCard title='Click Count Keys' value={clickCountKeys} description='count:* keys' />
				</div>
			</div>

			{/* Info card */}
			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Key Patterns</h2>
					<ul className='space-y-2'>
						<li className='flex gap-4'>
							<code className='font-mono bg-base-300 px-2 py-1 rounded'>sync:pending</code>
							<span className='opacity-70'>List of link IDs awaiting click count sync to database</span>
						</li>
						<li className='flex gap-4'>
							<code className='font-mono bg-base-300 px-2 py-1 rounded'>rl:*</code>
							<span className='opacity-70'>Rate limit tracking for link creation</span>
						</li>
						<li className='flex gap-4'>
							<code className='font-mono bg-base-300 px-2 py-1 rounded'>count:*</code>
							<span className='opacity-70'>Real-time click counts per link (synced by cron)</span>
						</li>
					</ul>
				</div>
			</div>

			{/* Sync info */}
			<div className='card bg-info/10 border border-info'>
				<div className='card-body'>
					<h2 className='card-title text-info'>Sync Information</h2>
					<p>
						Click counts are stored in KV for fast real-time tracking. A daily cron job syncs these counts to the
						PostgreSQL database for durability and analytics.
					</p>
					<p className='text-sm opacity-70'>
						Cron endpoint: <code>/api/cron/sync-clicks</code>
					</p>
				</div>
			</div>
		</div>
	)
}
