"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Users, CheckCircle, Clock, XCircle } from 'lucide-react'

interface RSVP {
  id: string
  status: string
  event: { name: string }
  user: { name: string; email: string }
}

export default function OrganizerRSVPsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/organizer/rsvps')
        .then(res => res.json())
        .then(data => setRsvps(data.rsvps || []))
        .finally(() => setLoading(false))
    }
  }, [status])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500 text-black'
      case 'PENDING':
        return 'bg-yellow-500 text-black'
      case 'CANCELLED':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="RSVPs background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          {/* Home Button */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-30">
            <Link 
              href="/" 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Event RSVPs
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Manage attendee registrations and responses
          </p>
          
          {/* RSVPs Content */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <div className="text-center mb-6 sm:mb-8">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">RSVP Management</h2>
                <p className="text-white/70 text-sm sm:text-base">Track all attendee responses to your events</p>
              </div>
              
              {loading ? (
                <div className="text-center py-8 text-white/60 text-sm sm:text-base">Loading RSVPs...</div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {rsvps.length === 0 && (
                    <div className="text-center py-8 text-white/60 text-sm sm:text-base">No RSVPs yet. Attendees will appear here once they register for your events.</div>
                  )}
                  {rsvps.map(rsvp => (
                    <div key={rsvp.id} className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(rsvp.status)}
                            <h3 className="text-white font-semibold text-sm sm:text-base">{rsvp.event.name}</h3>
                          </div>
                          <div className="text-white/80 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                              <span className="font-medium">{rsvp.user.name}</span>
                              <span className="text-white/60">{rsvp.user.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm ${getStatusColor(rsvp.status)}`}>
                            {rsvp.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Summary Stats */}
              {rsvps.length > 0 && (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
                    <div className="text-center">
                      <span className="text-green-300 font-bold">
                        {rsvps.filter(r => r.status === 'CONFIRMED').length}
                      </span>
                      <div className="text-white/60 text-xs sm:text-sm">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <span className="text-yellow-300 font-bold">
                        {rsvps.filter(r => r.status === 'PENDING').length}
                      </span>
                      <div className="text-white/60 text-xs sm:text-sm">Pending</div>
                    </div>
                    <div className="text-center">
                      <span className="text-red-300 font-bold">
                        {rsvps.filter(r => r.status === 'CANCELLED').length}
                      </span>
                      <div className="text-white/60 text-xs sm:text-sm">Cancelled</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 