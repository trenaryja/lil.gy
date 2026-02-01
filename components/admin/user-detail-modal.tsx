'use client'

import { getUserDetails } from '@/actions'
import { LinkTable } from '@/components'
import { Modal } from '@trenaryja/ui'
import { useEffect, useState, useTransition } from 'react'

type UserLink = {
	id: string
	slug: string
	url: string
	clicks: number
	isActive: boolean
	createdAt: Date
}

type UserDetailModalProps = {
	userId: string | null
	onClose: () => void
}

export const UserDetailModal = ({ userId, onClose }: UserDetailModalProps) => {
	const [links, setLinks] = useState<UserLink[]>([])
	const [isPending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!userId) return

		startTransition(async () => {
			setError(null)
			const result = await getUserDetails(userId)

			if (result.success) setLinks(result.data.links)
			else setError(result.error)
		})
	}, [userId])

	const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
	const activeLinks = links.filter((l) => l.isActive).length

	return (
		<Modal
			open={!!userId}
			onOpenChange={(open) => {
				if (!open) onClose()
			}}
			dismissOptions={['outsideClick', 'escapeKey']}
			backdropBlur
			className='w-full max-w-4xl'
		>
			<div className='p-6 space-y-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h2 className='text-2xl font-bold'>User Details</h2>
						<p className='font-mono text-sm opacity-70'>{userId}</p>
					</div>
					<button type='button' onClick={onClose} className='btn btn-ghost btn-sm btn-circle'>
						<span className='sr-only'>Close</span>
						&times;
					</button>
				</div>

				{isPending ? (
					<div className='space-y-4'>
						<div className='stats stats-vertical md:stats-horizontal shadow bg-base-200 w-full'>
							{[1, 2, 3].map((i) => (
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
					</div>
				) : error ? (
					<div className='alert alert-error'>
						<span>{error}</span>
					</div>
				) : (
					<>
						{/* User stats */}
						<div className='stats stats-vertical md:stats-horizontal shadow bg-base-200 w-full'>
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
								<div className='stat-value'>{activeLinks}</div>
							</div>
						</div>

						{/* User's links */}
						<div className='card bg-base-200'>
							<div className='card-body'>
								<h3 className='card-title'>Links</h3>
								<LinkTable links={links} />
							</div>
						</div>
					</>
				)}
			</div>
		</Modal>
	)
}
