import type { Metadata } from 'next'
import { Comic_Neue } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
const font = Comic_Neue({
  subsets: ["latin"],
  weight: ["700"]
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth();
  
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
    </SessionProvider>
    
  )
}
