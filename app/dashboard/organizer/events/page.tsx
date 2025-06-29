import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
}

export default function OrganizerEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '' })
  const [creating, setCreating] = useState(false)
  const [editEvent, setEditEvent] = useState<Event | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '', date: '', location: '' })
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/organizer/events')
        .then(res => res.json())
        .then(data => setEvents(data.events || []))
        .finally(() => setLoadingEvents(false))
    }
  }, [status])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    const res = await fetch('/api/organizer/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
    const data = await res.json()
    if (res.ok) {
      setEvents([data.event, ...events])
      setShowCreate(false)
      setNewEvent({ name: '', description: '', date: '', location: '' })
    }
    setCreating(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return
    const res = await fetch(`/api/organizer/events/${id}`, { method: 'DELETE' })
    if (res.ok) setEvents(events.filter((e) => e.id !== id))
  }

  const openEdit = (event: Event) => {
    setEditEvent(event)
    setEditForm({ name: event.name, description: event.description, date: event.date?.slice(0, 10) || '', location: event.location })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editEvent) return
    setEditing(true)
    const res = await fetch(`/api/organizer/events/${editEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const data = await res.json()
    if (res.ok) {
      setEvents(events.map(ev => (ev.id === editEvent.id ? data.event : ev)))
      setEditEvent(null)
    }
    setEditing(false)
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      <button onClick={() => setShowCreate(true)} className="mb-6 px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700">Create New Event</button>
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form onSubmit={handleCreate} className="bg-white text-black rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4 relative">
            <button type="button" onClick={() => setShowCreate(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h2 className="text-2xl font-bold mb-2">Create Event</h2>
            <input required type="text" placeholder="Event Name" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} className="rounded-lg border px-4 py-2" />
            <textarea required placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="rounded-lg border px-4 py-2" />
            <input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="rounded-lg border px-4 py-2" />
            <input required type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="rounded-lg border px-4 py-2" />
            <button type="submit" className="bg-purple-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60" disabled={creating}>{creating ? 'Creating...' : 'Create Event'}</button>
          </form>
        </div>
      )}
      {editEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <form onSubmit={handleEdit} className="bg-white text-black rounded-xl p-8 w-full max-w-md shadow-xl flex flex-col gap-4 relative">
            <button type="button" onClick={() => setEditEvent(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
            <h2 className="text-2xl font-bold mb-2">Edit Event</h2>
            <input required type="text" placeholder="Event Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="rounded-lg border px-4 py-2" />
            <textarea required placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="rounded-lg border px-4 py-2" />
            <input required type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="rounded-lg border px-4 py-2" />
            <input required type="text" placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="rounded-lg border px-4 py-2" />
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60" disabled={editing}>{editing ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      )}
      {loadingEvents ? (
        <div>Loading events...</div>
      ) : (
        <ul className="space-y-4">
          {events.length === 0 && <li className="text-center py-8">No events yet.</li>}
          {events.map((event) => (
            <li key={event.id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
              <span>{event.name} <span className="ml-2 text-white/60">{event.date ? new Date(event.date).toLocaleDateString() : ''}</span></span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(event)} className="px-4 py-1 bg-blue-500 rounded hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="px-4 py-1 bg-red-500 rounded hover:bg-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 