"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface RSVP {
  id: string
  status: string
  event: { name: string }
  user: { name: string; email: string }
}

export default function OrganizerRSVPsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/organizer/rsvps')
        .then(res => res.json())
        .then(data => setRsvps(data.rsvps || []))
        .finally(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Event RSVPs</h1>
      {loading ? (
        <div>Loading RSVPs...</div>
      ) : (
        <ul className="space-y-4">
          {rsvps.length === 0 && <li className="text-center py-8">No RSVPs yet.</li>}
          {rsvps.map(rsvp => (
            <li key={rsvp.id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
              <span>
                <span className="font-semibold text-purple-300">{rsvp.event.name}</span> — {rsvp.user.name} ({rsvp.user.email})
              </span>
              <span className="px-4 py-1 rounded font-semibold" style={{ background: rsvp.status === 'CONFIRMED' ? '#22c55e' : rsvp.status === 'PENDING' ? '#facc15' : '#ef4444', color: 'black' }}>{rsvp.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 