import { authkit } from '@workos-inc/authkit-nextjs'
import { NextRequest, NextResponse } from 'next/server'

const unauthenticatedPaths = ['/', '/api/auth/callback', '/api/cron']

function isUnauthenticatedPath(pathname: string): boolean {
	return unauthenticatedPaths.some((path) => {
		if (path.endsWith(':path*')) {
			const basePath = path.replace(':path*', '')
			return pathname.startsWith(basePath)
		}
		return pathname === path
	})
}

export default async function proxy(request: NextRequest) {
	const { session, headers: authkitHeaders, authorizationUrl } = await authkit(request)

	const { pathname } = request.nextUrl

	// Allow unauthenticated paths
	if (isUnauthenticatedPath(pathname)) {
		const response = NextResponse.next({
			request: { headers: new Headers(request.headers) },
		})

		for (const [key, value] of authkitHeaders) {
			if (key.toLowerCase() === 'set-cookie') {
				response.headers.append(key, value)
			} else {
				response.headers.set(key, value)
			}
		}

		return response
	}

	// Redirect to sign-in if no session on protected routes
	if (!session.user) {
		if (authorizationUrl) {
			const response = NextResponse.redirect(authorizationUrl)

			for (const [key, value] of authkitHeaders) {
				if (key.toLowerCase() === 'set-cookie') {
					response.headers.append(key, value)
				} else {
					response.headers.set(key, value)
				}
			}

			return response
		}

		// Fallback to home if no authorization URL (shouldn't happen)
		return NextResponse.redirect(new URL('/', request.url))
	}

	// User is authenticated, continue
	const response = NextResponse.next({
		request: { headers: new Headers(request.headers) },
	})

	for (const [key, value] of authkitHeaders) {
		if (key.toLowerCase() === 'set-cookie') {
			response.headers.append(key, value)
		} else {
			response.headers.set(key, value)
		}
	}

	return response
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
