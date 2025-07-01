"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Home, Settings, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  FINANCIAL: 'Financial',
  EMAIL: 'Email',
  SECURITY: 'Security',
  PLATFORM: 'Platform',
  NOTIFICATIONS: 'Notifications',
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<any>({})
  const [edited, setEdited] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/platform-settings')
      const data = await res.json()
      if (data.error) setError(data.error)
      else setSettings(data.settings || {})
    } catch (err) {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (key: string, value: string) => {
    setEdited((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const allSettings = Object.values(settings).flat()
      const updated = allSettings.map((s: any) =>
        edited[s.key] !== undefined ? { ...s, value: edited[s.key] } : s
      )
      const res = await fetch('/api/admin/platform-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updated })
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else {
        setSuccess('Settings saved successfully!')
        setEdited({})
        fetchSettings()
      }
    } catch (err) {
      setError('Failed to save settings')
    } finally {
      setSaving(false)
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
          <h1 className="text-3xl font-bold">Platform Settings</h1>
        </div>
        <button onClick={fetchSettings} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all">
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

      {/* Settings Form */}
      {loading ? (
        <div className="text-white/60 text-center py-12">Loading settings...</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); handleSave() }}>
          <div className="space-y-10">
            {Object.keys(settings).map(category => (
              <div key={category} className="bg-black/40 rounded-xl border border-white/20 p-6">
                <h2 className="text-xl font-bold text-white mb-4">{CATEGORY_LABELS[category] || category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings[category].map((setting: any) => (
                    <div key={setting.key} className="flex flex-col gap-2">
                      <label className="text-white/70 text-sm font-medium" htmlFor={setting.key}>{setting.description || setting.key}</label>
                      {setting.type === 'BOOLEAN' ? (
                        <select
                          id={setting.key}
                          value={edited[setting.key] !== undefined ? edited[setting.key] : setting.value}
                          onChange={e => handleEdit(setting.key, e.target.value)}
                          className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : setting.type === 'TEXT' ? (
                        <textarea
                          id={setting.key}
                          value={edited[setting.key] !== undefined ? edited[setting.key] : setting.value}
                          onChange={e => handleEdit(setting.key, e.target.value)}
                          className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[60px]"
                        />
                      ) : (
                        <input
                          id={setting.key}
                          type={setting.type === 'NUMBER' ? 'number' : 'text'}
                          value={edited[setting.key] !== undefined ? edited[setting.key] : setting.value}
                          onChange={e => handleEdit(setting.key, e.target.value)}
                          className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 