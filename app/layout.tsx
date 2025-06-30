import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import ClientProvider from '@/components/ClientProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventMingle - Discover Amazing Events',
  description: 'Find, join, and create amazing events. Connect with people who share your interests.',
  keywords: 'events, meetups, concerts, workshops, social, networking',
  authors: [{ name: 'EventMingle Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <ClientProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </ClientProvider>
      </body>
    </html>
  )
} 