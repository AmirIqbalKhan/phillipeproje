"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react'

export default function OrganizerAnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<{ totalEvents: number; totalRsvps: number; upcomingEvents: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/organizer/analytics')
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error)
          else setStats(data)
        })
        .catch(() => setError('Failed to load analytics.'))
        .finally(() => setLoading(false))
    }
  }, [status])

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
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1500&q=80"
          alt="Analytics background"
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
            Event Analytics
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Track your event performance and insights
          </p>
          
          {/* Analytics Content */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              {loading ? (
                <div className="text-center py-8 text-white/60 text-sm sm:text-base">Loading analytics...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-400 text-sm sm:text-base">{error}</div>
              ) : stats ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center mb-6 sm:mb-8">
                    <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your Event Statistics</h2>
                    <p className="text-white/70 text-sm sm:text-base">Comprehensive overview of your event performance</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 text-center">
                      <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300 mx-auto mb-3" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Total Events</h3>
                      <p className="text-3xl sm:text-4xl font-bold text-purple-300">{stats.totalEvents}</p>
                      <p className="text-white/60 text-xs sm:text-sm mt-2">Events created</p>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 text-center">
                      <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-300 mx-auto mb-3" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Total RSVPs</h3>
                      <p className="text-3xl sm:text-4xl font-bold text-green-300">{stats.totalRsvps}</p>
                      <p className="text-white/60 text-xs sm:text-sm mt-2">Attendees registered</p>
                    </div>
                    
                    <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 text-center sm:col-span-2 lg:col-span-1">
                      <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300 mx-auto mb-3" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Upcoming Events</h3>
                      <p className="text-3xl sm:text-4xl font-bold text-yellow-300">{stats.upcomingEvents}</p>
                      <p className="text-white/60 text-xs sm:text-sm mt-2">Events scheduled</p>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-white/20 mt-6 sm:mt-8">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Performance Insights</h3>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Average RSVPs per event:</span>
                        <span className="text-purple-300 font-semibold">
                          {stats.totalEvents > 0 ? Math.round(stats.totalRsvps / stats.totalEvents) : 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Event completion rate:</span>
                        <span className="text-green-300 font-semibold">
                          {stats.totalEvents > 0 ? Math.round(((stats.totalEvents - stats.upcomingEvents) / stats.totalEvents) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Upcoming event ratio:</span>
                        <span className="text-yellow-300 font-semibold">
                          {stats.totalEvents > 0 ? Math.round((stats.upcomingEvents / stats.totalEvents) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 