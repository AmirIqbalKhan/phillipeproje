"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home, Shield, RefreshCw, AlertTriangle, CheckCircle, XCircle, User, FileText, MoreHorizontal, ArrowUpRight, Trash2, Users, MessageCircle, Eye, Edit, Send
} from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  IN_REVIEW: 'In Review',
  ACTIONED: 'Actioned',
  ESCALATED: 'Escalated',
  RESOLVED: 'Resolved',
}

const TYPE_LABELS: Record<string, string> = {
  EVENT: 'Event',
  POST: 'Post',
  COMMENT: 'Comment',
  USER: 'User',
  MEDIA: 'Media',
}

export default function AdminModerationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchReports()
  }, [statusFilter, typeFilter])

  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (typeFilter !== 'ALL') params.append('type', typeFilter)
      const res = await fetch(`/api/admin/moderation?${params.toString()}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else setReports(data.reports || [])
    } catch (err) {
      setError('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (reportId: string, action: string, extra: any = {}) => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, ...extra })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setSuccess('Action completed!')
        setSelectedReport(null)
        fetchReports()
      }
    } catch (err) {
      setError('Failed to perform action')
    } finally {
      setActionLoading(false)
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
          <h1 className="text-3xl font-bold">Moderation & Reports</h1>
        </div>
        <button onClick={fetchReports} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Error/Success Display */}
      {error && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">{success}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Status</option>
          {Object.keys(STATUS_LABELS).map(status => (
            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Types</option>
          {Object.keys(TYPE_LABELS).map(type => (
            <option key={type} value={type}>{TYPE_LABELS[type]}</option>
          ))}
        </select>
      </div>

      {/* Reports Table */}
      <div className="bg-black/40 rounded-xl border border-white/20 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-white/60">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-white/60">No reports found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-black/60 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Content</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Reporter</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Reason</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Assigned</th>
                <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-white/10 hover:bg-black/20">
                  <td className="px-6 py-4">
                    <span className="font-medium text-white">{TYPE_LABELS[report.type] || report.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    {report.event ? (
                      <span className="text-blue-400">Event: {report.event.name}</span>
                    ) : report.user ? (
                      <span className="text-green-400">User: {report.user.name}</span>
                    ) : report.post ? (
                      <span className="text-purple-400">Post</span>
                    ) : report.comment ? (
                      <span className="text-pink-400">Comment</span>
                    ) : report.media ? (
                      <span className="text-yellow-400">Media</span>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-white/60" />
                      <span className="text-white">{report.reporter?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80 text-sm">{report.reason}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'RESOLVED' ? 'bg-green-600/20 text-green-400' :
                      report.status === 'ESCALATED' ? 'bg-red-600/20 text-red-400' :
                      report.status === 'IN_REVIEW' ? 'bg-yellow-600/20 text-yellow-400' :
                      report.status === 'ACTIONED' ? 'bg-purple-600/20 text-purple-400' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {STATUS_LABELS[report.status] || report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white/80 text-sm">{report.assignedTo?.name || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'APPROVE')}
                        disabled={actionLoading}
                        className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-all"
                        title="Approve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'REJECT')}
                        disabled={actionLoading}
                        className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'ESCALATE')}
                        disabled={actionLoading}
                        className="p-2 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-all"
                        title="Escalate"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'DELETE_CONTENT')}
                        disabled={actionLoading}
                        className="p-2 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/30 transition-all"
                        title="Delete Content"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm">Type:</span> <span className="text-white font-medium">{TYPE_LABELS[selectedReport.type] || selectedReport.type}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Status:</span> <span className="text-white font-medium">{STATUS_LABELS[selectedReport.status] || selectedReport.status}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Reporter:</span> <span className="text-white font-medium">{selectedReport.reporter?.name}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Reason:</span> <span className="text-white font-medium">{selectedReport.reason}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Assigned To:</span> <span className="text-white font-medium">{selectedReport.assignedTo?.name || '-'}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Resolution:</span> <span className="text-white font-medium">{selectedReport.resolution || '-'}</span>
              </div>
              <div>
                <span className="text-white/60 text-sm">Created:</span> <span className="text-white font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
              {/* Audit Trail */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Audit Trail</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedReport.auditLogs && selectedReport.auditLogs.length > 0 ? (
                    selectedReport.auditLogs.map((log: any, idx: number) => (
                      <div key={idx} className="p-2 bg-black/20 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">{log.action}</span>
                          <span className="text-white/60 text-xs">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        {log.note && (
                          <p className="text-white/60 text-xs mt-1">{log.note}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-white/60 text-sm">No audit logs</p>
                  )}
                </div>
              </div>
              {/* Add Note */}
              <div className="mt-4">
                <label className="text-white/70 text-sm font-medium mb-1 block">Add Note</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 flex-1"
                  />
                  <button
                    onClick={() => { handleAction(selectedReport.id, 'ADD_NOTE', { note }); setNote('') }}
                    disabled={actionLoading || !note}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 