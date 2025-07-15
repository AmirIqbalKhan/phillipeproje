'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Calendar, MapPin, Users, Clock, Heart, Share2, User, Phone, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRef } from 'react'

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null)

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/events/${params.id}`)
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        setEvent(data.event)
      } catch (err: any) {
        setError(err.message || 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl"><Navigation />Loading event...<Footer /></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl"><Navigation />{error}<Footer /></div>
  if (!event) return null

  // For compatibility with old UI, map fields
  const images = event.images || []
  const agenda = event.agenda || []
  const speakers = event.speakers || []
  const tags = event.tags || []
  const organizer = {
    name: event.organizer?.name || '',
    email: event.organizerEmail || event.organizer?.email || '',
    phone: event.organizerPhone || '',
    description: event.organizerDescription || '',
    avatar: undefined // You can add avatar support if available
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    }
  }

  const handleRSVP = (status: 'going' | 'maybe' | 'not-going') => {
    setRsvpStatus(status)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 sm:mb-8">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200">
            <img
              src={images[currentImageIndex]}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {event.isFeatured && (
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                  Featured Event
                </span>
              </div>
            )}
            {/* Image Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="mb-6">
          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 capitalize mb-3">
            {event.category}
          </span>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <p className="text-base lg:text-lg text-gray-600 mb-4">{event.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900 text-sm">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString() : "Date not available"}
                  {event.startDate ? ` • ${new Date(event.startDate).toLocaleTimeString()}` : ""}
                  {event.endDate ? ` - ${new Date(event.endDate).toLocaleTimeString()}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-900 text-sm">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Capacity</p>
                <p className="font-medium text-gray-900 text-sm">{event.currentAttendees}/{event.capacity} attendees</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-medium text-gray-900 text-sm">
                  {(event.startDate && event.endDate) ? Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60)) + " hours" : "Duration not available"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 mb-6">
            <div className="text-2xl font-bold text-purple-700">
              {event.price > 0 ? `$${event.price}` : 'Free'}
            </div>
            <Link href={`/event/${params.id}/register`}>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all">
                Register Now
              </button>
            </Link>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={tag + index}
                  className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">About This Event</h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              {event.longDescription && event.longDescription.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-2 text-gray-700 text-sm">{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Agenda</h3>
            <div className="space-y-3">
              {agenda.map((item: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="w-16 flex-shrink-0 text-sm font-medium text-gray-900">
                    {item.time}
                  </div>
                  <div className="flex-1 text-gray-700 text-sm">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Speakers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {speakers.map((speaker: any, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0">
                    {speaker.avatar && (
                      <img
                        src={speaker.avatar}
                        alt={speaker.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{speaker.name}</p>
                    <p className="text-xs text-gray-500 truncate">{speaker.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Event Chat Section - only visible in event page */}
        <EventChat eventId={params.id} />
      </main>
      <Footer />
    </div>
  )
}

// EventChat component for event-specific chat
function EventChat({ eventId }: { eventId: string }) {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetch(`/api/chat/messages?eventId=${eventId}`)
      .then(res => res.json())
      .then(data => setMessages(data || []))
      .finally(() => setLoading(false));
  }, [eventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage, eventId })
    })
      .then(res => res.json())
      .then(() => {
        setNewMessage('');
        // Refresh messages
        return fetch(`/api/chat/messages?eventId=${eventId}`)
          .then(res => res.json())
          .then(data => setMessages(data || []));
      })
      .finally(() => setLoading(false));
  }

  if (status === 'loading') return null;
  if (!session) return null;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white/80 rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 backdrop-blur-md">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Event Chat</h2>
        <div className="h-48 sm:h-56 lg:h-64 overflow-y-auto mb-4 bg-gray-100 rounded-xl p-3 sm:p-4 flex flex-col gap-2">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-gray-500">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-3 sm:mb-4 flex flex-col">
                <span className="text-xs sm:text-sm text-purple-700 font-bold drop-shadow-lg">{msg.user?.name || 'User'}</span>
                <span className="text-gray-900 text-sm sm:text-base drop-shadow-lg">{msg.text}</span>
                <span className="text-xs text-gray-400 self-end drop-shadow-lg">{new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-full border px-3 sm:px-4 py-2 text-sm sm:text-base"
            placeholder="Type your message..."
            autoComplete="off"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full px-4 sm:px-6 py-2 font-bold text-sm sm:text-base" disabled={loading || !newMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </section>
  );
} 