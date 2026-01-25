'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toggleLinkActive, deleteLink } from '@/lib/actions/links'
import { formatDistanceToNow } from 'date-fns'
import type { links } from '@/lib/db/schema'

interface LinkCardProps {
	link: typeof links.$inferSelect
}

export function LinkCard({ link }: LinkCardProps) {
	const [isPending, startTransition] = useTransition()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.slug}`

	function handleToggle() {
		startTransition(async () => {
			await toggleLinkActive(link.id)
		})
	}

	function handleDelete() {
		startTransition(async () => {
			await deleteLink(link.id)
		})
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(shortUrl)
	}

	return (
		<div className={`card bg-base-200 ${!link.isActive ? 'opacity-60' : ''}`}>
			<div className='card-body'>
				<div className='flex flex-col md:flex-row md:items-center gap-4'>
					<div className='flex-1 min-w-0'>
						<div className='flex items-center gap-2'>
							<Link href={`/dashboard/links/${link.id}`} className='font-mono text-lg link link-primary'>
								lil.gy/{link.slug}
							</Link>
							{!link.isActive && <span className='badge badge-ghost badge-sm'>Inactive</span>}
						</div>
						<p className='text-sm opacity-70 truncate mt-1' title={link.url}>
							{link.url}
						</p>
						<div className='flex items-center gap-4 mt-2 text-sm opacity-60'>
							<span>{link.clicks} clicks</span>
							<span>Created {formatDistanceToNow(link.createdAt, { addSuffix: true })}</span>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<button onClick={copyToClipboard} className='btn btn-ghost btn-sm' title='Copy short URL'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
								/>
							</svg>
						</button>

						<Link href={`/dashboard/links/${link.id}`} className='btn btn-ghost btn-sm' title='Analytics'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
								/>
							</svg>
						</Link>

						<button
							onClick={handleToggle}
							className='btn btn-ghost btn-sm'
							disabled={isPending}
							title={link.isActive ? 'Disable link' : 'Enable link'}
						>
							{link.isActive ? (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
									/>
								</svg>
							) : (
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
									/>
								</svg>
							)}
						</button>

						{showDeleteConfirm ? (
							<div className='flex items-center gap-1'>
								<button onClick={handleDelete} className='btn btn-error btn-sm' disabled={isPending}>
									{isPending ? <span className='loading loading-spinner loading-xs' /> : 'Delete'}
								</button>
								<button
									onClick={() => setShowDeleteConfirm(false)}
									className='btn btn-ghost btn-sm'
									disabled={isPending}
								>
									Cancel
								</button>
							</div>
						) : (
							<button
								onClick={() => setShowDeleteConfirm(true)}
								className='btn btn-ghost btn-sm text-error'
								title='Delete link'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
									/>
								</svg>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
