"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react'

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

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Organizer events background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          {/* Home Button */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-30">
            <Link 
              href="/" 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            My Events
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Manage and organize your events
          </p>
          
          {/* Content */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Event Management</h2>
                <button 
                  onClick={() => setShowCreate(true)} 
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  Create New Event
                </button>
              </div>
              
              {loadingEvents ? (
                <div className="text-center py-8 text-white/60 text-sm sm:text-base">Loading events...</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {events.length === 0 && (
                    <div className="text-center py-8 text-white/60 text-sm sm:text-base">No events yet. Create your first event!</div>
                  )}
                  {events.map((event) => (
                    <div key={event.id} className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{event.name}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {event.date ? new Date(event.date).toLocaleDateString() : 'No date set'}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location || 'No location set'}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEdit(event)} 
                            className="flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(event.id)} 
                            className="flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-2 bg-red-500 rounded hover:bg-red-600 transition-colors text-xs sm:text-sm"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white text-black rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md shadow-xl flex flex-col gap-3 sm:gap-4 relative">
            <button type="button" onClick={() => setShowCreate(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Event</h2>
            <input 
              required 
              type="text" 
              placeholder="Event Name" 
              value={newEvent.name} 
              onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <textarea 
              required 
              placeholder="Description" 
              value={newEvent.description} 
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
              rows={3}
            />
            <input 
              required 
              type="date" 
              value={newEvent.date} 
              onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <input 
              required 
              type="text" 
              placeholder="Location" 
              value={newEvent.location} 
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <button 
              type="submit" 
              className="bg-purple-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60 text-sm sm:text-base" 
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}
      
      {/* Edit Event Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEdit} className="bg-white text-black rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md shadow-xl flex flex-col gap-3 sm:gap-4 relative">
            <button type="button" onClick={() => setEditEvent(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Edit Event</h2>
            <input 
              required 
              type="text" 
              placeholder="Event Name" 
              value={editForm.name} 
              onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <textarea 
              required 
              placeholder="Description" 
              value={editForm.description} 
              onChange={e => setEditForm({ ...editForm, description: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
              rows={3}
            />
            <input 
              required 
              type="date" 
              value={editForm.date} 
              onChange={e => setEditForm({ ...editForm, date: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <input 
              required 
              type="text" 
              placeholder="Location" 
              value={editForm.location} 
              onChange={e => setEditForm({ ...editForm, location: e.target.value })} 
              className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" 
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60 text-sm sm:text-base" 
              disabled={editing}
            >
              {editing ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
} 