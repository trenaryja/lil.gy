import { getSiteWideAnalytics } from '@/actions'
import { AnalyticsChart } from '@/components'

const AdminAnalyticsPage = async () => {
	const result = await getSiteWideAnalytics(30)

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const { clicksByDay, topLinks, topCountries, topReferrers } = result.data

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-2xl font-bold'>Site Analytics</h1>
				<p className='opacity-70'>Last 30 days across all links</p>
			</div>

			{/* Clicks over time */}
			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Clicks Over Time</h2>
					<AnalyticsChart data={clicksByDay} />
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
	)
}

export default AdminAnalyticsPage
