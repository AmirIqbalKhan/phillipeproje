"use client"

import { useState, useEffect } from 'react'
import { useEventMashups } from '@/context/EventMingleContext'
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
import ReactCalendar from 'react-calendar'
import ClientImage from '@/components/ClientImage'
type Value = Date | null;
import 'react-calendar/dist/Calendar.css'
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import Sidebar from '@/components/Sidebar';
import PromotionTab from '@/components/PromotionTab';

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
    role: (session.user?.role || 'user').toLowerCase(),
  }
  const { events } = useEventMashups()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user role - in real app this would come from user context
  const userRole = user.role // now always lowercase
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'calendar', label: 'Calendar', icon: Clock },
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
      { id: 'workflows', label: 'Workflows', icon: FileText },
      { id: 'promotion-requests', label: 'Promotion Requests', icon: Shield }
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

  if (userRole !== 'admin') {
    tabs.push({ id: 'promotion', label: 'Promotion', icon: Shield });
  }

  // Remove the Profile tab from the tabs array
  tabs = tabs.filter(tab => tab.id !== 'profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole={userRole} user={user} events={events} />
      case 'events':
        return <EventsTab userRole={userRole} />
      case 'calendar':
        return <CalendarTab events={events} />
      case 'payments':
        return <PaymentsTab />
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
      case 'promotion':
        return <PromotionTab currentRole={userRole.toUpperCase()} />;
      case 'promotion-requests':
        return <PromotionTab currentRole={userRole.toUpperCase()} />;
      default:
        return <OverviewTab userRole={userRole} user={user} events={events} />
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />
      {/* Main Content */}
      <main className="flex-1 min-h-screen relative overflow-hidden flex flex-col lg:h-screen lg:overflow-y-auto">
        {/* Hero Section with background image */}
        <section className="relative min-h-[60vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden">
          <ClientImage
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
            alt="Dashboard background"
            className="absolute inset-0 w-full h-full object-cover"
            fallbackSrc="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1500&q=80"
          />
          {/* Dark blur overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          {/* Top and bottom black blends */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-20 pb-16 sm:pb-24">
            {/* Home Button */}
            <div className="absolute top-4 sm:top-8 left-16 sm:left-8 z-30 lg:left-8">
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
            {userRole === 'organizer' ? (
              <div className="mb-8 flex justify-center">
                <a href="/create-event" className="bg-white text-gray-900 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-center min-h-[48px] flex items-center justify-center">
                  Create Event
                </a>
              </div>
            ) : null}
            {/* Dashboard Content */}
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                {/* Tab Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// Tab Components
function OverviewTab({ userRole, user, events }: any) {
  const [attendees, setAttendees] = useState<number | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      setLoading(true);
      Promise.all([
        fetch('/api/admin/platform-analytics').then(res => res.json()),
      ])
        .then(([analytics]) => {
          if (!isMounted) return;
          setAttendees(analytics.userCount);
          setRevenue(analytics.paymentTotal);
          setLastUpdated(new Date());
          setLoading(false);
        })
        .catch(() => {
          if (!isMounted) return;
          setError('Failed to load analytics');
          setLoading(false);
        });
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Poll every 10 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Total Events</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{events.length}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{events.filter((e: { date: string }) => new Date(e.date) > new Date()).length}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Attendees</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{loading ? '...' : attendees != null ? attendees.toLocaleString() : '-'}</p>
            </div>
            <Users className="w-6 h-6 sm:w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs sm:text-sm">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{loading ? '...' : revenue != null ? `$${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}</p>
            </div>
            <CreditCard className="w-6 h-6 sm:w-8 h-8 text-yellow-400" />
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
            {userRole === 'organizer' && (
              <button className="flex items-center justify-center p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-white hover:bg-purple-600/30 transition-all text-sm sm:text-base">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </button>
            )}
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
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-xs">Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</span>
          {loading && <span className="text-white/60 text-xs">Refreshing...</span>}
        </div>
      </div>
    </div>
  )
}

function EventsTab({ userRole }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', location: '' });
  const [editEvent, setEditEvent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', date: '', location: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch('/api/organizer/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/organizer/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
    const data = await res.json();
    if (res.ok) {
      setEvents([data.event, ...events]);
      setShowCreate(false);
      setNewEvent({ name: '', description: '', date: '', location: '' });
    }
    setCreating(false);
  };

  const openEdit = (event: any) => {
    setEditEvent(event);
    setEditForm({ name: event.name, description: event.description, date: event.date?.slice(0, 10) || '', location: event.location });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEvent) return;
    setEditing(true);
    const res = await fetch(`/api/organizer/events/${editEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (res.ok) {
      setEvents(events.map(ev => (ev.id === editEvent.id ? data.event : ev)));
      setEditEvent(null);
    }
    setEditing(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    const res = await fetch(`/api/organizer/events/${id}`, { method: 'DELETE' });
    if (res.ok) setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Your Events</h2>
        {userRole === 'organizer' && (
          <button onClick={() => setShowCreate(true)} className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
            <Plus className="w-4 h-4 mr-2 inline" />
            Create New Event
          </button>
        )}
      </div>
      {loading && <div className="text-white/60 text-sm">Loading...</div>}
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {events.length === 0 && !loading && !error && (
          <div className="text-white/60 col-span-full">No events found.</div>
        )}
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
              <button onClick={() => openEdit(event)} className="flex-1 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600/30 transition-all">
                Edit
              </button>
              <button onClick={() => handleDelete(event.id)} className="flex-1 bg-red-600/20 text-red-400 px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-600/30 transition-all">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Create Event Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-white text-black rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md shadow-xl flex flex-col gap-3 sm:gap-4 relative">
            <button type="button" onClick={() => setShowCreate(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Event</h2>
            <input required type="text" placeholder="Event Name" value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <textarea required placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" rows={3} />
            <input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <input required type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <button type="submit" className="bg-purple-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60 text-sm sm:text-base" disabled={creating}>
              {creating ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}
      {/* Edit Event Modal */}
      {editEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEdit} className="bg-white text-black rounded-xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-md shadow-xl flex flex-col gap-3 sm:gap-4 relative">
            <button type="button" onClick={() => setEditEvent(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Edit Event</h2>
            <input required type="text" placeholder="Event Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <textarea required placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" rows={3} />
            <input required type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <input required type="text" placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="rounded-lg border px-3 sm:px-4 py-2 text-sm sm:text-base" />
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold mt-2 disabled:opacity-60 text-sm sm:text-base" disabled={editing}>
              {editing ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function CalendarTab({ events }: any) {
  const [date, setDate] = useState<Value>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!date) {
      setSelectedEvents([]);
      return;
    }
    const dayEvents = events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      );
    });
    setSelectedEvents(dayEvents);
  }, [date, events]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Event Calendar</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 flex flex-col items-center">
        <ReactCalendar
          onChange={(value) => setDate(value as Date | null)}
          value={date}
          tileContent={({ date: tileDate }: { date: Date }) => {
            const hasEvent = events.some((event: any) => {
              const eventDate = new Date(event.date);
              return (
                eventDate.getFullYear() === tileDate.getFullYear() &&
                eventDate.getMonth() === tileDate.getMonth() &&
                eventDate.getDate() === tileDate.getDate()
              );
            });
            return hasEvent ? <span className="block w-2 h-2 bg-purple-500 rounded-full mx-auto mt-1"></span> : null;
          }}
          className="!bg-black !text-white !border-none !rounded-xl !w-full !max-w-2xl !h-[500px] text-lg"
        />
        <h3 className="text-white font-semibold mb-2 mt-6">Events on {date ? date.toDateString() : ''}</h3>
        {selectedEvents.length === 0 ? (
          <div className="text-white/60">No events for this day.</div>
        ) : (
          <ul className="space-y-2">
            {selectedEvents.map((event: any) => (
              <li key={event.id} className="bg-black/60 border border-white/20 rounded-lg p-3">
                <div className="text-white font-medium">{event.name}</div>
                <div className="text-white/60 text-xs">{event.date} | {event.location}</div>
                <div className="text-white/70 text-xs mt-1">{event.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PaymentsTab() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load payments');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Payment History</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && payments.length === 0 && (
          <div className="text-white/60 text-sm sm:text-base">No payments found.</div>
        )}
        {!loading && !error && payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">Event</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{payment.event?.name || '-'}</td>
                    <td className="py-2 px-4">${payment.amount.toFixed(2)}</td>
                    <td className="py-2 px-4">{payment.status}</td>
                    <td className="py-2 px-4">{new Date(payment.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
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
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', name: '', email: '', role: '' });
  const [saving, setSaving] = useState(false);
  const { data: session } = useSession();
  const organizerId = session?.user?.id;

  useEffect(() => {
    if (!organizerId) return;
    fetch(`/api/organizer/staff?organizerId=${organizerId}`)
      .then(res => res.json())
      .then(data => setStaff(data.staff || []))
      .catch(() => setError('Failed to load staff'))
      .finally(() => setLoading(false));
  }, [organizerId]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEdit(staffMember: any) {
    setForm(staffMember);
    setShowForm(true);
  }

  function handleAdd() {
    setForm({ id: '', name: '', email: '', role: '' });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch('/api/organizer/staff', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, organizerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save staff');
      setShowForm(false);
      setForm({ id: '', name: '', email: '', role: '' });
      // Refresh staff list
      const staffRes = await fetch(`/api/organizer/staff?organizerId=${organizerId}`);
      const staffData = await staffRes.json();
      setStaff(staffData.staff || []);
    } catch (err: any) {
      setError(err.message || 'Failed to save staff');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this staff member?')) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/organizer/staff?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete staff');
      setStaff(staff.filter(s => s.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete staff');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Staff Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <>
            <button onClick={handleAdd} className="mb-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add Staff</button>
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s: any) => (
                  <tr key={s.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{s.name}</td>
                    <td className="py-2 px-4">{s.email}</td>
                    <td className="py-2 px-4">{s.role}</td>
                    <td className="py-2 px-4">
                      <button onClick={() => handleEdit(s)} className="bg-blue-600 text-white px-2 py-1 rounded mr-2">Edit</button>
                      <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showForm && (
              <form onSubmit={handleSave} className="mt-6 space-y-3 bg-black/60 p-4 rounded-xl">
                <div>
                  <label className="block text-white mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-black/40 border border-white/20 text-white" required />
                </div>
                <div>
                  <label className="block text-white mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-black/40 border border-white/20 text-white" required />
                </div>
                <div>
                  <label className="block text-white mb-1">Role</label>
                  <select name="role" value={form.role} onChange={handleInputChange} className="w-full px-3 py-2 rounded bg-black/40 border border-white/20 text-white" required>
                    <option value="">Select role</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="assistant">Assistant</option>
                    <option value="security">Security</option>
                    <option value="catering">Catering</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
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
  const { data: session } = useSession();
  const organizerId = session?.user?.id;
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!organizerId) return;
    setLoading(true);
    fetch(`/api/organizer/clients?organizerId=${organizerId}`)
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load clients');
        setLoading(false);
      });
  }, [organizerId]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Client Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : clients.length === 0 ? (
          <div className="text-white/60">No clients yet.</div>
        ) : (
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
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/moderation')
      .then(res => res.json())
      .then(data => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reports');
        setLoading(false);
      });
  }, []);

  async function handleAction(id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch(`/api/admin/moderation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error('Action failed');
      setReports(reports.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : r));
    } catch {
      alert('Failed to update report');
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Content Moderation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : reports.length === 0 ? (
          <div className="text-white/60">No reports found.</div>
        ) : (
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Reported</th>
                <th className="py-2 px-4 text-left">Reason</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: any) => (
                <tr key={r.id} className="border-b border-white/10">
                  <td className="py-2 px-4">{r.type}</td>
                  <td className="py-2 px-4">{r.target}</td>
                  <td className="py-2 px-4">{r.reason}</td>
                  <td className="py-2 px-4">{r.status}</td>
                  <td className="py-2 px-4">
                    {r.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleAction(r.id, 'approve')} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Approve</button>
                        <button onClick={() => handleAction(r.id, 'reject')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/security-management')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load security data');
        setLoading(false);
      });
  }, []);

  async function handleLock(userId: string, lock: boolean) {
    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/security-management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, lock }),
      });
      if (!res.ok) throw new Error('Failed to update user lock status');
      setData((prev: any) => ({
        ...prev,
        users: prev.users.map((u: any) => u.id === userId ? { ...u, locked: lock } : u)
      }));
    } catch {
      alert('Failed to update user lock status');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Security Settings</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">User Sessions</h3>
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : data && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Session Expires</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((session: any) => (
                  <tr key={session.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{session.user?.name || '-'}</td>
                    <td className="py-2 px-4">{session.user?.email || '-'}</td>
                    <td className="py-2 px-4">{session.user?.role || '-'}</td>
                    <td className="py-2 px-4">{new Date(session.expires).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">User Lock Status</h3>
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : data && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Locked</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: any) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">{user.locked ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleLock(user.id, !user.locked)}
                        className={`px-3 py-1 rounded ${user.locked ? 'bg-green-600' : 'bg-red-600'} text-white`}
                        disabled={updating === user.id}
                      >
                        {user.locked ? 'Unlock' : 'Lock'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Audit Logs</h3>
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : data && data.auditLogs && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Action</th>
                  <th className="py-2 px-4 text-left">Resource</th>
                  <th className="py-2 px-4 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.auditLogs.map((log: any) => (
                  <tr key={log.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{log.user?.name || '-'}</td>
                    <td className="py-2 px-4">{log.action}</td>
                    <td className="py-2 px-4">{log.resource}</td>
                    <td className="py-2 px-4">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any>({ apiKeys: [], webhooks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/integrations')
      .then(res => res.json())
      .then(data => {
        setIntegrations({
          apiKeys: data.apiKeys || [],
          webhooks: data.webhooks || []
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load integrations');
        setLoading(false);
      });
  }, []);

  async function handleAddApiKey(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/integrations/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newApiKeyName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add API key');
      setIntegrations((prev: any) => ({ ...prev, apiKeys: [data.apiKey, ...prev.apiKeys] }));
      setNewApiKeyName('');
    } catch (err: any) {
      alert(err.message || 'Failed to add API key');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddWebhook(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/integrations/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newWebhookUrl, event: 'generic' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add webhook');
      setIntegrations((prev: any) => ({ ...prev, webhooks: [data.webhook, ...prev.webhooks] }));
      setNewWebhookUrl('');
    } catch (err: any) {
      alert(err.message || 'Failed to add webhook');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteApiKey(id: string) {
    if (!confirm('Delete this API key?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/integrations/api-keys?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete API key');
      setIntegrations((prev: any) => ({ ...prev, apiKeys: prev.apiKeys.filter((k: any) => k.id !== id) }));
    } catch {
      alert('Failed to delete API key');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteWebhook(id: string) {
    if (!confirm('Delete this webhook?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/integrations/webhooks?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete webhook');
      setIntegrations((prev: any) => ({ ...prev, webhooks: prev.webhooks.filter((w: any) => w.id !== id) }));
    } catch {
      alert('Failed to delete webhook');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Third-party Integrations</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">API Keys</h3>
        <form onSubmit={handleAddApiKey} className="flex gap-2 mb-4">
          <input value={newApiKeyName} onChange={e => setNewApiKeyName(e.target.value)} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white" placeholder="API Key Name" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Adding...' : 'Add Key'}</button>
        </form>
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Key</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrations.apiKeys.map((k: any) => (
                <tr key={k.id} className="border-b border-white/10">
                  <td className="py-2 px-4">{k.name}</td>
                  <td className="py-2 px-4">{k.key}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleDeleteApiKey(k.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Webhooks</h3>
        <form onSubmit={handleAddWebhook} className="flex gap-2 mb-4">
          <input value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white" placeholder="Webhook URL" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Adding...' : 'Add Webhook'}</button>
        </form>
        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-4 text-left">URL</th>
                <th className="py-2 px-4 text-left">Event</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {integrations.webhooks.map((w: any) => (
                <tr key={w.id} className="border-b border-white/10">
                  <td className="py-2 px-4">{w.url}</td>
                  <td className="py-2 px-4">{w.event}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleDeleteWebhook(w.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
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
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  const chartData = {
    labels: ['Users', 'Events', 'Payments', 'RSVPs'],
    datasets: [
      {
        label: 'Count',
        data: stats ? [stats.userCount, stats.eventCount, stats.paymentCount, stats.rsvpCount] : [0, 0, 0, 0],
        backgroundColor: [
          'rgba(168, 85, 247, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(251, 191, 36, 0.7)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' } },
      y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#fff' }, beginAtZero: true },
    },
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Analytics</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-purple-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-300">{stats.userCount}</div>
                <div className="text-white/80 mt-1">Users</div>
              </div>
              <div className="bg-blue-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-300">{stats.eventCount}</div>
                <div className="text-white/80 mt-1">Events</div>
              </div>
              <div className="bg-green-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-300">{stats.paymentCount}</div>
                <div className="text-white/80 mt-1">Payments</div>
              </div>
              <div className="bg-yellow-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-300">{stats.rsvpCount}</div>
                <div className="text-white/80 mt-1">RSVPs</div>
              </div>
            </div>
            <div className="mb-8">
              <Bar data={chartData} options={chartOptions} height={120} />
            </div>
            <div className="bg-black/30 rounded-lg p-4 text-center border border-white/10">
              <div className="text-lg text-white/80 mb-1">Total Payment Volume</div>
              <div className="text-2xl font-bold text-green-400">${stats.paymentTotal != null ? stats.paymentTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</div>
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/security-management')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load security data');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Security Management</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Recent Login Sessions</h3>
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && data && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Session Expires</th>
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((session: any) => (
                  <tr key={session.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{session.user?.name || '-'}</td>
                    <td className="py-2 px-4">{session.user?.email || '-'}</td>
                    <td className="py-2 px-4">{session.user?.role || '-'}</td>
                    <td className="py-2 px-4">{new Date(session.expires).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">User Lock Status</h3>
        {loading && <div className="text-white/60 text-sm sm:text-base">Loading...</div>}
        {error && <div className="text-red-400 text-sm sm:text-base">{error}</div>}
        {!loading && !error && data && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-white text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Role</th>
                  <th className="py-2 px-4 text-left">Locked</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: any) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">{user.locked ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SystemIntegrationsTab() {
  // Webhooks
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvent, setWebhookEvent] = useState('event.created');
  const [webhookLoading, setWebhookLoading] = useState(true);
  const [webhookError, setWebhookError] = useState<string | null>(null);

  // API Keys
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  // Fetch webhooks
  useEffect(() => {
    setWebhookLoading(true);
    fetch('/api/admin/integrations/webhooks')
      .then(res => res.json())
      .then(data => {
        setWebhooks(data.webhooks || []);
        setWebhookLoading(false);
      })
      .catch(() => {
        setWebhookError('Failed to load webhooks');
        setWebhookLoading(false);
      });
  }, []);

  // Fetch API keys
  useEffect(() => {
    setApiKeyLoading(true);
    fetch('/api/admin/integrations/api-keys')
      .then(res => res.json())
      .then(data => {
        setApiKeys(data.apiKeys || []);
        setApiKeyLoading(false);
      })
      .catch(() => {
        setApiKeyError('Failed to load API keys');
        setApiKeyLoading(false);
      });
  }, []);

  // Add webhook
  function handleAddWebhook(e: React.FormEvent) {
    e.preventDefault();
    setWebhookError(null);
    setWebhookLoading(true);
    fetch('/api/admin/integrations/webhooks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: webhookUrl, event: webhookEvent })
    })
      .then(res => res.json())
      .then(data => {
        setWebhooks([data.webhook, ...webhooks]);
        setWebhookUrl('');
        setWebhookLoading(false);
      })
      .catch(() => {
        setWebhookError('Failed to add webhook');
        setWebhookLoading(false);
      });
  }

  // Remove webhook
  function handleRemoveWebhook(id: string) {
    setWebhookLoading(true);
    fetch('/api/admin/integrations/webhooks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(() => {
        setWebhooks(webhooks.filter(w => w.id !== id));
        setWebhookLoading(false);
      })
      .catch(() => {
        setWebhookError('Failed to remove webhook');
        setWebhookLoading(false);
      });
  }

  // Create API key
  function handleCreateApiKey() {
    setCreatingKey(true);
    setApiKeyError(null);
    fetch('/api/admin/integrations/api-keys', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setApiKeys([data.apiKey, ...apiKeys]);
        setCreatingKey(false);
      })
      .catch(() => {
        setApiKeyError('Failed to create API key');
        setCreatingKey(false);
      });
  }

  // Revoke API key
  function handleRevokeApiKey(id: string) {
    setApiKeyLoading(true);
    fetch('/api/admin/integrations/api-keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(() => {
        setApiKeys(apiKeys.map(k => k.id === id ? { ...k, revoked: true } : k));
        setApiKeyLoading(false);
      })
      .catch(() => {
        setApiKeyError('Failed to revoke API key');
        setApiKeyLoading(false);
      });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">System Integrations</h2>
      {/* Webhooks */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <h3 className="text-white font-semibold mb-2">Webhooks</h3>
        <form onSubmit={handleAddWebhook} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="url"
            className="flex-1 px-3 py-2 rounded bg-black/60 border border-white/20 text-white"
            placeholder="Webhook URL"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            required
          />
          <select
            className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white"
            value={webhookEvent}
            onChange={e => setWebhookEvent(e.target.value)}
          >
            <option value="event.created">Event Created</option>
            <option value="user.registered">User Registered</option>
            <option value="payment.completed">Payment Completed</option>
          </select>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            disabled={webhookLoading}
          >
            Add Webhook
          </button>
        </form>
        {webhookLoading && <div className="text-white/60 text-sm">Loading...</div>}
        {webhookError && <div className="text-red-400 text-sm mb-2">{webhookError}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-4 text-left">URL</th>
                <th className="py-2 px-4 text-left">Event</th>
                <th className="py-2 px-4 text-left">Created</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((w: any) => (
                <tr key={w.id} className="border-b border-white/10">
                  <td className="py-2 px-4">{w.url}</td>
                  <td className="py-2 px-4">{w.event}</td>
                  <td className="py-2 px-4">{new Date(w.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleRemoveWebhook(w.id)}
                      className="bg-red-600/20 text-red-400 px-3 py-1 rounded hover:bg-red-600/30 transition-all text-xs"
                      disabled={webhookLoading}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* API Keys */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">API Keys</h3>
        <button
          onClick={handleCreateApiKey}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mb-4"
          disabled={creatingKey || apiKeyLoading}
        >
          {creatingKey ? 'Creating...' : 'Create API Key'}
        </button>
        {apiKeyLoading && <div className="text-white/60 text-sm">Loading...</div>}
        {apiKeyError && <div className="text-red-400 text-sm mb-2">{apiKeyError}</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2 px-4 text-left">Key</th>
                <th className="py-2 px-4 text-left">Created</th>
                <th className="py-2 px-4 text-left">Revoked</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((k: any) => (
                <tr key={k.id} className="border-b border-white/10">
                  <td className="py-2 px-4 font-mono break-all">{k.key}</td>
                  <td className="py-2 px-4">{new Date(k.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4">{k.revoked ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4">
                    {!k.revoked && (
                      <button
                        onClick={() => handleRevokeApiKey(k.id)}
                        className="bg-red-600/20 text-red-400 px-3 py-1 rounded hover:bg-red-600/30 transition-all text-xs"
                        disabled={apiKeyLoading}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlatformSettingsTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/platform-settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings);
        setForm(data.settings || {});
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load platform settings');
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/platform-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');
      setSettings(data.settings);
      setForm(data.settings);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-white/60">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Settings</h2>
      <form onSubmit={handleSave} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 space-y-4">
        <div>
          <label className="block text-white font-semibold mb-1">Branding</label>
          <input name="branding" value={form.branding || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" />
        </div>
        <div>
          <label className="block text-white font-semibold mb-1">Terms of Service</label>
          <textarea name="terms" value={form.terms || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" rows={3} />
        </div>
        <div>
          <label className="block text-white font-semibold mb-1">Pricing</label>
          <input name="pricing" value={form.pricing || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" />
        </div>
        <div>
          <label className="block text-white font-semibold mb-1">Commission Rate (%)</label>
          <input name="commissionRate" type="number" step="0.01" value={form.commissionRate || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" />
        </div>
        <div>
          <label className="block text-white font-semibold mb-1">Currency</label>
          <input name="currency" value={form.currency || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" />
        </div>
        <div>
          <label className="block text-white font-semibold mb-1">Timezone</label>
          <input name="timezone" value={form.timezone || ''} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white w-full" />
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
}

function WorkflowAutomationTab() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', trigger: '', action: '' });
  const [error, setError] = useState<string | null>(null);
  // Notifications preview UI
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifError, setNotifError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewWorkflow(prev => ({ ...prev, [name]: value }));
  }

  function handleAddWorkflow(e: React.FormEvent) {
    e.preventDefault();
    if (!newWorkflow.name || !newWorkflow.trigger || !newWorkflow.action) {
      setError('All fields are required');
      return;
    }
    setWorkflows(prev => [
      { ...newWorkflow, id: Date.now().toString() },
      ...prev
    ]);
    setNewWorkflow({ name: '', trigger: '', action: '' });
    setError(null);
  }

  function handleDeleteWorkflow(id: string) {
    setWorkflows(prev => prev.filter(w => w.id !== id));
  }

  function handleAddNotification() {
    setNotifications(prev => [
      { id: Date.now().toString(), title: 'Test Notification', message: 'This is a test notification.', isRead: false },
      ...prev
    ]);
  }

  function handleMarkRead(id: string, read: boolean) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: read } : n));
  }

  function handleDeleteNotification(id: string) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">Workflow Automation</h2>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mb-6">
        <div className="text-yellow-400 mb-4">Backend support for workflow automation is coming soon. This is a preview UI.</div>
        <form onSubmit={handleAddWorkflow} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input name="name" value={newWorkflow.name} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white flex-1" placeholder="Workflow Name" required />
          <input name="trigger" value={newWorkflow.trigger} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white flex-1" placeholder="Trigger (e.g. RSVP_CREATED)" required />
          <input name="action" value={newWorkflow.action} onChange={handleChange} className="px-3 py-2 rounded bg-black/60 border border-white/20 text-white flex-1" placeholder="Action (e.g. Send Email)" required />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </form>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <table className="min-w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Trigger</th>
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(w => (
              <tr key={w.id} className="border-b border-white/10">
                <td className="py-2 px-4">{w.name}</td>
                <td className="py-2 px-4">{w.trigger}</td>
                <td className="py-2 px-4">{w.action}</td>
                <td className="py-2 px-4">
                  <button onClick={() => handleDeleteWorkflow(w.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {workflows.length === 0 && <div className="text-white/60 mt-2">No workflows yet.</div>}
      </div>
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
        <h3 className="text-white font-semibold mb-2">Notifications</h3>
        <div className="text-yellow-400 mb-2">Backend support for notifications is coming soon. This is a preview UI.</div>
        <button onClick={handleAddNotification} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Add Test Notification</button>
        <table className="min-w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Message</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map(n => (
              <tr key={n.id} className="border-b border-white/10">
                <td className="py-2 px-4">{n.title}</td>
                <td className="py-2 px-4">{n.message}</td>
                <td className="py-2 px-4">{n.isRead ? 'Read' : 'Unread'}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleMarkRead(n.id, !n.isRead)} className="bg-green-600 text-white px-2 py-1 rounded">
                    Mark as {n.isRead ? 'Unread' : 'Read'}
                  </button>
                  <button onClick={() => handleDeleteNotification(n.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notifications.length === 0 && <div className="text-white/60 mt-2">No notifications yet.</div>}
      </div>
    </div>
  );
}
