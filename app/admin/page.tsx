import { getAdminOverview } from '@/actions'
import { StatCard } from '@/components'

const AdminOverviewPage = async () => {
	const result = await getAdminOverview()

	if (!result.success)
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)

	const { data } = result

	return (
		<section id='overview' className='scroll-mt-24'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Overview</h1>
				<p className='opacity-70'>Site-wide statistics</p>
			</div>

			<div className='space-y-8'>
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
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminOverviewPage
