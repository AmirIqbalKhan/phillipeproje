'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import EventCard from '@/components/EventCard'
import CategoryFilter from '@/components/CategoryFilter'
import Footer from '@/components/Footer'
import { Search, Filter, X } from 'lucide-react'

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEvents(
          (data.events || [])
            .map((event: any) => ({
              ...event,
              startDate: new Date(event.startDate),
              endDate: new Date(event.endDate),
            }))
            .filter((event: any) =>
              event.startDate instanceof Date &&
              !isNaN(event.startDate) &&
              event.endDate instanceof Date &&
              !isNaN(event.endDate)
            )
        )
      } catch (err) {
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesCategory = !selectedCategory || event.category === selectedCategory
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Discover background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Discover Amazing
            <span className="block text-purple-300">
              Events
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Find events that match your interests and connect with people who share your passions.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-lg sm:max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search events, locations, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/70 text-base sm:text-lg"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black/40 backdrop-blur-sm border border-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-black/60 transition-all flex items-center shadow-lg text-sm sm:text-base"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </section>
      
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {loading && <div className="text-white text-center py-8">Loading events...</div>}
        {error && <div className="text-red-500 text-center py-8">{error}</div>}
        {/* Filters Section */}
        {showFilters && (
          <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"
              alt="Filters background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark blur overlay for readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            {/* Top and bottom black blends */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Filter Events</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-white/70 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </section>
        )}
        
        {/* Events Grid Section */}
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
            alt="Events background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark blur overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          {/* Top and bottom black blends */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                {filteredEvents.length} Events Found
              </h2>
              {selectedCategory && (
                <p className="text-white/80 text-base sm:text-lg">
                  Showing events in <span className="text-purple-300 font-semibold capitalize">{selectedCategory}</span>
                </p>
              )}
            </div>
            
            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="transform transition-all duration-500 hover:scale-105">
                    <EventCard
                      event={event}
                      onSave={(id) => console.log('Saved event:', id)}
                      onShare={(id) => console.log('Shared event:', id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-white/20">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Events Found</h3>
                  <p className="text-white/70 text-base sm:text-lg mb-6">
                    Try adjusting your search or filters to find more events.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('')
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Footer with top blend */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
          <Footer />
        </div>
      </div>
    </div>
  )
} 