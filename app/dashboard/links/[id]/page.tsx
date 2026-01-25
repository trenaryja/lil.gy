import { getLinkWithAnalytics } from '@/lib/actions/analytics'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AnalyticsChart } from '../../components/analytics-chart'
import { formatDistanceToNow } from 'date-fns'

export default async function LinkAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const result = await getLinkWithAnalytics(id)

	if (!result.success) {
		notFound()
	}

	const { link, clicksByDay, topCountries, topReferrers } = result.data

	return (
		<div className='max-w-6xl mx-auto space-y-8'>
			<div className='flex items-start justify-between'>
				<div>
					<Link href='/dashboard' className='btn btn-ghost btn-sm mb-2'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
						</svg>
						Back to Links
					</Link>
					<h1 className='text-3xl font-bold font-mono'>lil.gy/{link.slug}</h1>
					<p className='opacity-70 mt-1 break-all'>{link.url}</p>
				</div>
				<div className='text-right'>
					<div className='stat-value text-primary'>{link.clicks.toLocaleString()}</div>
					<div className='text-sm opacity-60'>total clicks</div>
				</div>
			</div>

			<div className='stats shadow bg-base-200 w-full'>
				<div className='stat'>
					<div className='stat-title'>Status</div>
					<div className='stat-value text-lg'>
						{link.isActive ? (
							<span className='badge badge-success'>Active</span>
						) : (
							<span className='badge badge-ghost'>Inactive</span>
						)}
					</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Created</div>
					<div className='stat-value text-lg'>{formatDistanceToNow(link.createdAt, { addSuffix: true })}</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Last Updated</div>
					<div className='stat-value text-lg'>{formatDistanceToNow(link.updatedAt, { addSuffix: true })}</div>
				</div>
			</div>

			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Clicks (Last 30 Days)</h2>
					<AnalyticsChart data={clicksByDay} />
				</div>
			</div>

			<div className='grid md:grid-cols-2 gap-6'>
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Top Countries</h2>
						{topCountries.length === 0 ? (
							<p className='opacity-60'>No data yet</p>
						) : (
							<ul className='space-y-2'>
								{topCountries.map(({ country, clicks }) => (
									<li key={country} className='flex justify-between items-center'>
										<span>{country}</span>
										<span className='badge badge-primary'>{clicks}</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Top Referrers</h2>
						{topReferrers.length === 0 ? (
							<p className='opacity-60'>No data yet</p>
						) : (
							<ul className='space-y-2'>
								{topReferrers.map(({ referrer, clicks }) => (
									<li key={referrer} className='flex justify-between items-center'>
										<span className='truncate flex-1 mr-2'>{referrer}</span>
										<span className='badge badge-primary'>{clicks}</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
