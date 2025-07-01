"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home, BarChart3, Users, Calendar, DollarSign, TrendingUp, MapPin, Download, RefreshCw, AlertTriangle
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<any>({})
  const [dateRange, setDateRange] = useState<'7d'|'30d'|'90d'|'1y'>('30d')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/platform-analytics?type=overview&period=${dateRange}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else setAnalytics(data.overview || {})
    } catch (err) {
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/platform-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user_report', format: 'csv' })
      })
      const data = await res.json()
      if (data.success && data.data) {
        const blob = new Blob([data.data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = data.filename || `analytics_report.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (err) {
      setError('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Loading...</div>
  }
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-xl sm:text-2xl">Redirecting...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin" className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20">
            <Home className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">Platform Analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchAnalytics} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button onClick={exportReport} disabled={exporting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
            <Download className="w-4 h-4" />
            Export Users
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="mb-6 flex gap-2">
        {['7d','30d','90d','1y'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range as any)}
            className={`px-4 py-2 rounded-lg border border-white/20 transition-all ${dateRange === range ? 'bg-blue-600 text-white' : 'bg-black/40 text-white/60 hover:bg-black/60'}`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">Total Users</h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalUsers?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">New Users</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.newUsers?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">Total Events</h3>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalEvents?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">Active Events</h3>
            <BarChart3 className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.activeEvents?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">Total Revenue</h3>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${analytics.totalRevenue?.toLocaleString() || '0'}</p>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 text-sm">Total RSVPs</h3>
            <Calendar className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics.totalRSVPs?.toLocaleString() || '0'}</p>
        </div>
      </div>

      {/* Trend Charts (placeholder, can be replaced with chart library) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
          <div className="h-32 flex items-end gap-1">
            {analytics.userGrowth?.map((u: any, i: number) => (
              <div key={i} className="bg-blue-500/60" style={{ height: `${10 + (u._count.id || 0) * 2}px`, width: '4px' }} title={u._count.id}></div>
            ))}
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Event Growth</h3>
          <div className="h-32 flex items-end gap-1">
            {analytics.eventGrowth?.map((e: any, i: number) => (
              <div key={i} className="bg-purple-500/60" style={{ height: `${10 + (e._count.id || 0) * 2}px`, width: '4px' }} title={e._count.id}></div>
            ))}
          </div>
        </div>
        <div className="bg-black/40 rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Growth</h3>
          <div className="h-32 flex items-end gap-1">
            {analytics.revenueGrowth?.map((r: any, i: number) => (
              <div key={i} className="bg-green-500/60" style={{ height: `${10 + (r.amount || 0) / 100}px`, width: '4px' }} title={r.amount}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic and Demographic (placeholder) */}
      <div className="bg-black/40 rounded-lg p-6 border border-white/20 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Geographic & Demographic Insights</h3>
        <div className="text-white/60">(Coming soon: Map and demographic breakdowns)</div>
      </div>
    </div>
  )
} 