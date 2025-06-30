'use client'

import { useState, useEffect } from 'react'
import EventCard from './EventCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [eventsPerPage, setEventsPerPage] = useState(3)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Responsive events per page
  const getEventsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1 // mobile
      if (window.innerWidth < 1024) return 2 // tablet
      return 3 // desktop
    }
    return 3 // default
  }
  
  useEffect(() => {
    const handleResize = () => {
      setEventsPerPage(getEventsPerPage())
    }
    
    // Set initial value on client side
    setEventsPerPage(getEventsPerPage())
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load events')
        setLoading(false)
      })
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + eventsPerPage >= events.length ? 0 : prev + eventsPerPage
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - eventsPerPage < 0 ? Math.max(0, events.length - eventsPerPage) : prev - eventsPerPage
    )
  }

  const currentEvents = events.slice(currentIndex, currentIndex + eventsPerPage)

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Remove Background Image */}
      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
            Featured Events
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
            Discover the most exciting and popular events happening near you. From concerts to workshops, 
            there's something for everyone.
          </p>
        </div>

        {loading && <div className="text-white/60 text-center">Loading events...</div>}
        {error && <div className="text-red-400 text-center">{error}</div>}
        {!loading && !error && (
          <div className="relative">
            {/* Navigation Buttons - Hidden on mobile, shown on larger screens */}
            <button
              onClick={prevSlide}
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            
            <button
              onClick={nextSlide}
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Events Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
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

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * eventsPerPage)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === Math.floor(currentIndex / eventsPerPage)
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 