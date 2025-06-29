import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  name: string
  status?: string
  isFeatured?: boolean
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/events')
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error)
          else setEvents(data.events || [])
        })
        .catch(() => setError('Failed to load events.'))
        .finally(() => setLoading(false))
    }
  }, [status])

  const updateEvent = async (id: string, data: Partial<Event>) => {
    const res = await fetch('/api/admin/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })
    if (res.ok) {
      const updated = await res.json()
      setEvents(events.map(e => (e.id === id ? { ...e, ...updated.event } : e)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    const res = await fetch('/api/admin/events', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setEvents(events.filter(e => e.id !== id))
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || session.user?.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Event Management</h1>
      {loading ? (
        <div>Loading events...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <ul className="space-y-4">
          {events.length === 0 && <li className="text-center py-8">No events found.</li>}
          {events.map(event => (
            <li key={event.id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
              <span>{event.name}</span>
              <div className="flex gap-2">
                <button onClick={() => updateEvent(event.id, { status: 'APPROVED' })} className="px-4 py-1 bg-green-500 rounded hover:bg-green-600">Approve</button>
                <button onClick={() => updateEvent(event.id, { isFeatured: !event.isFeatured })} className="px-4 py-1 bg-yellow-500 rounded hover:bg-yellow-600">{event.isFeatured ? 'Unfeature' : 'Feature'}</button>
                <button onClick={() => updateEvent(event.id, { status: 'REJECTED' })} className="px-4 py-1 bg-red-500 rounded hover:bg-red-600">Reject</button>
                <button onClick={() => handleDelete(event.id)} className="px-4 py-1 bg-red-700 rounded hover:bg-red-800">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 