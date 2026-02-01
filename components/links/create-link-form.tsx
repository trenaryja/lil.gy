'use client'

import { createLink } from '@/actions'
import { ClipboardButton } from '@/components'
import { useState, useTransition } from 'react'
import { LuCircleAlert } from 'react-icons/lu'

export const CreateLinkForm = () => {
	const [isPending, startTransition] = useTransition()
	const [result, setResult] = useState<{
		success: boolean
		slug?: string
		error?: string
	} | null>(null)
	const [showCustomSlug, setShowCustomSlug] = useState(false)

	const handleSubmit = (formData: FormData) => {
		setResult(null)
		startTransition(async () => {
			const response = await createLink(formData)

			if (response.success) {
				setResult({ success: true, slug: response.data.slug })
				const form = document.getElementById('create-link-form') as HTMLFormElement
				form?.reset()
				setShowCustomSlug(false)
			} else {
				setResult({ success: false, error: response.error })
			}
		})
	}

	const shortUrl = result?.success && result.slug ? `${window.location.origin}/${result.slug}` : null

	return (
		<div className='w-full'>
			<form id='create-link-form' action={handleSubmit} className='space-y-3'>
				{/* Main input row */}
				<div className='flex gap-2'>
					<input
						type='url'
						name='url'
						placeholder='Paste your big link...'
						className='input input-bordered flex-1 bg-base-200/50 focus:bg-base-100 transition-colors'
						required
						disabled={isPending}
					/>
					<button type='submit' className='btn btn-primary' disabled={isPending}>
						{isPending ? <span className='loading loading-spinner loading-sm' /> : 'Shorten'}
					</button>
				</div>

				{/* Custom slug toggle */}
				<label className='flex items-center gap-2 cursor-pointer w-fit text-sm text-base-content/60 hover:text-base-content transition-colors'>
					<input
						type='checkbox'
						className='checkbox checkbox-xs'
						checked={showCustomSlug}
						onChange={(e) => setShowCustomSlug(e.target.checked)}
					/>
					<span>Custom slug</span>
				</label>

				{/* Custom slug input */}
				{showCustomSlug && (
					<div className='animate-in fade-in zoom-in-95 duration-300'>
						<div className='flex items-stretch rounded-lg border border-base-300 overflow-hidden bg-base-200/30'>
							<span className='px-3 flex items-center text-sm text-base-content/50 bg-base-200/50 border-r border-base-300'>
								lil.gy/
							</span>
							<input
								type='text'
								name='customSlug'
								placeholder='my-custom-slug'
								className='input border-0 flex-1 bg-transparent focus:outline-none'
								pattern='[a-zA-Z0-9_-]+'
								minLength={3}
								maxLength={50}
								disabled={isPending}
							/>
						</div>
						<p className='text-xs text-base-content/40 mt-1.5 ml-1'>Letters, numbers, hyphens, and underscores</p>
					</div>
				)}
			</form>

			{/* Error state */}
			{result?.error && (
				<div className='animate-in fade-in zoom-in-95 duration-300 mt-4 p-4 rounded-lg bg-error/10 border border-error/20 text-error flex items-start gap-3'>
					<LuCircleAlert />
					<span className='text-sm'>{result.error}</span>
				</div>
			)}

			{/* Success state */}
			{shortUrl && (
				<div className='animate-in fade-in zoom-in-95 duration-300 mt-4 p-4 rounded-lg bg-success/10 border border-success/20'>
					<div className='flex items-center justify-between gap-4'>
						<div className='min-w-0'>
							<p className='text-xs text-success font-medium uppercase tracking-wide mb-1'>Your lil link</p>
							<a
								href={shortUrl}
								target='_blank'
								rel='noopener noreferrer'
								className='text-base-content font-medium hover:text-primary transition-colors truncate block'
							>
								{shortUrl}
							</a>
						</div>
						<ClipboardButton copy={shortUrl} className='btn btn-sm btn-ghost btn-square' />
					</div>
				</div>
			)}
		</div>
	)
}
