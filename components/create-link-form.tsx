'use client'

import { useState, useTransition } from 'react'
import { createLink } from '@/lib/actions/links'

export function CreateLinkForm() {
	const [isPending, startTransition] = useTransition()
	const [result, setResult] = useState<{
		success: boolean
		slug?: string
		error?: string
	} | null>(null)
	const [showCustomSlug, setShowCustomSlug] = useState(false)
	const [copied, setCopied] = useState(false)

	function handleSubmit(formData: FormData) {
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

	function handleCopy(text: string) {
		navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
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
						placeholder='Paste your long URL...'
						className='input input-bordered flex-1 bg-base-200/50 focus:bg-base-100 transition-colors'
						required
						disabled={isPending}
					/>
					<button type='submit' className='btn btn-primary min-w-[100px]' disabled={isPending}>
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
					<div className='animate-scale-in'>
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
				<div className='animate-scale-in mt-4 p-4 rounded-lg bg-error/10 border border-error/20 text-error flex items-start gap-3'>
					<svg className='w-5 h-5 shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<span className='text-sm'>{result.error}</span>
				</div>
			)}

			{/* Success state */}
			{shortUrl && (
				<div className='animate-scale-in mt-4 p-4 rounded-lg bg-success/10 border border-success/20'>
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
						<button type='button' className='btn btn-sm btn-ghost shrink-0' onClick={() => handleCopy(shortUrl)}>
							{copied ? (
								<svg className='w-4 h-4 text-success' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
								</svg>
							) : (
								<svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
									/>
								</svg>
							)}
							<span className='ml-1'>{copied ? 'Copied!' : 'Copy'}</span>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
