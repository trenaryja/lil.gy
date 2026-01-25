import Link from 'next/link'
import { withAuth, signOut, getSignInUrl } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const { user } = await withAuth({ ensureSignedIn: true })

	if (!user) {
		redirect(await getSignInUrl())
	}

	return (
		<div className='min-h-screen bg-base-100'>
			<nav className='navbar bg-base-200 px-4 md:px-8'>
				<div className='flex-1'>
					<Link href='/' className='text-2xl font-bold'>
						lil.gy
					</Link>
				</div>
				<div className='flex-none gap-2'>
					<Link href='/dashboard' className='btn btn-ghost btn-sm'>
						My Links
					</Link>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar placeholder'>
							<div className='bg-neutral text-neutral-content w-10 rounded-full'>
								<span>{user.firstName?.[0] || user.email?.[0] || '?'}</span>
							</div>
						</div>
						<ul tabIndex={0} className='dropdown-content menu bg-base-200 rounded-box z-10 w-52 p-2 shadow'>
							<li className='menu-title px-4 py-2'>
								<span className='text-xs opacity-60'>{user.email}</span>
							</li>
							<li>
								<form
									action={async () => {
										'use server'
										await signOut()
									}}
								>
									<button type='submit' className='w-full text-left'>
										Sign out
									</button>
								</form>
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<main className='p-4 md:p-8'>{children}</main>
		</div>
	)
}
