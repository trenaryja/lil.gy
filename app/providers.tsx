'use client'

import { ThemeProvider } from '@trenaryja/ui'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
	return <ThemeProvider>{children}</ThemeProvider>
}

export { useTheme } from '@trenaryja/ui'
