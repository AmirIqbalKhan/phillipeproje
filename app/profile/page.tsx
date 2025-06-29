"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMingle } from '@/context/EventMingleContext'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface UserEvent {
  id: string
  name: string
  date: string
  location: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { user, setUser, events } = useEventMingle()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(user.name)
  const [interests, setInterests] = useState(user.interests.join(', '))
  const [userEvents, setUserEvents] = useState<UserEvent[]>([])

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}/events`).then(res => res.json()).then(data => setUserEvents(data.events || []))
    }
  }, [session?.user?.id])

  // Redirect if not authenticated
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting to login...</div>
  }
  // Replace mock user data with session user
  const sessionUser = {
    name: session.user?.name || '',
    email: session.user?.email || '',
    interests: [],
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUser({ ...user, name, interests: interests.split(',').map(s => s.trim()).filter(Boolean) })
    setEdit(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1500&q=80"
          alt="Profile background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Your Profile
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Manage your account and view your event history
          </p>
          
          {/* Profile Content */}
          <div className="w-full max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Profile Details */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Profile Details</h2>
              {edit ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-white drop-shadow-lg">Name</label>
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-white drop-shadow-lg">Interests (comma separated)</label>
                    <input 
                      value={interests} 
                      onChange={e => setInterests(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                    />
                  </div>
                  <button type="submit" className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg">
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <ul className="space-y-4 text-white/80 text-lg">
                    <li><span className="font-bold text-white drop-shadow-lg">Name:</span> {user.name}</li>
                    <li><span className="font-bold text-white drop-shadow-lg">Email:</span> {user.email}</li>
                    <li><span className="font-bold text-white drop-shadow-lg">Interests:</span> {user.interests.join(', ')}</li>
                  </ul>
                  <button onClick={() => setEdit(true)} className="mt-6 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg">
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            
            {/* User Events */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Your Events</h2>
              <ul className="space-y-3 text-white/80 text-lg">
                {userEvents.length === 0 && (
                  <li className="text-center py-8">No events registered yet.</li>
                )}
                {userEvents.map(e => (
                  <li key={e.id} className="flex items-center gap-2">
                    <span className="text-purple-300">•</span>
                    <a href={`/event/${e.id}`} className="underline hover:text-purple-400">{e.name}</a>
                    <span className="ml-2 text-white/60">{e.date ? new Date(e.date).toLocaleDateString() : ''}</span>
                    <span className="ml-2 text-white/60">{e.location || ''}</span>
                  </li>
                ))}
              </ul>
            </div>
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