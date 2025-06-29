"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMingle } from '@/context/EventMingleContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const { user, addEvent } = useEventMingle()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !date || !time || !location) {
      setError('Please fill in all required fields.')
      return
    }
    addEvent({
      id: Math.random().toString(36).slice(2),
      name,
      date,
      time,
      location,
      description,
      createdBy: user.id,
    })
    router.push('/calendar')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Create event background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Create an Event
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Host your own event and bring people together
          </p>
          
          {/* Event Creation Form */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20 space-y-6">
              {error && <div className="text-red-400 font-bold mb-4 text-center drop-shadow-lg">{error}</div>}
              
              <div>
                <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Event Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                  placeholder="Enter event name" 
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                  />
                </div>
                <div>
                  <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Time</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Location</label>
                <input 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                  placeholder="Enter location" 
                />
              </div>
              
              <div>
                <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                  rows={4} 
                  placeholder="Describe your event"
                />
              </div>
              
              <button type="submit" className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-lg">
                Create Event
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      
      {/* Footer with top blend */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
        <Footer />
      </div>
    </div>
  )
} 