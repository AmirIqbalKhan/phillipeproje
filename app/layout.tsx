import type { Metadata, Viewport } from 'next'
import { Inter, Pacifico } from 'next/font/google'
import '@/styles/globals.css'
import ClientProvider from '@/components/ClientProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Event Mashups - Discover Amazing Events',
  description: 'Find, join, and create amazing events. Connect with people who share your interests.',
  keywords: 'events, meetups, concerts, workshops, social, networking',
  authors: [{ name: 'Event Mashups Team' }],
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
        <link rel="icon" type="image/png" href="/favicon.png" />
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