"use client"

import { useState, useEffect } from 'react'
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
  Home,
  Gift
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

  if (userRole === 'user') {
    tabs.push(
      { id: 'my-rsvps', label: 'My RSVPs', icon: Star },
      { id: 'saved-events', label: 'Saved Events', icon: Star },
      { id: 'social-feed', label: 'Social Feed', icon: Users },
      { id: 'rewards', label: 'Rewards', icon: Gift },
      { id: 'recommendations', label: 'Recommendations', icon: Zap }
    )
  }

  if (userRole === 'organizer' || userRole === 'admin') {
    tabs.push(
      { id: 'crm', label: 'Client CRM', icon: Users }
    )
  }

  if (userRole === 'admin') {
    tabs.push(
      { id: 'platform-analytics', label: 'Platform Analytics', icon: BarChart3 },
      { id: 'user-moderation', label: 'User Moderation', icon: Users },
      { id: 'security-management', label: 'Security Management', icon: Shield },
      { id: 'system-integrations', label: 'System Integrations', icon: Zap },
      { id: 'platform-settings', label: 'Platform Settings', icon: Settings },
      { id: 'workflow-automation', label: 'Workflow Automation', icon: FileText }
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
      case 'my-rsvps':
        return <MyRSVPsTab user={user} />
      case 'saved-events':
        return <SavedEventsTab user={user} />
      case 'social-feed':
        return <SocialFeedTab user={user} />
      case 'rewards':
        return <RewardsTab user={user} />
      case 'recommendations':
        return <RecommendationsTab user={user} />
      case 'crm':
        return <CRMTab userRole={userRole} />
      case 'platform-analytics':
        return <PlatformAnalyticsTab />
      case 'user-moderation':
        return <UserModerationTab />
      case 'security-management':
        return <SecurityManagementTab />
      case 'system-integrations':
        return <SystemIntegrationsTab />
      case 'platform-settings':
        return <PlatformSettingsTab />
      case 'workflow-automation':
        return <WorkflowAutomationTab />
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
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ id: '', name: '', address: '', city: '', capacity: '' });
  const [editing, setEditing] = useState(false);

  // Fetch venues
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/organizer/venues?organizerId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setVenues(data.venues || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load venues');
        setLoading(false);
      });
  }, [userId]);

  // Handle form input
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Create or update venue
  function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form } : { ...form, ownerId: userId };
    fetch('/api/organizer/venues', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setForm({ id: '', name: '', address: '', city: '', capacity: '' });
        setEditing(false);
        // Refresh venues
        return fetch(`/api/organizer/venues?organizerId=${userId}`)
          .then(res => res.json())
          .then(data => setVenues(data.venues || []));
      })
      .catch(err => setError(err.message));
  }

  // Edit venue
  function handleEdit(venue: any) {
    setForm({
      id: venue.id,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      capacity: venue.capacity.toString()
    });
    setEditing(true);
  }

  // Delete venue
  function handleDelete(id: string) {
    setError(null);
    fetch(`/api/organizer/venues?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setVenues(venues.filter(v => v.id !== id));
      })
      .catch(err => setError(err.message));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Venue Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Venue Name" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <input name="capacity" value={form.capacity} onChange={handleChange} placeholder="Capacity" type="number" min="1" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition-all">{editing ? 'Update' : 'Add'} Venue</button>
            {editing && <button type="button" onClick={() => { setForm({ id: '', name: '', address: '', city: '', capacity: '' }); setEditing(false); }} className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700 transition-all">Cancel</button>}
          </div>
        </form>
        <div className="space-y-3">
          {venues.length === 0 && !loading && <div className="text-white/60">No venues yet.</div>}
          {venues.map(venue => (
            <div key={venue.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{venue.name}</p>
                <p className="text-white/60 text-xs sm:text-sm">{venue.address}, {venue.city} | Capacity: {venue.capacity}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button onClick={() => handleEdit(venue)} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-600/30 transition-all text-xs">Edit</button>
                <button onClick={() => handleDelete(venue.id)} className="bg-red-600/20 text-red-400 px-3 py-1 rounded hover:bg-red-600/30 transition-all text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ id: '', name: '', type: '', quantity: '' });
  const [editing, setEditing] = useState(false);

  // Fetch resources
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/organizer/resources?organizerId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setResources(data.resources || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load resources');
        setLoading(false);
      });
  }, [userId]);

  // Handle form input
  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Create or update resource
  function handleSubmit(e: any) {
    e.preventDefault();
    setError(null);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form } : { ...form, organizerId: userId };
    fetch('/api/organizer/resources', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setForm({ id: '', name: '', type: '', quantity: '' });
        setEditing(false);
        // Refresh resources
        return fetch(`/api/organizer/resources?organizerId=${userId}`)
          .then(res => res.json())
          .then(data => setResources(data.resources || []));
      })
      .catch(err => setError(err.message));
  }

  // Edit resource
  function handleEdit(resource: any) {
    setForm({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      quantity: resource.quantity.toString()
    });
    setEditing(true);
  }

  // Delete resource
  function handleDelete(id: string) {
    setError(null);
    fetch(`/api/organizer/resources?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setResources(resources.filter(r => r.id !== id));
      })
      .catch(err => setError(err.message));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Resource Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <div className="flex flex-wrap gap-2">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Resource Name" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <input name="type" value={form.type} onChange={handleChange} placeholder="Type (equipment, vendor, etc.)" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" min="1" className="px-2 py-1 rounded bg-black/60 border border-white/20 text-white" required />
            <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition-all">{editing ? 'Update' : 'Add'} Resource</button>
            {editing && <button type="button" onClick={() => { setForm({ id: '', name: '', type: '', quantity: '' }); setEditing(false); }} className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700 transition-all">Cancel</button>}
          </div>
        </form>
        <div className="space-y-3">
          {resources.length === 0 && !loading && <div className="text-white/60">No resources yet.</div>}
          {resources.map(resource => (
            <div key={resource.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{resource.name}</p>
                <p className="text-white/60 text-xs sm:text-sm">{resource.type} | Quantity: {resource.quantity}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button onClick={() => handleEdit(resource)} className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded hover:bg-blue-600/30 transition-all text-xs">Edit</button>
                <button onClick={() => handleDelete(resource.id)} className="bg-red-600/20 text-red-400 px-3 py-1 rounded hover:bg-red-600/30 transition-all text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/organizer/analytics?organizerId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Analytics Dashboard</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6">
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total Events</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalEvents}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total RSVPs</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalRsvps}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Upcoming Events</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.upcomingEvents}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Avg RSVPs/Event</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{Math.round(stats.avgRsvps * 100) / 100}</div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Top Events by Attendance</h3>
              {(!stats.topEvents || stats.topEvents.length === 0) ? (
                <div className="text-white/60">No data yet.</div>
              ) : (
                <ul className="text-white/90 space-y-1">
                  {stats.topEvents.map((ev: any, idx: number) => (
                    <li key={idx}>{ev.name}: {ev.count} RSVPs</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
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

function MyRSVPsTab({ user }: any) {
  const [rsvps, setRsvps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email && !user?.id) return
    // Fetch RSVPs for the user
    fetch(`/api/user/${user.id}/rsvps`)
      .then(res => res.json())
      .then(data => {
        setRsvps(data.rsvps || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load RSVPs')
        setLoading(false)
      })
  }, [user?.id])

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">My RSVPs</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && rsvps.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No RSVP'd events yet.</div>
        )}
        {!loading && !error && rsvps.length > 0 && (
          <div className="space-y-3">
            {rsvps.map((rsvp: any) => (
              <div key={rsvp.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{rsvp.event.name}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{rsvp.event.date} | {rsvp.event.location}</p>
                </div>
                <span className="text-purple-400 text-xs sm:text-sm mt-2 sm:mt-0">{rsvp.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SavedEventsTab({ user }: any) {
  const [savedEvents, setSavedEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email && !user?.id) return
    // Fetch saved events for the user
    fetch(`/api/user/${user.id}/saved-events`)
      .then(res => res.json())
      .then(data => {
        setSavedEvents(data.savedEvents || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load saved events')
        setLoading(false)
      })
  }, [user?.id])

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Saved Events</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && savedEvents.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No saved events yet.</div>
        )}
        {!loading && !error && savedEvents.length > 0 && (
          <div className="space-y-3">
            {savedEvents.map((saved: any) => (
              <div key={saved.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{saved.event.name}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{saved.event.date} | {saved.event.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SocialFeedTab({ user }: any) {
  const [feed, setFeed] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.email && !user?.id) return
    // Fetch social feed for the user
    fetch(`/api/user/${user.id}/social-feed`)
      .then(res => res.json())
      .then(data => {
        setFeed(data.feed || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load social feed')
        setLoading(false)
      })
  }, [user?.id])

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Social Feed</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && feed.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No recent activity from friends.</div>
        )}
        {!loading && !error && feed.length > 0 && (
          <div className="space-y-3">
            {feed.map((item: any) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{item.user.name} RSVP'd <span className='text-purple-400'>{item.status}</span> to <span className='text-blue-400'>{item.event.name}</span></p>
                  <p className="text-white/60 text-xs sm:text-sm">{item.event.date} | {item.event.location}</p>
                </div>
                <span className="text-white/50 text-xs sm:text-sm mt-2 sm:mt-0">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RewardsTab({ user }: any) {
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referredUsers, setReferredUsers] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/user/${user.id}/rewards`)
      .then(res => res.json())
      .then(data => {
        setReferralCode(data.referralCode)
        setReferredUsers(data.referredUsers || [])
        setRewards(data.rewards || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load rewards')
        setLoading(false)
      })
  }, [user?.id])

  // Simple QR code placeholder (replace with real QR code component if desired)
  function QRPlaceholder({ code }: { code: string }) {
    return (
      <div className="bg-white text-black font-mono p-4 rounded-lg text-center w-40 mx-auto mb-2">
        QR: {code}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Rewards</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Your Referral Code</h3>
              {referralCode ? (
                <>
                  <QRPlaceholder code={referralCode} />
                  <div className="text-white/80 text-lg font-mono text-center">{referralCode}</div>
                </>
              ) : (
                <div className="text-white/60">No referral code available.</div>
              )}
            </div>
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Referred Users</h3>
              {referredUsers.length === 0 ? (
                <div className="text-white/60">No users referred yet.</div>
              ) : (
                <ul className="text-white/90 space-y-1">
                  {referredUsers.map((ru: any) => (
                    <li key={ru.id}>{ru.name} ({ru.email})</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Bonuses & Rewards</h3>
              {rewards.length === 0 ? (
                <div className="text-white/60">No rewards yet.</div>
              ) : (
                <ul className="text-white/90 space-y-1">
                  {rewards.map((reward: any) => (
                    <li key={reward.id}>{reward.type}: {reward.amount} ({reward.status})</li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function RecommendationsTab({ user }: any) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/user/${user.id}/recommendations`)
      .then(res => res.json())
      .then(data => {
        setRecommendations(data.recommendations || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load recommendations')
        setLoading(false)
      })
  }, [user?.id])

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Recommendations</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && recommendations.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No recommendations at this time.</div>
        )}
        {!loading && !error && recommendations.length > 0 && (
          <div className="space-y-3">
            {recommendations.map((event: any) => (
              <div key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{event.name}</p>
                  <p className="text-white/60 text-xs sm:text-sm">{event.date} | {event.location}</p>
                </div>
                <a href={`/event/${event.id}`} className="text-purple-400 underline text-xs sm:text-sm mt-2 sm:mt-0">View Event</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CRMTab({ userRole }: any) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/organizer/clients?organizerId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load clients');
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Client CRM</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && clients.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No clients yet.</div>
        )}
        {!loading && !error && clients.length > 0 && (
          <div className="space-y-3">
            {clients.map((client: any) => (
              <div key={client.user.id} className="p-3 bg-black/20 rounded-lg">
                <div className="text-white font-medium text-sm sm:text-base">{client.user.name} <span className="text-white/60">({client.user.email})</span></div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">Events:</div>
                <ul className="ml-4 text-xs sm:text-sm text-white/80">
                  {client.rsvps.map((rsvp: any, idx: number) => (
                    <li key={idx}>{rsvp.event.name} ({rsvp.status})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlatformAnalyticsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/platform-analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load platform analytics');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Analytics</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6">
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total Users</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalUsers}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total Events</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalEvents}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total RSVPs</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalRsvps}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Total Payments</div>
                <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalPayments}</div>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/20">
                <div className="text-white/60 text-xs sm:text-sm">Top Events</div>
                <ul className="text-white/90 space-y-1">
                  {stats.topEvents.map((ev: any, idx: number) => (
                    <li key={idx}>{ev.name}: {ev.count} RSVPs</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UserModerationTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  function handleRoleChange(id: string, role: string) {
    setUpdating(id);
    fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role })
    })
      .then(res => res.json())
      .then(data => {
        setUsers(users.map(u => u.id === id ? { ...u, role: data.user.role } : u));
        setUpdating(null);
      })
      .catch(() => {
        setError('Failed to update user');
        setUpdating(null);
      });
  }

  function handleDelete(id: string) {
    setUpdating(id);
    fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(() => {
        setUsers(users.filter(u => u.id !== id));
        setUpdating(null);
      })
      .catch(() => {
        setError('Failed to delete user');
        setUpdating(null);
      });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">User Moderation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No users found.</div>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-3">
            {users.map((user: any) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{user.name} <span className="text-white/60">({user.email})</span></p>
                  <p className="text-xs sm:text-sm text-white/70">Role: {user.role}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)} disabled={updating === user.id} className="bg-black/60 border border-white/20 text-white rounded px-2 py-1 text-xs">
                    <option value="USER">User</option>
                    <option value="ORGANIZER">Organizer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <button onClick={() => handleDelete(user.id)} disabled={updating === user.id} className="bg-red-600/20 text-red-400 px-3 py-1 rounded hover:bg-red-600/30 transition-all text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SecurityManagementTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Security Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Role Permissions</h3>
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No users found.</div>
        )}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-2">
            {users.map((user: any) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-black/20 rounded-lg">
                <div>
                  <span className="text-white font-medium text-sm sm:text-base">{user.name}</span>
                  <span className="text-white/60 text-xs ml-2">({user.email})</span>
                </div>
                <span className="text-purple-400 text-xs sm:text-sm mt-1 sm:mt-0">{user.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Two-Factor Authentication (2FA)</h3>
        <div className="text-white/60 text-sm sm:text-base">2FA management coming soon...</div>
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">Audit Logs</h3>
        <div className="text-white/60 text-sm sm:text-base">Audit logs will appear here in the future.</div>
      </div>
    </div>
  );
}

function SystemIntegrationsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">System Integrations</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Webhooks</h3>
        <div className="text-white/60 text-sm sm:text-base">Webhook management coming soon...</div>
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">API Keys</h3>
        <div className="text-white/60 text-sm sm:text-base">API key management coming soon...</div>
      </div>
    </div>
  );
}

function PlatformSettingsTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Branding</h3>
        <div className="text-white/60 text-sm sm:text-base">Branding settings coming soon...</div>
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Terms & Conditions</h3>
        <div className="text-white/60 text-sm sm:text-base">Terms & conditions management coming soon...</div>
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">Pricing Control</h3>
        <div className="text-white/60 text-sm sm:text-base">Pricing control coming soon...</div>
      </div>
    </div>
  );
}

function WorkflowAutomationTab() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Workflow Automation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Automation Rules</h3>
        <div className="text-white/60 text-sm sm:text-base">Automation rules management coming soon...</div>
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">Notifications</h3>
        <div className="text-white/60 text-sm sm:text-base">Notification management coming soon...</div>
      </div>
    </div>
  );
} 