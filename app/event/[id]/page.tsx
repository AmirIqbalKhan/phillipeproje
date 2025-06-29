'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Heart, Share2, User, Phone, Mail, ArrowLeft } from 'lucide-react'

// Mock data for demonstration
const mockEvent = {
  id: '1',
  title: 'Tech Startup Meetup 2024',
  description: 'Join fellow entrepreneurs and tech enthusiasts for an evening of networking, insights, and collaboration. This event brings together the brightest minds in the startup ecosystem for an unforgettable experience.',
  longDescription: `Join us for an evening of innovation, networking, and inspiration at the Tech Startup Meetup 2024!

This exclusive event brings together entrepreneurs, investors, developers, and industry experts for an evening of meaningful connections and insights.

What to Expect:
• Keynote speeches from successful startup founders
• Panel discussions on current tech trends
• Networking sessions with industry leaders
• Pitch competition with real investors
• Interactive workshops and demos
• Complimentary refreshments and networking dinner

Whether you're a seasoned entrepreneur or just starting your journey, this event offers valuable opportunities to learn, connect, and grow your network.

Don't miss out on this chance to be part of the most exciting tech community event of the year!`,
  location: 'Downtown Conference Center',
  address: '123 Main Street, Downtown, City, State 12345',
  startDate: new Date('2024-02-15T18:00:00'),
  endDate: new Date('2024-02-15T21:00:00'),
  price: 25,
  capacity: 150,
  currentAttendees: 89,
  category: 'meetup',
  organizer: {
    name: 'Tech Community Hub',
    avatar: '/images/organizer1.jpg',
    email: 'contact@techcommunityhub.com',
    phone: '+1 (555) 123-4567',
    description: 'Leading the tech community with innovative events and networking opportunities.'
  },
  images: ['/images/event1.jpg', '/images/event1-2.jpg', '/images/event1-3.jpg'],
  tags: ['startup', 'networking', 'tech', 'entrepreneurship', 'innovation'],
  isFeatured: true,
  agenda: [
    { time: '6:00 PM', title: 'Registration & Welcome Drinks' },
    { time: '6:30 PM', title: 'Opening Keynote' },
    { time: '7:00 PM', title: 'Panel Discussion: Future of Tech' },
    { time: '7:45 PM', title: 'Networking Break' },
    { time: '8:15 PM', title: 'Startup Pitch Competition' },
    { time: '9:00 PM', title: 'Closing Remarks & Networking' }
  ],
  speakers: [
    { name: 'Sarah Johnson', title: 'CEO, TechStart Inc.', avatar: '/images/speaker1.jpg' },
    { name: 'Michael Chen', title: 'Founder, Innovation Labs', avatar: '/images/speaker2.jpg' },
    { name: 'Emily Rodriguez', title: 'VP Engineering, ScaleUp Co.', avatar: '/images/speaker3.jpg' }
  ]
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)

  const event = mockEvent // In real app, fetch by params.id

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  const handleShare = () => {
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

  const handleRSVP = (status: 'going' | 'maybe' | 'not-going') => {
    setRsvpStatus(status)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/discover" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Events
              </a>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EM</span>
              </div>
              <span className="text-xl font-bold text-gray-900 ml-2">EventMingle</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={event.images[currentImageIndex]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Featured Event
                    </span>
                  </div>
                )}
                {/* Image Navigation */}
                {event.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {event.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {event.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {event.startDate.toLocaleDateString()} • {event.startDate.toLocaleTimeString()} - {event.endDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900">{event.currentAttendees}/{event.capacity} attendees</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">3 hours</p>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">{event.longDescription}</p>
                </div>
              </div>

              {/* Agenda */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Agenda</h3>
                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 text-sm font-medium text-gray-600">{item.time}</div>
                      <div className="flex-1 text-gray-900">{item.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Featured Speakers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium text-gray-900">{speaker.name}</p>
                        <p className="text-sm text-gray-600">{speaker.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* RSVP Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {event.price === 0 ? 'Free' : `$${event.price}`}
                </div>
                <p className="text-gray-600">per person</p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleRSVP('going')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    rsvpStatus === 'going'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  I'm Going
                </button>
                <button
                  onClick={() => handleRSVP('maybe')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    rsvpStatus === 'maybe'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  Maybe
                </button>
                <button
                  onClick={() => handleRSVP('not-going')}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    rsvpStatus === 'not-going'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Not Going
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>{event.currentAttendees} people are attending</p>
                <p>{event.capacity - event.currentAttendees} spots left</p>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{event.organizer.name}</p>
                  <p className="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{event.organizer.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${event.organizer.email}`} className="hover:text-blue-600">
                    {event.organizer.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${event.organizer.phone}`} className="hover:text-blue-600">
                    {event.organizer.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{event.location}</p>
                <p className="text-sm text-gray-600">{event.address}</p>
                <button className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Button and Modal */}
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition-transform" onClick={() => setShowRegister(true)}>
            Register for this Event
          </button>
        </div>
        {showRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowRegister(false)}>&times;</button>
              <h2 className="text-2xl font-bold mb-4">Register for Event</h2>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRegisterLoading(true);
                  setRegisterMessage(null);
                  try {
                    const res = await fetch(`/api/events/${event.id}/register`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: registerName, email: registerEmail }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setRegisterMessage(data.message || "Registration successful!");
                      setTimeout(() => {
                        setShowRegister(false);
                        setRegisterName("");
                        setRegisterEmail("");
                        setRegisterMessage(null);
                      }, 1500);
                    } else {
                      setRegisterMessage(data.error || data.message || "Registration failed.");
                    }
                  } catch (err) {
                    setRegisterMessage("Registration failed. Please try again.");
                  } finally {
                    setRegisterLoading(false);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  className="rounded-lg border px-4 py-2"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="rounded-lg border px-4 py-2"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60"
                  disabled={registerLoading}
                >
                  {registerLoading ? "Registering..." : "Submit"}
                </button>
                {registerMessage && (
                  <div className="text-center text-sm mt-2 text-pink-600 font-semibold">{registerMessage}</div>
                )}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 