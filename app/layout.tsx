import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'

import './globals.css'

export const metadata: Metadata = {
	title: 'Blank Next App',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html suppressHydrationWarning lang='en'>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
