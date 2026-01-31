import { requireAdmin } from '@/auth'
import { AdminNav } from './components/admin-nav'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	await requireAdmin()

	return (
		<div className='flex flex-col md:flex-row p-4 md:p-8 pt-20 md:pt-24 gap-6'>
			<AdminNav />
			<main className='flex-1 min-w-0'>{children}</main>
		</div>
	)
}

export default AdminLayout
