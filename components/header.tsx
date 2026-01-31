import { ThemePicker } from '@trenaryja/ui'
import { getSignInUrl, withAuth } from '@workos-inc/authkit-nextjs'
import Image from 'next/image'
import Link from 'next/link'

export const Header = async () => {
	const { user } = await withAuth()
	const signInUrl = user ? null : await getSignInUrl()

	return (
		<header className='sticky top-0 frosted-glass full-bleed-container z-10'>
			<div className='flex justify-between items-center p-4'>
				<Link href='/' className='text-3xl font-black'>
					lil.gy
				</Link>
				<div className='flex gap-2 items-center'>
					<ThemePicker variant='popover' />
					{user ? (
						<div className='dropdown dropdown-end'>
							<div tabIndex={0} role='button' className='btn btn-circle btn-primary'>
								{user.profilePictureUrl ? (
									<Image src={user.profilePictureUrl} alt='' fill className='rounded-full' />
								) : (
									<p>{user.firstName?.[0] || user.lastName?.[0] || user.email?.[0]?.toUpperCase() || '?'}</p>
								)}
							</div>
							<ul tabIndex={0} className='dropdown-content menu bg-base-200 rounded-box shadow'>
								<li className='menu-title'>{user.email}</li>
								<li>
									<Link href='/dashboard'>Dashboard</Link>
								</li>
								<li>
									<Link href='/auth/signout'>Sign out</Link>
								</li>
							</ul>
						</div>
					) : (
						<a href={signInUrl!} className='btn btn-primary'>
							Sign In
						</a>
					)}
				</div>
			</div>
		</header>
	)
}
