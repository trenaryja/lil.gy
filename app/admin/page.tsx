import Link from 'next/link'
import { getAdminOverview } from '@/actions'
import { StatCard } from './components/stat-card'

const AdminOverviewPage = async () => {
	const result = await getAdminOverview()

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const { data } = result

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-2xl font-bold'>Admin Dashboard</h1>
				<p className='opacity-70'>Site-wide overview and statistics</p>
			</div>

			{/* Main stats */}
			<div>
				<h2 className='text-lg font-semibold mb-4'>All Time</h2>
				<div className='stats stats-vertical md:stats-horizontal shadow w-full bg-base-200'>
					<StatCard title='Total Links' value={data.totalLinks} />
					<StatCard title='Total Clicks' value={data.totalClicks} />
					<StatCard title='Active Links' value={data.activeLinks} />
					<StatCard title='Users' value={data.totalUsers} />
				</div>
			</div>

			{/* Today's stats */}
			<div>
				<h2 className='text-lg font-semibold mb-4'>Today</h2>
				<div className='stats stats-vertical md:stats-horizontal shadow w-full bg-base-200'>
					<StatCard title='New Links' value={data.todayNewLinks} />
					<StatCard title='Clicks' value={data.todayClicks} />
					<StatCard
						title='Pending KV Sync'
						value={data.pendingSync}
						description={data.pendingSync > 0 ? 'Awaiting cron job' : 'All synced'}
					/>
				</div>
			</div>

			{/* Quick links */}
			<div>
				<h2 className='text-lg font-semibold mb-4'>Quick Links</h2>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<Link href='/admin/analytics' className='btn btn-outline'>
						View Analytics
					</Link>
					<Link href='/admin/database' className='btn btn-outline'>
						Database Insights
					</Link>
					<Link href='/admin/kv' className='btn btn-outline'>
						KV Store
					</Link>
					<Link href='/admin/users' className='btn btn-outline'>
						All Users
					</Link>
				</div>
			</div>
		</div>
	)
}

export default AdminOverviewPage
