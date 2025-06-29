'use client'

import { useState } from 'react'
import EventCard from './EventCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Mock data for featured events
const featuredEvents = [
  {
    id: '1',
    title: 'Summer Music Festival 2024',
    description: 'Join us for an unforgettable weekend of live music, food, and fun under the stars.',
    location: 'Central Park, New York',
    startDate: new Date('2024-07-15T18:00:00'),
    endDate: new Date('2024-07-15T23:00:00'),
    price: 75,
    capacity: 5000,
    category: 'concert',
    organizer: {
      name: 'Music Events NYC',
      avatar: '/images/organizer1.jpg'
    },
    images: ['/images/event1.jpg'],
    tags: ['music', 'festival', 'summer', 'live'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Tech Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and tech professionals in a relaxed setting.',
    location: 'Innovation Hub, San Francisco',
    startDate: new Date('2024-06-20T19:00:00'),
    endDate: new Date('2024-06-20T22:00:00'),
    price: 25,
    capacity: 200,
    category: 'networking',
    organizer: {
      name: 'Tech Connect',
      avatar: '/images/organizer2.jpg'
    },
    images: ['/images/event2.jpg'],
    tags: ['networking', 'startup', 'tech', 'entrepreneurs'],
    isFeatured: true
  },
  {
    id: '3',
    title: 'Art & Wine Tasting Evening',
    description: 'Experience local artists\' work while enjoying fine wines and gourmet appetizers.',
    location: 'Gallery District, Los Angeles',
    startDate: new Date('2024-06-25T18:30:00'),
    endDate: new Date('2024-06-25T21:30:00'),
    price: 45,
    capacity: 150,
    category: 'art',
    organizer: {
      name: 'Art Collective LA',
      avatar: '/images/organizer3.jpg'
    },
    images: ['/images/event3.jpg'],
    tags: ['art', 'wine', 'culture', 'gallery'],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Yoga & Wellness Workshop',
    description: 'A comprehensive workshop combining yoga, meditation, and wellness practices.',
    location: 'Wellness Center, Austin',
    startDate: new Date('2024-06-22T09:00:00'),
    endDate: new Date('2024-06-22T12:00:00'),
    price: 35,
    capacity: 80,
    category: 'workshop',
    organizer: {
      name: 'Mindful Living',
      avatar: '/images/organizer4.jpg'
    },
    images: ['/images/event4.jpg'],
    tags: ['yoga', 'wellness', 'meditation', 'health'],
    isFeatured: true
  },
  {
    id: '5',
    title: 'Food Truck Festival',
    description: 'Sample the best local food trucks with live entertainment and family activities.',
    location: 'Downtown Plaza, Chicago',
    startDate: new Date('2024-07-08T16:00:00'),
    endDate: new Date('2024-07-08T22:00:00'),
    price: 0,
    capacity: 2000,
    category: 'food',
    organizer: {
      name: 'Chicago Food Events',
      avatar: '/images/organizer5.jpg'
    },
    images: ['/images/event5.jpg'],
    tags: ['food', 'festival', 'family', 'free'],
    isFeatured: true
  },
  {
    id: '6',
    title: 'Photography Workshop',
    description: 'Learn advanced photography techniques from professional photographers.',
    location: 'Nature Reserve, Portland',
    startDate: new Date('2024-06-28T08:00:00'),
    endDate: new Date('2024-06-28T17:00:00'),
    price: 120,
    capacity: 30,
    category: 'photography',
    organizer: {
      name: 'Photo Masters',
      avatar: '/images/organizer6.jpg'
    },
    images: ['/images/event6.jpg'],
    tags: ['photography', 'workshop', 'nature', 'learning'],
    isFeatured: true
  }
]

export default function FeaturedEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const eventsPerPage = 3

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + eventsPerPage >= featuredEvents.length ? 0 : prev + eventsPerPage
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - eventsPerPage < 0 ? Math.max(0, featuredEvents.length - eventsPerPage) : prev - eventsPerPage
    )
  }

  const currentEvents = featuredEvents.slice(currentIndex, currentIndex + eventsPerPage)

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Remove Background Image */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Featured Events
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Discover the most exciting and popular events happening near you. From concerts to workshops, 
            there's something for everyone.
          </p>
        </div>

        {/* Events Grid */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Events Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentEvents.map((event) => (
              <div key={event.id} className="transform transition-all duration-500 hover:scale-105">
                <EventCard
                  event={event}
                  onSave={(id) => console.log('Saved event:', id)}
                  onShare={(id) => console.log('Shared event:', id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: Math.ceil(featuredEvents.length / eventsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * eventsPerPage)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === Math.floor(currentIndex / eventsPerPage)
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="/discover"
            className="inline-flex items-center justify-center bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-full shadow hover:bg-gray-100 transition-all border border-white/30"
          >
            View All Events
            <ChevronRight className="ml-2 w-5 h-5 text-gray-900 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
} 