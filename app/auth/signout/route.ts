import { signOut } from '@workos-inc/authkit-nextjs'
import { headers } from 'next/headers'

export async function GET() {
	const headersList = await headers()
	const host = headersList.get('host') || 'localhost:3000'
	const protocol = host.includes('localhost') ? 'http' : 'https'
	const returnTo = `${protocol}://${host}`

	await signOut({ returnTo })
}
