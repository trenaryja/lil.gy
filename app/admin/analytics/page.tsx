import { getLinkBreakdown, getSiteWideAnalytics } from '@/actions'
import { AreaChart } from '@/components'
import { LinkBreakdownChart } from '@/components/admin'

const AdminAnalyticsPage = async () => {
	const [analyticsResult, linkBreakdown] = await Promise.all([getSiteWideAnalytics(30), getLinkBreakdown()])

	if (!analyticsResult.success)
		return (
			<div className='alert alert-error'>
				<span>{analyticsResult.error}</span>
			</div>
		)

	const { clicksByDay, topLinks, topCountries, topReferrers } = analyticsResult.data

	return (
		<section id='analytics' className='scroll-mt-24'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Analytics</h1>
				<p className='opacity-70'>Last 30 days across all links</p>
			</div>

			<div className='space-y-8'>
				{/* Link breakdown */}
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Link Breakdown</h2>
						<LinkBreakdownChart data={linkBreakdown} />
					</div>
				</div>

				{/* Clicks over time */}
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Clicks Over Time</h2>
						<AreaChart
							data={clicksByDay}
							xKey='date'
							yKey='clicks'
							xType='date'
							valueLabel='click'
							emptyMessage='No click data available'
						/>
					</div>
				</div>

				{/* Top links */}
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Top Links</h2>
						{topLinks.length === 0 ? (
							<p className='opacity-60'>No links yet</p>
						) : (
							<div className='overflow-x-auto'>
								<table className='table table-zebra'>
									<thead>
										<tr>
											<th>Slug</th>
											<th>Destination</th>
											<th className='text-right'>Total Clicks</th>
										</tr>
									</thead>
									<tbody>
										{topLinks.map((link) => (
											<tr key={link.slug}>
												<td className='font-mono'>/{link.slug}</td>
												<td className='max-w-xs truncate' title={link.url}>
													{link.url}
												</td>
												<td className='text-right font-mono'>{link.clicks.toLocaleString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>

				{/* Top countries and referrers */}
				<div className='grid md:grid-cols-2 gap-6'>
					<div className='card bg-base-200'>
						<div className='card-body'>
							<h2 className='card-title'>Top Countries</h2>
							{topCountries.length === 0 ? (
								<p className='opacity-60'>No data yet</p>
							) : (
								<ul className='space-y-2'>
									{topCountries.map((item) => (
										<li key={item.country} className='flex justify-between'>
											<span>{item.country}</span>
											<span className='font-mono opacity-70'>{item.clicks}</span>
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
									{topReferrers.map((item) => (
										<li key={item.referrer} className='flex justify-between'>
											<span className='truncate' title={item.referrer}>
												{item.referrer}
											</span>
											<span className='font-mono opacity-70'>{item.clicks}</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminAnalyticsPage
