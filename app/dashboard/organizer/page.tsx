"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Users, BarChart3, Home } from 'lucide-react'
import { useState, useEffect } from 'react';

export default function OrganizerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>({ activeEvents: 0, totalRsvps: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    let isMounted = true;
    const fetchStats = () => {
      setLoading(true);
      fetch('/api/organizer/analytics')
        .then(res => res.json())
        .then(data => {
          if (!isMounted) return;
          setStats({
            activeEvents: data.totalEvents ?? 0,
            totalRsvps: data.totalRsvps ?? 0,
            revenue: data.revenue ?? 0,
          });
          setLastUpdated(new Date());
          setLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setLoading(false);
        });
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || !session.user || (session.user.role !== 'ORGANIZER' && session.user.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Organizer dashboard background"
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
            Organizer Dashboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Manage your events, track RSVPs, and analyze performance
          </p>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Quick Actions</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Link 
                  href="/dashboard/organizer/events"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-full mb-4 mx-auto group-hover:bg-purple-600/30 transition-all">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-purple-300 transition-colors">
                    Manage Events
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Create, edit, and manage your events
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/organizer/rsvps"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-full mb-4 mx-auto group-hover:bg-blue-600/30 transition-all">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-blue-300 transition-colors">
                    View RSVPs
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Track attendee responses and manage registrations
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/organizer/analytics"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600/20 rounded-full mb-4 mx-auto group-hover:bg-green-600/30 transition-all">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-green-300 transition-colors">
                    Event Analytics
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Analyze event performance and insights
                  </p>
                </Link>
              </div>
              
              {/* Stats Section */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">Quick Stats (Overview)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stats.activeEvents}</div>
                  <div className="text-white/60 text-sm sm:text-base">Active Events</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stats.totalRsvps}</div>
                  <div className="text-white/60 text-sm sm:text-base">Total RSVPs</div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-2">${stats.revenue?.toLocaleString() ?? '0'}</div>
                  <div className="text-white/60 text-sm sm:text-base">Revenue</div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</span>
                  {loading && <span className="text-white/60 text-xs">Refreshing...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 