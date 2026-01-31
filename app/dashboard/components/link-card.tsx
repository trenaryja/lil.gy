'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteLink, toggleLinkActive } from '@/actions'
import { formatDistanceToNow } from 'date-fns'
import type { links } from '@/db'
import { ChartIcon, CopyIcon, EyeIcon, EyeOffIcon, TrashIcon } from './icons'

type LinkCardProps = {
	link: typeof links.$inferSelect
}

export const LinkCard = ({ link }: LinkCardProps) => {
	const [isPending, startTransition] = useTransition()
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.slug}`

	const handleToggle = () => {
		startTransition(async () => {
			await toggleLinkActive(link.id)
		})
	}

	const handleDelete = () => {
		startTransition(async () => {
			await deleteLink(link.id)
		})
	}

	const copyToClipboard = () => {
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
						<button type='button' onClick={copyToClipboard} className='btn btn-ghost btn-sm' title='Copy short URL'>
							<CopyIcon />
						</button>

						<Link href={`/dashboard/links/${link.id}`} className='btn btn-ghost btn-sm' title='Analytics'>
							<ChartIcon />
						</Link>

						<button
							type='button'
							onClick={handleToggle}
							className='btn btn-ghost btn-sm'
							disabled={isPending}
							title={link.isActive ? 'Disable link' : 'Enable link'}
						>
							{link.isActive ? <EyeIcon /> : <EyeOffIcon />}
						</button>

						{showDeleteConfirm ? (
							<div className='flex items-center gap-1'>
								<button type='button' onClick={handleDelete} className='btn btn-error btn-sm' disabled={isPending}>
									{isPending ? <span className='loading loading-spinner loading-xs' /> : 'Delete'}
								</button>
								<button
									type='button'
									onClick={() => setShowDeleteConfirm(false)}
									className='btn btn-ghost btn-sm'
									disabled={isPending}
								>
									Cancel
								</button>
							</div>
						) : (
							<button
								type='button'
								onClick={() => setShowDeleteConfirm(true)}
								className='btn btn-ghost btn-sm text-error'
								title='Delete link'
							>
								<TrashIcon />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
