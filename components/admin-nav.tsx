'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
	{ href: '/admin', label: 'Overview', exact: true },
	{ href: '/admin/analytics', label: 'Analytics' },
	{ href: '/admin/database', label: 'Database' },
	{ href: '/admin/users', label: 'Users' },
]

export const AdminNav = () => {
	const pathname = usePathname()

	const isActive = (href: string, exact?: boolean) => {
		if (exact) return pathname === href
		return pathname.startsWith(href)
	}

	return (
		<>
			{/* Desktop sidebar */}
			<aside className='hidden md:block w-56 shrink-0'>
				<ul className='menu bg-base-200 rounded-box w-full'>
					<li className='menu-title'>Admin</li>
					{navItems.map((item) => (
						<li key={item.href}>
							<Link href={item.href} className={isActive(item.href, item.exact) ? 'active' : ''}>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</aside>

			{/* Mobile tabs */}
			<div className='md:hidden w-full overflow-x-auto mb-4'>
				<div role='tablist' className='tabs tabs-boxed bg-base-200'>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							role='tab'
							className={`tab whitespace-nowrap ${isActive(item.href, item.exact) ? 'tab-active' : ''}`}
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</>
	)
}
