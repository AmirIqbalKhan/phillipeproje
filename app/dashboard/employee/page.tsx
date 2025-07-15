"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  Shield, 
  Settings, 
  Home, 
  BarChart3, 
  AlertTriangle,
  MessageSquare,
  CreditCard,
  Megaphone,
  Zap,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Flag,
  UserCheck,
  Settings2,
  Database,
  Star,
  Tag,
  RefreshCw,
  Activity,
  X
} from 'lucide-react'

export default function EmployeeDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [employeeRole, setEmployeeRole] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    const fetchStats = () => {
      if (session?.user?.id) {
        fetch(`/api/employee/role?userId=${session.user.id}`)
          .then(res => res.json())
          .then(data => {
            if (!isMounted) return;
            setEmployeeRole(data.role);
            // Simulate fetching stats for the role (replace with real API if available)
            setStats(getRoleStats(data.role));
            setLastUpdated(new Date());
            setLoading(false);
          })
          .catch(() => {
            if (!isMounted) return;
            setLoading(false);
          });
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [session?.user?.id]);
  
  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  
  if (!session || !session.user || !employeeRole) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }
  
  const getRoleSpecificTools = () => {
    switch (employeeRole.role) {
      case 'SUPPORT_STAFF':
        return [
          {
            title: 'Manage Bookings',
            description: 'Search and manage attendee bookings',
            icon: Users,
            href: '/dashboard/employee/support/bookings',
            color: 'blue'
          },
          {
            title: 'Support Messages',
            description: 'Respond to support inquiries',
            icon: MessageSquare,
            href: '/dashboard/employee/support/messages',
            color: 'green'
          },
          {
            title: 'Refund Requests',
            description: 'Process refund requests',
            icon: CreditCard,
            href: '/dashboard/employee/support/refunds',
            color: 'yellow'
          },
          {
            title: 'User History',
            description: 'View user booking history',
            icon: FileText,
            href: '/dashboard/employee/support/history',
            color: 'purple'
          }
        ]
      
      case 'EVENT_MODERATOR':
        return [
          {
            title: 'Event Approval',
            description: 'Review and approve event submissions',
            icon: CheckCircle,
            href: '/dashboard/employee/moderator/approvals',
            color: 'green'
          },
          {
            title: 'Content Moderation',
            description: 'Moderate event content and media',
            icon: Shield,
            href: '/dashboard/employee/moderator/content',
            color: 'red'
          },
          {
            title: 'Feature Events',
            description: 'Feature or unfeature events',
            icon: Star,
            href: '/dashboard/employee/moderator/feature',
            color: 'yellow'
          },
          {
            title: 'Spam Detection',
            description: 'Detect and handle spam events',
            icon: AlertTriangle,
            href: '/dashboard/employee/moderator/spam',
            color: 'orange'
          }
        ]
      
      case 'FINANCE_TEAM':
        return [
          {
            title: 'Transaction Management',
            description: 'View and manage all transactions',
            icon: DollarSign,
            href: '/dashboard/employee/finance/transactions',
            color: 'green'
          },
          {
            title: 'Organizer Payouts',
            description: 'Process organizer payouts',
            icon: CreditCard,
            href: '/dashboard/employee/finance/payouts',
            color: 'blue'
          },
          {
            title: 'Refund Processing',
            description: 'Handle refund requests',
            icon: RefreshCw,
            href: '/dashboard/employee/finance/refunds',
            color: 'yellow'
          },
          {
            title: 'Financial Reports',
            description: 'Generate financial reports',
            icon: BarChart3,
            href: '/dashboard/employee/finance/reports',
            color: 'purple'
          }
        ]
      
      case 'MARKETING_TEAM':
        return [
          {
            title: 'Campaign Management',
            description: 'Create and manage marketing campaigns',
            icon: Megaphone,
            href: '/dashboard/employee/marketing/campaigns',
            color: 'blue'
          },
          {
            title: 'Discount Codes',
            description: 'Manage discount codes and promotions',
            icon: Tag,
            href: '/dashboard/employee/marketing/discounts',
            color: 'green'
          },
          {
            title: 'Featured Events',
            description: 'Manage featured events and highlights',
            icon: Star,
            href: '/dashboard/employee/marketing/featured',
            color: 'yellow'
          },
          {
            title: 'Analytics',
            description: 'View marketing performance metrics',
            icon: TrendingUp,
            href: '/dashboard/employee/marketing/analytics',
            color: 'purple'
          }
        ]
      
      case 'TECHNICAL_STAFF':
        return [
          {
            title: 'System Health',
            description: 'Monitor system health and performance',
            icon: Activity,
            href: '/dashboard/employee/technical/health',
            color: 'green'
          },
          {
            title: 'API Management',
            description: 'Manage API keys and integrations',
            icon: Zap,
            href: '/dashboard/employee/technical/api',
            color: 'blue'
          },
          {
            title: 'Database Management',
            description: 'Database maintenance and optimization',
            icon: Database,
            href: '/dashboard/employee/technical/database',
            color: 'purple'
          },
          {
            title: 'System Logs',
            description: 'View system logs and debug information',
            icon: FileText,
            href: '/dashboard/employee/technical/logs',
            color: 'orange'
          }
        ]
      
      default:
        return []
    }
  }
  
  const getRoleStats = (role: string) => {
    switch (role) {
      case 'SUPPORT_STAFF':
        return [
          { label: 'Open Tickets', value: '23', icon: MessageSquare, color: 'blue' },
          { label: 'Resolved Today', value: '15', icon: CheckCircle, color: 'green' },
          { label: 'Avg Response Time', value: '2.3h', icon: Clock, color: 'yellow' },
          { label: 'Satisfaction Rate', value: '94%', icon: TrendingUp, color: 'purple' }
        ]
      
      case 'EVENT_MODERATOR':
        return [
          { label: 'Pending Reviews', value: '12', icon: Clock, color: 'yellow' },
          { label: 'Approved Today', value: '8', icon: CheckCircle, color: 'green' },
          { label: 'Rejected Today', value: '3', icon: X, color: 'red' },
          { label: 'Featured Events', value: '45', icon: Star, color: 'purple' }
        ]
      
      case 'FINANCE_TEAM':
        return [
          { label: 'Total Revenue', value: '$125K', icon: DollarSign, color: 'green' },
          { label: 'Pending Payouts', value: '$18K', icon: CreditCard, color: 'blue' },
          { label: 'Refunds Today', value: '$2.3K', icon: RefreshCw, color: 'yellow' },
          { label: 'Success Rate', value: '99.2%', icon: TrendingUp, color: 'purple' }
        ]
      
      case 'MARKETING_TEAM':
        return [
          { label: 'Active Campaigns', value: '7', icon: Megaphone, color: 'blue' },
          { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'green' },
          { label: 'Discount Usage', value: '1.2K', icon: Tag, color: 'yellow' },
          { label: 'Featured Events', value: '23', icon: Star, color: 'purple' }
        ]
      
      case 'TECHNICAL_STAFF':
        return [
          { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'green' },
          { label: 'Active APIs', value: '12', icon: Zap, color: 'blue' },
          { label: 'Error Rate', value: '0.1%', icon: AlertTriangle, color: 'yellow' },
          { label: 'Response Time', value: '45ms', icon: Clock, color: 'purple' }
        ]
      
      default:
        return []
    }
  }
  
  const tools = getRoleSpecificTools()
  const stats = getRoleStats(employeeRole.role);
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
          alt="Employee dashboard background"
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
            Employee Dashboard
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Welcome, {session.user.name}! {employeeRole.role.replace('_', ' ')} tools and management.
          </p>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">Role-Specific Tools</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                {tools.map((tool, index) => {
                  const IconComponent = tool.icon
                  const colorClasses = {
                    blue: 'hover:border-blue-500/50 text-blue-400',
                    green: 'hover:border-green-500/50 text-green-400',
                    yellow: 'hover:border-yellow-500/50 text-yellow-400',
                    purple: 'hover:border-purple-500/50 text-purple-400',
                    red: 'hover:border-red-500/50 text-red-400',
                    orange: 'hover:border-orange-500/50 text-orange-400'
                  }
                  
                  return (
                    <Link 
                      key={index}
                      href={tool.href}
                      className={`group bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 transition-all duration-300 ${colorClasses[tool.color as keyof typeof colorClasses]}`}
                    >
                      <div className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-${tool.color}-600/20 rounded-full mb-4 mx-auto group-hover:bg-${tool.color}-600/30 transition-all`}>
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2 group-hover:text-white transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-white/60 text-sm sm:text-base text-center">
                        {tool.description}
                      </p>
                    </Link>
                  )
                })}
              </div>
              
              {/* Stats Section */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">Today's Statistics (Overview)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon
                  const colorClasses = {
                    blue: 'text-blue-400',
                    green: 'text-green-400',
                    yellow: 'text-yellow-400',
                    purple: 'text-purple-400',
                    red: 'text-red-400',
                    orange: 'text-orange-400'
                  }
                  return (
                    <div key={index} className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-white/60 text-sm sm:text-base">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-xs">Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</span>
                  {loading && <span className="text-white/60 text-xs">Refreshing...</span>}
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="mt-8 sm:mt-12">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 sm:p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm sm:text-base">Successfully processed 5 refund requests</p>
                      <p className="text-white/60 text-xs sm:text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm sm:text-base">Approved 3 new event submissions</p>
                      <p className="text-white/60 text-xs sm:text-sm">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 sm:p-4 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm sm:text-base">Flagged 2 suspicious events for review</p>
                      <p className="text-white/60 text-xs sm:text-sm">6 hours ago</p>
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