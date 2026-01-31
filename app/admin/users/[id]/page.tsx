import { getUserDetails } from '@/actions'
import { LinkTable } from '@/components'
import Link from 'next/link'

type UserDetailPageProps = {
	params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
	const { id } = await params
	const userId = decodeURIComponent(id)
	const result = await getUserDetails(userId)

	if (!result.success) {
		return (
			<div className='alert alert-error'>
				<span>{result.error}</span>
			</div>
		)
	}

	const { links } = result.data
	const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)

	return (
		<div className='space-y-8'>
			<div className='flex items-center gap-4'>
				<Link href='/admin/users' className='btn btn-ghost btn-sm'>
					&larr; Back
				</Link>
				<div>
					<h1 className='text-2xl font-bold'>User Details</h1>
					<p className='font-mono text-sm opacity-70'>{userId}</p>
				</div>
			</div>

			{/* User stats */}
			<div className='stats stats-vertical md:stats-horizontal shadow bg-base-200'>
				<div className='stat'>
					<div className='stat-title'>Total Links</div>
					<div className='stat-value'>{links.length}</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Total Clicks</div>
					<div className='stat-value'>{totalClicks.toLocaleString()}</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>Active Links</div>
					<div className='stat-value'>{links.filter((l) => l.isActive).length}</div>
				</div>
			</div>

			{/* User's links */}
			<div className='card bg-base-200'>
				<div className='card-body'>
					<h2 className='card-title'>Links</h2>
					<LinkTable links={links} />
				</div>
			</div>
		</div>
	)
}
