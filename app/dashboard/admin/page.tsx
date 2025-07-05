"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Calendar, Shield, Settings, Home, BarChart3, AlertTriangle, DollarSign } from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
          alt="Admin dashboard background"
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
            Admin Dashboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Platform administration and management tools
          </p>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Administration Tools</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                <Link 
                  href="/dashboard/admin/users"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600/20 rounded-full mb-4 mx-auto group-hover:bg-blue-600/30 transition-all">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-blue-300 transition-colors">
                    Manage Users
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    User management and role assignments
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/admin/events"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-full mb-4 mx-auto group-hover:bg-purple-600/30 transition-all">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-purple-300 transition-colors">
                    Manage Events
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Event moderation and approval
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/admin/financial"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-yellow-600/20 rounded-full mb-4 mx-auto group-hover:bg-yellow-600/30 transition-all">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-yellow-300 transition-colors">
                    Financial
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Transactions, payouts & refunds
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/admin/moderation"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600/20 rounded-full mb-4 mx-auto group-hover:bg-red-600/30 transition-all">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-red-300 transition-colors">
                    Moderation
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Content moderation and safety
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/admin/settings"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-green-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600/20 rounded-full mb-4 mx-auto group-hover:bg-green-600/30 transition-all">
                    <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-green-300 transition-colors">
                    Settings
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Platform configuration
                  </p>
                </Link>
                
                <Link 
                  href="/dashboard/admin/role-requests"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-orange-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-orange-600/20 rounded-full mb-4 mx-auto group-hover:bg-orange-600/30 transition-all">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-orange-300 transition-colors">
                    Role Promotion Requests
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Review and manage user role promotion requests
                  </p>
                </Link>

                <Link 
                  href="/dashboard/admin/roles"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-600/20 rounded-full mb-4 mx-auto group-hover:bg-purple-600/30 transition-all">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-purple-300 transition-colors">
                    Role Permissions
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Configure permissions for each user role
                  </p>
                </Link>

                <Link 
                  href="/dashboard/admin/staff"
                  className="group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 hover:border-teal-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-teal-600/20 rounded-full mb-4 mx-auto group-hover:bg-teal-600/30 transition-all">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-teal-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-teal-300 transition-colors">
                    Manage Staff
                  </h3>
                  <p className="text-white/60 text-sm sm:text-base text-center">
                    Assign and manage employee roles
                  </p>
                </Link>
              </div>
              
              {/* Stats Section */}
              <div className="mt-8 sm:mt-12">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">Platform Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">5,234</div>
                    <div className="text-white/60 text-sm sm:text-base">Total Users</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">1,567</div>
                    <div className="text-white/60 text-sm sm:text-base">Active Events</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">23</div>
                    <div className="text-white/60 text-sm sm:text-base">Pending Reviews</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">99.8%</div>
                    <div className="text-white/60 text-sm sm:text-base">Uptime</div>
                  </div>
                </div>
              </div>
              
              {/* Alerts Section */}
              <div className="mt-8 sm:mt-12">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">Recent Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 sm:p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm sm:text-base">New user registration spike detected</p>
                      <p className="text-white/60 text-xs sm:text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm sm:text-base">Monthly analytics report ready</p>
                      <p className="text-white/60 text-xs sm:text-sm">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 