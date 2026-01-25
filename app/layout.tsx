import type { Metadata } from 'next'
import { Providers } from './providers'

import './globals.css'

export const metadata: Metadata = {
	title: 'lil.gy',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html suppressHydrationWarning lang='en'>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
