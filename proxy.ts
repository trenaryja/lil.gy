import { authkit } from '@workos-inc/authkit-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedPaths = ['/dashboard', '/admin']

const isProtectedPath = (pathname: string) =>
	protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

const applyHeaders = (response: NextResponse, headers: Headers) => {
	for (const [key, value] of headers) {
		if (key.toLowerCase() === 'set-cookie') response.headers.append(key, value)
		else response.headers.set(key, value)
	}

	return response
}

const proxy = async (request: NextRequest) => {
	const { session, headers: authkitHeaders, authorizationUrl } = await authkit(request)

	const continueRequest = () =>
		applyHeaders(NextResponse.next({ request: { headers: new Headers(request.headers) } }), authkitHeaders)

	if (!isProtectedPath(request.nextUrl.pathname)) return continueRequest()

	if (!session.user) {
		if (authorizationUrl) return applyHeaders(NextResponse.redirect(authorizationUrl), authkitHeaders)
		return NextResponse.redirect(new URL('/', request.url))
	}

	return continueRequest()
}

export default proxy

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
