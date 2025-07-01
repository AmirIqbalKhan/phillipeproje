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
  const [edit, setEdit] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [interests, setInterests] = useState("")
  const [avatar, setAvatar] = useState("")
  const [userEvents, setUserEvents] = useState<UserEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        setLoading(true)
        setError(null)
        try {
          const res = await fetch(`/api/user/${session.user.id}`)
          const data = await res.json()
          setProfile(data.user)
          setName(data.user.name || "")
          setInterests((data.user.interests || []).join(", "))
          setAvatar(data.user.avatar || "")
        } catch (err: any) {
          setError("Failed to load profile")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchProfile()
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}/events`).then(res => res.json()).then(data => setUserEvents(data.events || []))
    }
  }, [session?.user?.id])

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting to login...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>
  }
  if (!profile) return null

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          name,
          interests: interests.split(',').map(s => s.trim()).filter(Boolean),
          avatar,
        }),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      const data = await res.json()
      setProfile(data.user)
      setEdit(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Your Profile
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Manage your account and view your event history
          </p>
          
          {/* Profile Content */}
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 px-4">
            {/* Profile Details */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">Profile Details</h2>
              {edit ? (
                <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Name</label>
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Interests (comma separated)</label>
                    <input 
                      value={interests} 
                      onChange={e => setInterests(e.target.value)} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-white drop-shadow-lg text-sm sm:text-base">Avatar URL</label>
                    <input 
                      value={avatar} 
                      onChange={e => setAvatar(e.target.value)} 
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base" 
                    />
                  </div>
                  <button type="submit" className="bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-sm sm:text-base">
                    Save Changes
                  </button>
                </form>
              ) : (
                <>
                  <ul className="space-y-3 sm:space-y-4 text-white/80 text-sm sm:text-base lg:text-lg">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-white drop-shadow-lg">Name:</span> 
                      <span className="truncate">{profile.name}</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-bold text-white drop-shadow-lg">Email:</span> 
                      <span className="truncate">{profile.email}</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                      <span className="font-bold text-white drop-shadow-lg">Interests:</span> 
                      <span className="flex-1">{(profile.interests || []).join(', ')}</span>
                    </li>
                    {profile.avatar && (
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-bold text-white drop-shadow-lg">Avatar:</span>
                        <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-white" />
                      </li>
                    )}
                  </ul>
                  <button onClick={() => setEdit(true)} className="mt-4 sm:mt-6 bg-white text-black font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-sm sm:text-base">
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            
            {/* User Events */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">Your Events</h2>
              <ul className="space-y-2 sm:space-y-3 text-white/80 text-sm sm:text-base lg:text-lg">
                {userEvents.length === 0 && (
                  <li className="text-center py-6 sm:py-8">No events registered yet.</li>
                )}
                {userEvents.map(e => (
                  <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-300">•</span>
                      <a href={`/event/${e.id}`} className="underline hover:text-purple-400 truncate">{e.name}</a>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                      {e.date && (
                        <span>{new Date(e.date).toLocaleDateString()}</span>
                      )}
                      {e.location && (
                        <span className="truncate">{e.location}</span>
                      )}
                    </div>
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