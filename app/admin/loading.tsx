export default function AdminLoading() {
	return (
		<div className='space-y-8'>
			<div>
				<div className='h-8 w-48 bg-base-300 rounded animate-pulse' />
				<div className='h-4 w-64 bg-base-300 rounded animate-pulse mt-2' />
			</div>

			<div className='stats stats-vertical md:stats-horizontal shadow w-full bg-base-200'>
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className='stat'>
						<div className='stat-title'>
							<div className='h-4 w-20 bg-base-300 rounded animate-pulse' />
						</div>
						<div className='stat-value'>
							<div className='h-8 w-16 bg-base-300 rounded animate-pulse mt-2' />
						</div>
					</div>
				))}
			</div>

			<div className='card bg-base-200'>
				<div className='card-body'>
					<div className='h-6 w-32 bg-base-300 rounded animate-pulse' />
					<div className='space-y-3 mt-4'>
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className='h-10 bg-base-300 rounded animate-pulse' />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
