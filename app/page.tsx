import { CreateLinkForm } from '@/components/create-link-form'
import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs'
import Link from 'next/link'

export default async function Home() {
	const { user } = await withAuth()
	const signInUrl = user ? null : await getSignInUrl()

	return (
		<main className='min-h-screen bg-base-100'>
			{/* Navigation */}
			<nav className='fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200'>
				<div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
					<Link href='/' className='text-xl font-semibold tracking-tight'>
						lil.gy
					</Link>
					{user ? (
						<Link href='/dashboard' className='btn btn-ghost btn-sm'>
							Dashboard
						</Link>
					) : (
						<a href={signInUrl!} className='btn btn-primary btn-sm'>
							Sign In
						</a>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<section className='min-h-screen flex flex-col items-center justify-center px-6 pt-16'>
				<div className='w-full max-w-lg mx-auto text-center'>
					{/* Tagline */}
					<h1 className='animate-fade-up text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight'>
						Make your links <span className='text-primary relative'>lil</span>
					</h1>

					{/* Subtitle */}
					<p className='animate-fade-up delay-100 mt-6 text-base-content/60 text-lg'>
						The simplest URL shortener. No fuss.
					</p>

					{/* Form */}
					<div className='animate-fade-up delay-200 mt-10'>
						<CreateLinkForm />
					</div>

					{/* Sign in prompt */}
					{!user && (
						<p className='animate-fade-up delay-300 mt-8 text-sm text-base-content/50'>
							<a href={signInUrl!} className='underline hover:text-base-content transition-colors'>
								Sign in
							</a>{' '}
							for more links and analytics
						</p>
					)}
				</div>
			</section>
		</main>
	)
}
