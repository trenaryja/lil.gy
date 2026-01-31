import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

const getAdminUserIds = (): string[] => {
	const ids = process.env.ADMIN_USER_IDS || ''
	return ids
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean)
}

export const isAdmin = async (): Promise<boolean> => {
	const { user } = await withAuth()
	if (!user?.id) return false
	return getAdminUserIds().includes(user.id)
}

export const requireAdmin = async (): Promise<void> => {
	const { user } = await withAuth()
	if (!user?.id) redirect('/')
	if (!getAdminUserIds().includes(user.id)) redirect('/')
}
