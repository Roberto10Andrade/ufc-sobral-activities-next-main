'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <Toaster position="top-right" />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
