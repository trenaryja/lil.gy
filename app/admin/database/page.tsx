import { getDatabaseInsights } from '@/actions'
import { StatCard } from '@/components'

const AdminDatabasePage = async () => {
	const result = await getDatabaseInsights()

	if (!result.success)
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)

	const { linkCount, clickEventCount, recentLinks, recentClicks } = result.data

	return (
		<section id='database' className='scroll-mt-24'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold'>Database</h1>
				<p className='opacity-70'>Table statistics and recent activity</p>
			</div>

			<div className='space-y-8'>
				{/* Table stats */}
				<div>
					<h2 className='text-lg font-semibold mb-4'>Table Row Counts</h2>
					<div className='stats stats-vertical md:stats-horizontal shadow w-full bg-base-200'>
						<StatCard title='Links' value={linkCount} description='links table' />
						<StatCard title='Click Events' value={clickEventCount} description='click_events table' />
					</div>
				</div>

				{/* Recent links */}
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Recent Links</h2>
						{recentLinks.length === 0 ? (
							<p className='opacity-60'>No links yet</p>
						) : (
							<div className='overflow-x-auto'>
								<table className='table table-zebra table-sm'>
									<thead>
										<tr>
											<th>Slug</th>
											<th>Destination</th>
											<th>User ID</th>
											<th>Created</th>
										</tr>
									</thead>
									<tbody>
										{recentLinks.map((link) => (
											<tr key={link.id}>
												<td className='font-mono'>/{link.slug}</td>
												<td className='max-w-xs truncate' title={link.url}>
													{link.url}
												</td>
												<td className='font-mono text-xs opacity-70'>
													{link.userId ? `${link.userId.slice(0, 12)}...` : 'Anonymous'}
												</td>
												<td className='text-sm opacity-70'>{link.createdAt.toLocaleString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>

				{/* Recent clicks */}
				<div className='card bg-base-200'>
					<div className='card-body'>
						<h2 className='card-title'>Recent Click Events</h2>
						{recentClicks.length === 0 ? (
							<p className='opacity-60'>No clicks yet</p>
						) : (
							<div className='overflow-x-auto'>
								<table className='table table-zebra table-sm'>
									<thead>
										<tr>
											<th>Link ID</th>
											<th>Country</th>
											<th>Timestamp</th>
										</tr>
									</thead>
									<tbody>
										{recentClicks.map((click) => (
											<tr key={click.id}>
												<td className='font-mono text-xs'>{click.linkId.slice(0, 8)}...</td>
												<td>{click.country || 'Unknown'}</td>
												<td className='text-sm opacity-70'>{click.timestamp.toLocaleString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}

export default AdminDatabasePage
