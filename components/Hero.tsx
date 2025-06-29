'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Party background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
          Discover Events, Share Your Own
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
          Connect with people who share your interests at events that matter
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md sm:max-w-none px-4">
          <Link 
            href="/discover" 
            className="bg-white text-gray-900 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-center min-h-[48px] flex items-center justify-center"
          >
            Discover Events
          </Link>
          <Link 
            href="/create-event" 
            className="bg-white text-gray-900 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-center min-h-[48px] flex items-center justify-center"
          >
            Create Event
          </Link>
        </div>
      </div>
    </section>
  )
} 