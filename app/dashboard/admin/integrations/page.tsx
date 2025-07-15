"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Home, RefreshCw, AlertTriangle, CheckCircle, Plus, Trash2, Edit, Key, Link2, Eye, Save, XCircle
} from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  API_KEY: 'API Key',
  WEBHOOK: 'Webhook',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
}

export default function AdminIntegrationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'API_KEY'|'WEBHOOK'>('API_KEY')
  const [editData, setEditData] = useState<any>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchIntegrations()
  }, [typeFilter, statusFilter])

  const fetchIntegrations = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (typeFilter !== 'ALL') params.append('type', typeFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      const res = await fetch(`/api/admin/integrations?${params.toString()}`)
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setApiKeys(data.apiKeys || [])
        setWebhooks(data.webhooks || [])
      }
    } catch (err) {
      setError('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (type: 'API_KEY'|'WEBHOOK', data: any = null) => {
    setModalType(type)
    setEditData(data || {})
    setEditingId(data?.id || null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditData({})
    setEditingId(null)
  }

  const handleChange = (key: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setActionLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const body = editingId
        ? { type: modalType, id: editingId, data: editData }
        : { type: modalType, data: editData }
      const res = await fetch('/api/admin/integrations', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setSuccess(editingId ? 'Updated successfully!' : 'Created successfully!')
        handleCloseModal()
        fetchIntegrations()
      }
    } catch (err) {
      setError('Failed to save integration')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (type: 'API_KEY'|'WEBHOOK', id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return
    setActionLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/integrations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setSuccess('Deleted successfully!')
        fetchIntegrations()
      }
    } catch (err) {
      setError('Failed to delete integration')
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
          <h1 className="text-3xl font-bold">Integrations</h1>
        </div>
        <button onClick={fetchIntegrations} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
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

      {/* Filters and Add Buttons */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Types</option>
          <option value="API_KEY">API Keys</option>
          <option value="WEBHOOK">Webhooks</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <button onClick={() => handleOpenModal('API_KEY')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all">
          <Key className="w-4 h-4" />
          Add API Key
        </button>
        <button onClick={() => handleOpenModal('WEBHOOK')} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-all">
          <Link2 className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {/* API Keys Table */}
      {typeFilter !== 'WEBHOOK' && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Key className="w-5 h-5" />API Keys</h2>
          <div className="bg-black/40 rounded-xl border border-white/20 overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-white/60">Loading API keys...</div>
            ) : apiKeys.length === 0 ? (
              <div className="p-8 text-center text-white/60">No API keys found.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-black/60 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Key</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Created</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="border-b border-white/10 hover:bg-black/20">
                      <td className="px-6 py-4">{key.name}</td>
                      <td className="px-6 py-4"><span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">{key.value}</span></td>
                      <td className="px-6 py-4">{STATUS_LABELS[key.status] || key.status}</td>
                      <td className="px-6 py-4">{key.createdAt ? new Date(key.createdAt).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenModal('API_KEY', key)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('API_KEY', key.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Webhooks Table */}
      {typeFilter !== 'API_KEY' && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Link2 className="w-5 h-5" />Webhooks</h2>
          <div className="bg-black/40 rounded-xl border border-white/20 overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-white/60">Loading webhooks...</div>
            ) : webhooks.length === 0 ? (
              <div className="p-8 text-center text-white/60">No webhooks found.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-black/60 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">URL</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Created</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map((wh) => (
                    <tr key={wh.id} className="border-b border-white/10 hover:bg-black/20">
                      <td className="px-6 py-4">{wh.name}</td>
                      <td className="px-6 py-4"><span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">{wh.url}</span></td>
                      <td className="px-6 py-4">{STATUS_LABELS[wh.status] || wh.status}</td>
                      <td className="px-6 py-4">{wh.createdAt ? new Date(wh.createdAt).toLocaleDateString() : ''}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenModal('WEBHOOK', wh)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete('WEBHOOK', wh.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit' : 'Add'} {TYPE_LABELS[modalType]}</h2>
              <button onClick={handleCloseModal} className="p-2 bg-white/10 rounded hover:bg-white/20 transition-all"><XCircle className="w-5 h-5 text-white" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleSave() }} className="space-y-4">
              <div>
                <label className="text-white/70 text-sm font-medium mb-1 block">Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full"
                  required
                />
              </div>
              {modalType === 'API_KEY' ? (
                <div>
                  <label className="text-white/70 text-sm font-medium mb-1 block">Key Value</label>
                  <input
                    type="text"
                    value={editData.value || ''}
                    onChange={e => handleChange('value', e.target.value)}
                    className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-white/70 text-sm font-medium mb-1 block">Webhook URL</label>
                  <input
                    type="url"
                    value={editData.url || ''}
                    onChange={e => handleChange('url', e.target.value)}
                    className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full"
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-white/70 text-sm font-medium mb-1 block">Status</label>
                <select
                  value={editData.status || 'ACTIVE'}
                  onChange={e => handleChange('status', e.target.value)}
                  className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 w-full"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 