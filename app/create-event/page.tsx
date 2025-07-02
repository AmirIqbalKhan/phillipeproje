"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMingle } from '@/context/EventMingleContext'
import ClientImage from '@/components/ClientImage'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import PlacesPicker to avoid SSR issues
// const PlacesPicker = dynamic<any>(() => import('@tasiodev/react-places-autocomplete'), { ssr: false })

export default function CreateEventPage() {
  const { user } = useEventMingle()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [capacity, setCapacity] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [longDescription, setLongDescription] = useState('')
  const [address, setAddress] = useState('')
  const [tags, setTags] = useState('')
  const [agenda, setAgenda] = useState([{ time: '', title: '' }])
  const [speakers, setSpeakers] = useState([{ name: '', title: '', avatar: '' }])
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [organizerPhone, setOrganizerPhone] = useState('')
  const [organizerDescription, setOrganizerDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Copy categories from CategoryFilter
  const categories = [
    { id: 'concert', name: 'Concerts' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'conference', name: 'Conferences' },
    { id: 'meetup', name: 'Meetups' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'art', name: 'Art & Culture' },
    { id: 'technology', name: 'Technology' },
    { id: 'sports', name: 'Sports' },
    { id: 'photography', name: 'Photography' },
    { id: 'networking', name: 'Networking' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    const errors: any = {}
    if (!name) errors.name = 'Event name is required.'
    if (!date) errors.date = 'Date is required.'
    if (!time) errors.time = 'Time is required.'
    if (!location) errors.location = 'Location is required.'
    if (!address) errors.address = 'Address is required.'
    if (!description) errors.description = 'Description is required.'
    if (!longDescription) errors.longDescription = 'Long description is required.'
    if (!price) errors.price = 'Price is required.'
    if (!capacity) errors.capacity = 'Capacity is required.'
    if (!category) errors.category = 'Category is required.'
    if (!tags) errors.tags = 'At least one tag is required.'
    if (!organizerEmail) errors.organizerEmail = 'Organizer email is required.'
    if (!organizerPhone) errors.organizerPhone = 'Organizer phone is required.'
    if (!organizerDescription) errors.organizerDescription = 'Organizer description is required.'
    if (agenda.some(a => !a.time || !a.title)) errors.agenda = 'All agenda items must have time and title.'
    if (speakers.some(s => !s.name || !s.title || !s.avatar)) errors.speakers = 'All speakers must have name, title, and avatar.'
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          date: new Date(`${date}T${time}`),
          time,
          location,
          address,
          description,
          longDescription,
          price: parseFloat(price),
          capacity: parseInt(capacity, 10),
          category,
          tags: tags.split(',').map(t => t.trim()),
          agenda,
          speakers,
          isFeatured,
          organizerEmail,
          organizerPhone,
          organizerDescription
        }),
      })
      if (!res.ok) throw new Error('Failed to create event')
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (err) {
      setError('Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <ClientImage
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Create event background"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackSrc="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1500&q=80"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Create an Event
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Host your own event and bring people together
          </p>
          
          {/* Event Creation Form */}
          <div className="w-full max-w-lg sm:max-w-2xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20 space-y-4 sm:space-y-6">
              {error && <div className="text-red-400 font-bold mb-4 text-center drop-shadow-lg text-sm sm:text-base">{error}</div>}
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Event Name</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                  placeholder="Enter event name" 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Time</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={e => setTime(e.target.value)} 
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Location</label>
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="Enter location"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base resize-none" 
                  rows={4} 
                  placeholder="Describe your event"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Long Description</label>
                <textarea
                  value={longDescription}
                  onChange={e => setLongDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  rows={4}
                  placeholder="Enter a detailed description of your event"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Address</label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="Enter address"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Tags (comma-separated)</label>
                <input
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="e.g. networking, tech, innovation"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                    placeholder="Enter capacity"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 sm:mb-3 font-semibold text-white text-sm sm:text-lg drop-shadow-lg">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-white text-sm sm:text-lg">Agenda</label>
                {agenda.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.time}
                      onChange={e => setAgenda(agenda.map((a, i) => i === idx ? { ...a, time: e.target.value } : a))}
                      className="w-1/3 px-2 py-1 rounded bg-black/60 border border-white/20 text-white text-sm"
                      placeholder="Time"
                      required
                    />
                    <input
                      type="text"
                      value={item.title}
                      onChange={e => setAgenda(agenda.map((a, i) => i === idx ? { ...a, title: e.target.value } : a))}
                      className="w-2/3 px-2 py-1 rounded bg-black/60 border border-white/20 text-white text-sm"
                      placeholder="Agenda item"
                      required
                    />
                    <button type="button" onClick={() => setAgenda(agenda.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setAgenda([...agenda, { time: '', title: '' }])} className="text-purple-400">Add Agenda Item</button>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-white text-sm sm:text-lg">Speakers</label>
                {speakers.map((sp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={sp.name}
                      onChange={e => setSpeakers(speakers.map((s, i) => i === idx ? { ...s, name: e.target.value } : s))}
                      className="w-1/3 px-2 py-1 rounded bg-black/60 border border-white/20 text-white text-sm"
                      placeholder="Name"
                      required
                    />
                    <input
                      type="text"
                      value={sp.title}
                      onChange={e => setSpeakers(speakers.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))}
                      className="w-1/3 px-2 py-1 rounded bg-black/60 border border-white/20 text-white text-sm"
                      placeholder="Title"
                      required
                    />
                    <input
                      type="text"
                      value={sp.avatar}
                      onChange={e => setSpeakers(speakers.map((s, i) => i === idx ? { ...s, avatar: e.target.value } : s))}
                      className="w-1/3 px-2 py-1 rounded bg-black/60 border border-white/20 text-white text-sm"
                      placeholder="Avatar URL"
                      required
                    />
                    <button type="button" onClick={() => setSpeakers(speakers.filter((_, i) => i !== idx))} className="text-red-400">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={() => setSpeakers([...speakers, { name: '', title: '', avatar: '' }])} className="text-purple-400">Add Speaker</button>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-white text-sm sm:text-lg">Organizer Email</label>
                <input
                  value={organizerEmail}
                  onChange={e => setOrganizerEmail(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="Enter organizer email"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-white text-sm sm:text-lg">Organizer Phone</label>
                <input
                  value={organizerPhone}
                  onChange={e => setOrganizerPhone(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  placeholder="Enter organizer phone"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-white text-sm sm:text-lg">Organizer Description</label>
                <textarea
                  value={organizerDescription}
                  onChange={e => setOrganizerDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  rows={2}
                  placeholder="Describe the organizer"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-purple-600"
                />
                <label className="text-white text-sm">Featured Event</label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-60 text-base sm:text-lg mt-4"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              {success && <div className="text-green-400 font-bold mt-4 text-center">Event created! Redirecting...</div>}
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