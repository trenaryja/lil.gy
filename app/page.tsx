import { CreateLinkForm } from '@/components'
import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs'

const Home = async () => {
	const { user } = await withAuth()
	const signInUrl = user ? null : await getSignInUrl()

	return (
		<main className='place-self-center grid gap-4'>
			<h1 className='text-6xl font-bold'>
				Make your links <span className='text-primary relative'>lil</span>
			</h1>

			<CreateLinkForm />

			{!user && (
				<p className='text-base-content/50 text-center'>
					<a href={signInUrl!} className='link'>
						Sign in
					</a>{' '}
					for more links and analytics
				</p>
			)}
		</main>
	)
}

export default Home
