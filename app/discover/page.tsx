'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import EventCard from '@/components/EventCard'
import CategoryFilter from '@/components/CategoryFilter'
import Footer from '@/components/Footer'
import { Search, Filter } from 'lucide-react'

// Mock data for events
const events = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description: 'A three-day celebration of music featuring top artists from around the world.',
    location: 'Central Park, New York',
    startDate: new Date('2024-07-15T18:00:00'),
    endDate: new Date('2024-07-17T23:00:00'),
    price: 150,
    capacity: 5000,
    category: 'music',
    organizer: {
      name: 'Music Events Co.',
      avatar: '/images/organizer1.jpg'
    },
    images: ['/images/event1.jpg'],
    tags: ['music', 'festival', 'summer', 'live'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Tech Startup Meetup',
    description: 'Network with fellow entrepreneurs and learn from successful startup founders.',
    location: 'Innovation Hub, San Francisco',
    startDate: new Date('2024-06-20T19:00:00'),
    endDate: new Date('2024-06-20T22:00:00'),
    price: 25,
    capacity: 200,
    category: 'technology',
    organizer: {
      name: 'Tech Community',
      avatar: '/images/organizer2.jpg'
    },
    images: ['/images/event2.jpg'],
    tags: ['technology', 'startup', 'networking', 'business'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Yoga in the Park',
    description: 'Join us for a relaxing morning yoga session in the beautiful park setting.',
    location: 'Riverside Park, Los Angeles',
    startDate: new Date('2024-06-22T08:00:00'),
    endDate: new Date('2024-06-22T10:00:00'),
    price: 15,
    capacity: 100,
    category: 'wellness',
    organizer: {
      name: 'Wellness Collective',
      avatar: '/images/organizer3.jpg'
    },
    images: ['/images/event3.jpg'],
    tags: ['yoga', 'wellness', 'outdoor', 'morning'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Art Gallery Opening',
    description: 'Experience the latest contemporary art exhibition with live performances.',
    location: 'Modern Art Museum, Chicago',
    startDate: new Date('2024-06-25T20:00:00'),
    endDate: new Date('2024-06-25T23:00:00'),
    price: 35,
    capacity: 300,
    category: 'arts',
    organizer: {
      name: 'Art Society',
      avatar: '/images/organizer4.jpg'
    },
    images: ['/images/event4.jpg'],
    tags: ['art', 'gallery', 'exhibition', 'culture'],
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
    isFeatured: false
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
    isFeatured: false
  }
]

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Discover Amazing
            <span className="block text-purple-300">
              Events
            </span>
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Find events that match your interests and connect with people who share your passions.
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
              <input
                type="text"
                placeholder="Search events, locations, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/70 text-lg"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black/40 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full hover:bg-black/60 transition-all flex items-center shadow-lg"
          >
            <Filter className="w-5 h-5 mr-2" />
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
        {/* Filters Section */}
        {showFilters && (
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </section>
        )}
        
        {/* Events Grid */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {filteredEvents.length} Events Found
                </h2>
                <p className="text-white/70 drop-shadow-lg">
                  {selectedCategory && `Showing ${selectedCategory} events`}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <select className="bg-black/60 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Sort by: Date</option>
                  <option>Sort by: Price</option>
                  <option>Sort by: Popularity</option>
                </select>
              </div>
            </div>
            
            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <Search className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No events found</h3>
                <p className="text-white/70 mb-8 drop-shadow-lg">
                  Try adjusting your search criteria or browse all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                  }}
                  className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {/* Load More Button */}
            {filteredEvents.length > 0 && (
              <div className="text-center mt-16">
                <button className="bg-black/40 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-black/60 transition-all text-lg shadow-lg">
                  Load More Events
                </button>
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