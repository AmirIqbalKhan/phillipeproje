"use client"

import { EventMashupsProvider } from '@/context/EventMingleContext'
import { SessionProvider } from 'next-auth/react'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EventMashupsProvider>
        {children}
      </EventMashupsProvider>
    </SessionProvider>
  )
} 