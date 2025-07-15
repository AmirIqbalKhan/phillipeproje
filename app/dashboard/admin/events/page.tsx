"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Clock,
  Users,
  DollarSign,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Settings,
  FileText
} from 'lucide-react'

export default function AdminEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showEventDetails, setShowEventDetails] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/events')
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setEvents(data.events || [])
      }
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchEventDetails = async (eventId: string) => {
    try {
      const response = await fetch(`/api/admin/events?eventId=${eventId}`)
      const data = await response.json()
      if (data.event) {
        setSelectedEvent(data.event)
        setShowEventDetails(true)
      }
    } catch (err) {
      setError('Failed to load event details')
    }
  }

  const handleEventAction = async (eventId: string, action: string, reason?: string) => {
    setUpdating(eventId)
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: eventId, 
          [action.toLowerCase()]: true,
          reason 
        })
      })
      const data = await response.json()
      if (data.event) {
        setEvents(events.map(e => e.id === eventId ? { ...e, ...data.event } : e))
      }
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} event`)
    } finally {
      setUpdating(null)
    }
  }

  const handleBulkAction = async (action: string, reason?: string) => {
    if (selectedEvents.length === 0) return
    
    setUpdating('bulk')
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventIds: selectedEvents, 
          action,
          reason 
        })
      })
      const data = await response.json()
      if (data.events) {
        setEvents(events.map(e => {
          const updated = data.events.find((ue: any) => ue.id === e.id)
          return updated ? { ...e, ...updated } : e
        }))
        setSelectedEvents([])
        setShowBulkActions(false)
      }
    } catch (err) {
      setError(`Failed to perform bulk ${action.toLowerCase()}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteEvent = async (eventId: string, reason?: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }
    setUpdating(eventId)
    try {
      const response = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, reason })
      })
      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId))
      } else {
        setError('Failed to delete event')
      }
    } catch (err) {
      setError('Failed to delete event')
    } finally {
      setUpdating(null)
    }
  }

  const toggleEventSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-600/20 text-green-400'
      case 'PENDING_APPROVAL': return 'bg-yellow-600/20 text-yellow-400'
      case 'REJECTED': return 'bg-red-600/20 text-red-400'
      case 'CANCELLED': return 'bg-gray-600/20 text-gray-400'
      case 'COMPLETED': return 'bg-blue-600/20 text-blue-400'
      default: return 'bg-gray-600/20 text-gray-400'
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/admin" 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20"
          >
            <Home className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Event Management</h1>
        </div>
        <button 
          onClick={fetchEvents}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button 
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
          >
            Bulk Actions ({selectedEvents.length})
          </button>
          <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && selectedEvents.length > 0 && (
          <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/20">
            <h3 className="text-white font-semibold mb-3">Bulk Actions for {selectedEvents.length} events:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkAction('APPROVE')}
                disabled={updating === 'bulk'}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-all disabled:opacity-50"
              >
                Approve All
              </button>
              <button
                onClick={() => handleBulkAction('REJECT')}
                disabled={updating === 'bulk'}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-all disabled:opacity-50"
              >
                Reject All
              </button>
              <button
                onClick={() => handleBulkAction('FEATURE')}
                disabled={updating === 'bulk'}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-all disabled:opacity-50"
              >
                Feature All
              </button>
              <button
                onClick={() => handleBulkAction('UNFEATURE')}
                disabled={updating === 'bulk'}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-all disabled:opacity-50"
              >
                Unfeature All
              </button>
              <button
                onClick={() => setSelectedEvents([])}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm transition-all"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-white/60">No events found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/60 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    <input
                      type="checkbox"
                      checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents(filteredEvents.map(e => e.id))
                        } else {
                          setSelectedEvents([])
                        }
                      }}
                      className="rounded border-white/20"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Event</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Organizer</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">RSVPs</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Featured</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-white/10 hover:bg-black/20">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => toggleEventSelection(event.id)}
                        className="rounded border-white/20"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{event.name}</div>
                        <div className="text-white/60 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        <div className="text-white/60 text-sm">${event.price}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/60" />
                        <span className="text-white">{event.organizer?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <CalendarIcon className="w-3 h-3" />
                        {event.date ? new Date(event.date).toLocaleDateString() : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white/60 text-sm">
                        <Users className="w-3 h-3" />
                        {event._count?.rsvps || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {event.isFeatured ? (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchEventDetails(event.id)}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Status Actions */}
                        {event.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              onClick={() => handleEventAction(event.id, 'APPROVE')}
                              disabled={updating === event.id}
                              className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-all"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEventAction(event.id, 'REJECT')}
                              disabled={updating === event.id}
                              className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Feature/Unfeature */}
                        <button
                          onClick={() => handleEventAction(event.id, event.isFeatured ? 'UNFEATURE' : 'FEATURE')}
                          disabled={updating === event.id}
                          className={`p-2 rounded transition-all ${
                            event.isFeatured 
                              ? 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30' 
                              : 'bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30'
                          }`}
                          title={event.isFeatured ? 'Unfeature' : 'Feature'}
                        >
                          <Star className={`w-4 h-4 ${event.isFeatured ? '' : 'fill-current'}`} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={updating === event.id}
                          className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
              <button
                onClick={() => setShowEventDetails(false)}
                className="p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-6">
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/60 text-sm">Name</label>
                      <p className="text-white font-medium">{selectedEvent.name}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Description</label>
                      <p className="text-white text-sm">{selectedEvent.description}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Location</label>
                      <p className="text-white font-medium">{selectedEvent.location}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Date & Time</label>
                      <p className="text-white font-medium">{new Date(selectedEvent.date).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Price</label>
                      <p className="text-white font-medium">${selectedEvent.price}</p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">Capacity</label>
                      <p className="text-white font-medium">{selectedEvent.capacity}</p>
                    </div>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Organizer</h3>
                  <div className="space-y-2">
                    <p className="text-white"><span className="text-white/60">Name:</span> {selectedEvent.organizer?.name}</p>
                    <p className="text-white"><span className="text-white/60">Email:</span> {selectedEvent.organizer?.email}</p>
                  </div>
                </div>
              </div>

              {/* RSVPs and History */}
              <div className="space-y-6">
                {/* RSVPs */}
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">RSVPs ({selectedEvent.rsvps?.length || 0})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedEvent.rsvps && selectedEvent.rsvps.length > 0 ? (
                      selectedEvent.rsvps.map((rsvp: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                          <span className="text-white text-sm">{rsvp.user.name}</span>
                          <span className="text-white/60 text-xs">{rsvp.status}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">No RSVPs yet</p>
                    )}
                  </div>
                </div>

                {/* Moderation History */}
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Moderation History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedEvent.moderationHistory && selectedEvent.moderationHistory.length > 0 ? (
                      selectedEvent.moderationHistory.map((history: any, index: number) => (
                        <div key={index} className="p-2 bg-black/20 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{history.action}</span>
                            <span className="text-white/60 text-xs">
                              {history.createdAt ? new Date(history.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          {history.reason && (
                            <p className="text-white/60 text-xs mt-1">{history.reason}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">No moderation history</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 