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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-2 sm:mr-4 text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </a>
              <a href="/" className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">EM</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900 ml-2">EventMingle</span>
              </a>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Images */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 sm:mb-8">
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200">
                <img
                  src={event.images[currentImageIndex]}
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
                {event.images.length > 1 && (
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {event.images.map((_, index) => (
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {event.category}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">{event.description}</p>
                </div>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {event.startDate.toLocaleDateString()} • {event.startDate.toLocaleTimeString()} - {event.endDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Capacity</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{event.currentAttendees}/{event.capacity} attendees</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60))} hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm sm:text-base text-gray-500">Price</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    Register Now
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6 sm:mb-8">
                <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Long Description */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">About This Event</h3>
                <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
                  {event.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 sm:mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Agenda</h3>
                <div className="space-y-3 sm:space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-16 sm:w-20 flex-shrink-0 text-sm sm:text-base font-medium text-gray-900">
                        {item.time}
                      </div>
                      <div className="flex-1 text-sm sm:text-base text-gray-600">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speakers */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Speakers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0">
                        <img
                          src={speaker.avatar}
                          alt={speaker.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{speaker.name}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{speaker.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Registration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Register for Event</h3>
              
              {/* RSVP Status */}
              <div className="mb-4">
                <p className="text-sm sm:text-base text-gray-600 mb-3">Are you attending?</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleRSVP('going')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      rsvpStatus === 'going'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    Going
                  </button>
                  <button
                    onClick={() => handleRSVP('maybe')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      rsvpStatus === 'maybe'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                    }`}
                  >
                    Maybe
                  </button>
                  <button
                    onClick={() => handleRSVP('not-going')}
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                      rsvpStatus === 'not-going'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700'
                    }`}
                  >
                    Not Going
                  </button>
                </div>
              </div>

              {/* Price Info */}
              <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Price</span>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm sm:text-base text-gray-600">Available Spots</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {event.capacity - event.currentAttendees} remaining
                  </span>
                </div>
              </div>

              {/* Register Button */}
              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
              >
                Register Now
              </button>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex-shrink-0">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{event.organizer.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{event.organizer.description}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{event.organizer.email}</span>
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{event.organizer.phone}</span>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Location</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-900">{event.location}</p>
                  <p className="text-sm sm:text-base text-gray-600">{event.address}</p>
                </div>
                <button className="w-full bg-gray-100 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        {showRegister && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Register for Event</h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  {registerMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      registerMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {registerMessage}
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowRegister(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      {registerLoading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 