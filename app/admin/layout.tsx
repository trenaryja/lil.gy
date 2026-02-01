import { requireAdmin } from '@/auth'
import Link from 'next/link'
import { LuChartBar, LuDatabase, LuHouse, LuPanelLeft, LuUsers } from 'react-icons/lu'

const navItems = [
	{ href: '/admin', label: 'Overview', icon: LuHouse },
	{ href: '/admin/analytics', label: 'Analytics', icon: LuChartBar },
	{ href: '/admin/database', label: 'Database', icon: LuDatabase },
	{ href: '/admin/users', label: 'Users', icon: LuUsers },
]

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	await requireAdmin()

	return (
		<div className='drawer drawer-open h-full overflow-hidden'>
			<input id='admin-drawer' type='checkbox' className='drawer-toggle' />

			<div className='drawer-content overflow-auto'>
				<main className='p-4'>{children}</main>
			</div>

			<div className='drawer-side'>
				<label htmlFor='admin-drawer' aria-label='close sidebar' className='drawer-overlay' />
				<aside className='min-h-full flex flex-col bg-base-200'>
					<ul className='menu w-full gap-2 p-2'>
						<li>
							<label htmlFor='admin-drawer'>
								<LuPanelLeft className='text-xl' />
								<span className='overflow-hidden text-nowrap is-drawer-close:hidden'>Collapse</span>
							</label>
						</li>
						{navItems.map((item) => (
							<li key={item.href}>
								<Link href={item.href}>
									<item.icon className='text-xl' />
									<span className='overflow-hidden text-nowrap is-drawer-close:hidden'>{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</aside>
			</div>
		</div>
	)
}

export default AdminLayout
