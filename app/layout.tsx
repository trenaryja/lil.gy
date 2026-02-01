import { Header } from '@/components'
import { ThemeProvider } from '@trenaryja/ui'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = { title: 'lil.gy' }

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
	return (
		<html suppressHydrationWarning lang='en' className='scroll-smooth antialiased'>
			<body className='h-screen grid grid-rows-[auto_minmax(0,1fr)]'>
				<ThemeProvider>
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}

export default RootLayout
