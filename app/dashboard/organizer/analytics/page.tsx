import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Event Analytics</h1>
      {loading ? (
        <div>Loading analytics...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : stats ? (
        <div className="bg-white/10 p-8 rounded-lg space-y-4">
          <p className="text-xl">Total Events: <span className="font-bold text-purple-300">{stats.totalEvents}</span></p>
          <p className="text-xl">Total RSVPs: <span className="font-bold text-green-300">{stats.totalRsvps}</span></p>
          <p className="text-xl">Upcoming Events: <span className="font-bold text-yellow-300">{stats.upcomingEvents}</span></p>
        </div>
      ) : null}
    </div>
  )
} 