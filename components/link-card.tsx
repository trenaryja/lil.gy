'use client'

import { deleteLink, toggleLinkActive } from '@/actions'
import type { links } from '@/db'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { useTransition } from 'react'
import { LuChartBar, LuEye, LuEyeOff, LuTrash } from 'react-icons/lu'
import { ClipboardButton } from './clipboard-button'
import { ConfirmButton } from './confirm-button'

type LinkCardProps = {
	link: typeof links.$inferSelect
}

export const LinkCard = ({ link }: LinkCardProps) => {
	const [isPending, startTransition] = useTransition()
	const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${link.slug}`

	const handleToggle = () => {
		startTransition(async () => {
			await toggleLinkActive(link.id)
		})
	}

	return (
		<div className={`relative surface p-4 grid gap-2 ${!link.isActive ? 'opacity-60' : ''}`}>
			{!link.isActive && <span className='absolute badge badge-soft badge-sm -top-2.5 right-4'>Inactive</span>}
			<div className='flex justify-between gap-2 min-w-0'>
				<div className='flex gap-2 items-center min-w-0 overflow-hidden'>
					<ClipboardButton copy={shortUrl} className='btn btn-soft btn-square' title='Copy lil URL' />
					<h1 className='text-2xl font-mono font-black truncate'>lil.gy/{link.slug}</h1>
				</div>
				<div className='flex gap-2 items-center'>
					<Link href={`/dashboard/links/${link.id}`} className='btn btn-soft btn-square btn-primary'>
						<LuChartBar />
					</Link>
					<button
						type='button'
						onClick={handleToggle}
						className='btn btn-soft btn-square'
						disabled={isPending}
						title={link.isActive ? 'Disable link' : 'Enable link'}
					>
						{link.isActive ? <LuEye /> : <LuEyeOff />}
					</button>

					<ConfirmButton
						onConfirm={() => deleteLink(link.id)}
						className='btn btn-square btn-error btn-soft'
						confirmClassName='btn btn-square btn-error'
						timeout={5000}
						title='Delete link'
					>
						<LuTrash />
					</ConfirmButton>
				</div>
			</div>
			<a href={link.url} target='_blank' rel='noopener noreferrer' className='link opacity-70 truncate'>
				{link.url}
			</a>
			<div className='flex gap-4 justify-between opacity-50 min-w-0'>
				<span className='truncate'>{link.clicks} clicks</span>
				<span className='truncate'>Created {formatDistanceToNow(link.createdAt, { addSuffix: true })}</span>
			</div>
		</div>
	)
}
