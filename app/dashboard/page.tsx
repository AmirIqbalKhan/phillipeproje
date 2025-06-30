"use client"

import { useState } from 'react'
import { useEventMingle } from '@/context/EventMingleContext'
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  CreditCard, 
  Star,
  Plus,
  MapPin,
  Clock,
  Tag,
  Shield,
  Zap,
  Globe,
  FileText,
  Bell,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Import Event type from context
interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  createdBy: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting to login...</div>
  }
  // Use session user info
  const user = {
    name: session.user?.name || '',
    email: session.user?.email || '',
    role: session.user?.role || 'user',
  }
  const { events } = useEventMingle()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user role - in real app this would come from user context
  const userRole = user.role || 'user' // 'user', 'organizer', 'admin'
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: Clock },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  // Add role-specific tabs
  if (userRole === 'organizer' || userRole === 'admin') {
    tabs.push(
      { id: 'venues', label: 'Venues', icon: MapPin },
      { id: 'staff', label: 'Staff', icon: Users },
      { id: 'resources', label: 'Resources', icon: Tag },
      { id: 'clients', label: 'Clients', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 }
    )
  }

  if (userRole === 'admin') {
    tabs.push(
      { id: 'moderation', label: 'Moderation', icon: Shield },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'integrations', label: 'Integrations', icon: Zap },
      { id: 'platform', label: 'Platform', icon: Globe },
      { id: 'workflows', label: 'Workflows', icon: FileText }
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole={userRole} user={user} events={events} />
      case 'events':
        return <EventsTab userRole={userRole} events={events} />
      case 'calendar':
        return <CalendarTab events={events} />
      case 'chat':
        return <ChatTab />
      case 'payments':
        return <PaymentsTab />
      case 'profile':
        return <ProfileTab user={user} />
      case 'venues':
        return <VenuesTab />
      case 'staff':
        return <StaffTab />
      case 'resources':
        return <ResourcesTab />
      case 'clients':
        return <ClientsTab />
      case 'analytics':
        return <AnalyticsTab userRole={userRole} />
      case 'moderation':
        return <ModerationTab />
      case 'security':
        return <SecurityTab />
      case 'integrations':
        return <IntegrationsTab />
      case 'platform':
        return <PlatformTab />
      case 'workflows':
        return <WorkflowsTab />
      default:
        return <OverviewTab userRole={userRole} user={user} events={events} />
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
          alt="Dashboard background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-20 pb-16 sm:pb-24">
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
            Dashboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Welcome back, {user.name}! Manage your events and activities.
          </p>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex flex-wrap bg-black/20 border-b border-white/10 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-white bg-purple-600/20 border-b-2 border-purple-500'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
              
              {/* Tab Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Tab Components
function OverviewTab({ userRole, user, events }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Total Events</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{events.length}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {events.filter((e: { date: string }) => new Date(e.date) > new Date()).length}
              </p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Attendees</p>
              <p className="text-xl sm:text-2xl font-bold text-white">1,234</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-white">$12,345</p>
            </div>
            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Recent Events</h3>
          <div className="space-y-3">
            {events.slice(0, 3).map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{event.name}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{event.date}</p>
                </div>
                <span className="text-purple-400 text-xs sm:text-sm">{event.location}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center justify-center p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-sm sm:text-base">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
            <button className="flex items-center justify-center p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg text-white hover:bg-blue-600/30 transition-all text-sm sm:text-base">
              <MessageSquare className="w-4 h-4 mr-2" />
              View Chat
            </button>
            <button className="flex items-center justify-center p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-white hover:bg-green-600/30 transition-all text-sm sm:text-base">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </button>
            <button className="flex items-center justify-center p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-white hover:bg-yellow-600/30 transition-all text-sm sm:text-base">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventsTab({ userRole, events }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Events</h2>
        <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
          <Plus className="w-4 h-4 mr-2 inline" />
          Create New Event
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.map((event: any) => (
          <div key={event.id} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold text-sm sm:text-base">{event.name}</h3>
              <span className="text-xs text-purple-400 bg-purple-400/20 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-white/60 text-xs sm:text-sm mb-3">{event.description}</p>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center text-white/80">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {event.date}
              </div>
              <div className="flex items-center text-white/80">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {event.location}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600/30 transition-all">
                Edit
              </button>
              <button className="flex-1 bg-green-600/20 text-green-400 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-green-600/30 transition-all">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarTab({ events }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Event Calendar</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Calendar view coming soon...</p>
      </div>
    </div>
  )
}

function ChatTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Event Chat</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Chat interface coming soon...</p>
      </div>
    </div>
  )
}

function PaymentsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Payment History</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Payment information coming soon...</p>
      </div>
    </div>
  )
}

function ProfileTab({ user }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm sm:text-base mb-2">Name</label>
            <input 
              type="text" 
              defaultValue={user.name}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm sm:text-base mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={user.email}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/60 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500"
            />
          </div>
          <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function VenuesTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Venue Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Venue management coming soon...</p>
      </div>
    </div>
  )
}

function StaffTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Staff Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Staff management coming soon...</p>
      </div>
    </div>
  )
}

function ResourcesTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Resource Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Resource management coming soon...</p>
      </div>
    </div>
  )
}

function ClientsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Client Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Client management coming soon...</p>
      </div>
    </div>
  )
}

function AnalyticsTab({ userRole }: any) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Analytics Dashboard</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Analytics dashboard coming soon...</p>
      </div>
    </div>
  )
}

function ModerationTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Content Moderation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Moderation tools coming soon...</p>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Security Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Security settings coming soon...</p>
      </div>
    </div>
  )
}

function IntegrationsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Third-party Integrations</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Integration settings coming soon...</p>
      </div>
    </div>
  )
}

function PlatformTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Platform settings coming soon...</p>
      </div>
    </div>
  )
}

function WorkflowsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Workflow Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <p className="text-white/60 text-sm sm:text-base">Workflow management coming soon...</p>
      </div>
    </div>
  )
} 