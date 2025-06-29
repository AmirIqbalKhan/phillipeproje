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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting to login...</div>
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-20 pb-24">
          {/* Home Button */}
          <div className="absolute top-8 left-8 z-30">
            <Link 
              href="/" 
              className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Dashboard
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Welcome back, {user.name}! Manage your events and activities.
          </p>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex flex-wrap bg-black/20 border-b border-white/10">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'text-white bg-purple-600/20 border-b-2 border-purple-500'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
              
              {/* Tab Content */}
              <div className="p-8">
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Events</p>
              <p className="text-2xl font-bold text-white">{events.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Upcoming</p>
              <p className="text-2xl font-bold text-white">
                {events.filter((e: any) => new Date(e.date) > new Date()).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Messages</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Role</p>
              <p className="text-2xl font-bold text-white capitalize">{userRole}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Recent Events</h3>
          <div className="space-y-3">
            {events.slice(0, 3).map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">{event.name}</p>
                  <p className="text-white/60 text-sm">{event.date}</p>
                </div>
                <span className="text-purple-400 text-sm">{event.location}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </button>
            <button className="w-full bg-black/60 border border-white/20 text-white py-3 px-4 rounded-lg hover:bg-black/80 transition-all flex items-center justify-center">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </button>
            <button className="w-full bg-black/60 border border-white/20 text-white py-3 px-4 rounded-lg hover:bg-black/80 transition-all flex items-center justify-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventsTab({ userRole, events }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Events</h2>
        {(userRole === 'organizer' || userRole === 'admin') && (
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: any) => (
          <div key={event.id} className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-2">{event.name}</h3>
            <p className="text-white/60 text-sm mb-4">{event.description}</p>
            <div className="space-y-2">
              <div className="flex items-center text-white/70 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-white/70 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                {event.date}
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-all">
                View
              </button>
              {(userRole === 'organizer' || userRole === 'admin') && (
                <button className="bg-black/60 border border-white/20 text-white px-3 py-1 rounded text-sm hover:bg-black/80 transition-all">
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CalendarTab({ events }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Calendar</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Calendar integration coming soon...</p>
      </div>
    </div>
  )
}

function ChatTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Chat</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Chat system coming soon...</p>
      </div>
    </div>
  )
}

function PaymentsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Payments</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Payment management coming soon...</p>
      </div>
    </div>
  )
}

function ProfileTab({ user }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Profile</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Name</label>
            <input 
              type="text" 
              defaultValue={user.name}
              className="w-full px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={user.email}
              className="w-full px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// Organizer-specific tabs
function VenuesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Venue Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Venue management coming soon...</p>
      </div>
    </div>
  )
}

function StaffTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Staff Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Staff management coming soon...</p>
      </div>
    </div>
  )
}

function ResourcesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Resource Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Resource management coming soon...</p>
      </div>
    </div>
  )
}

function ClientsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Client CRM</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Client CRM coming soon...</p>
      </div>
    </div>
  )
}

function AnalyticsTab({ userRole }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        {userRole === 'admin' ? 'Platform Analytics' : 'Event Analytics'}
      </h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Analytics dashboard coming soon...</p>
      </div>
    </div>
  )
}

// Admin-specific tabs
function ModerationTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Moderation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Moderation tools coming soon...</p>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Security Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Security settings coming soon...</p>
      </div>
    </div>
  )
}

function IntegrationsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">System Integrations</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Integration management coming soon...</p>
      </div>
    </div>
  )
}

function PlatformTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Platform configuration coming soon...</p>
      </div>
    </div>
  )
}

function WorkflowsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Workflow Automation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <p className="text-white/70">Workflow automation coming soon...</p>
      </div>
    </div>
  )
} 