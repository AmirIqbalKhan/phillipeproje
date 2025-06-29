"use client"

import { EventMingleProvider } from '@/context/EventMingleContext'
import { SessionProvider } from 'next-auth/react'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EventMingleProvider>
        {children}
      </EventMingleProvider>
    </SessionProvider>
  )
} 