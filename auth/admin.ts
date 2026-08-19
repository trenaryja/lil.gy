import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import { env } from '@/env'

export const isAdmin = async (): Promise<boolean> => {
	const { user } = await withAuth()
	if (!user?.id) return false
	return env.ADMIN_USER_IDS.includes(user.id)
}

export const requireAdmin = async (): Promise<void> => {
	const { user } = await withAuth()
	if (!user?.id) redirect('/')
	if (!env.ADMIN_USER_IDS.includes(user.id)) redirect('/')
}
