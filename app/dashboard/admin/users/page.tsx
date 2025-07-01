"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  MapPin,
  UserCheck,
  UserX,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Globe,
  Smartphone
} from 'lucide-react'

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.error) {
        setError(data.error)
      } else {
        setUsers(data.users || [])
      }
    } catch (err) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`)
      const data = await response.json()
      if (data.user) {
        setSelectedUser(data.user)
        setShowUserDetails(true)
      }
    } catch (err) {
      setError('Failed to load user details')
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role })
      })
      const data = await response.json()
      if (data.user) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: data.user.role } : u))
      }
    } catch (err) {
      setError('Failed to update user role')
    } finally {
      setUpdating(null)
    }
  }

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, suspend })
      })
      const data = await response.json()
      if (data.user) {
        setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: data.user.isSuspended } : u))
      }
    } catch (err) {
      setError('Failed to update user status')
    } finally {
      setUpdating(null)
    }
  }

  const handleVerifyOrganizer = async (userId: string, verify: boolean) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, verify })
      })
      const data = await response.json()
      if (data.user) {
        setUsers(users.map(u => u.id === userId ? { ...u, isVerified: data.user.isVerified } : u))
      }
    } catch (err) {
      setError('Failed to update verification status')
    } finally {
      setUpdating(null)
    }
  }

  const handleApproveOrganizer = async (userId: string, approve: boolean) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, approve, reject: !approve })
      })
      const data = await response.json()
      if (data.user) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: data.user.role } : u))
      }
    } catch (err) {
      setError('Failed to update organizer status')
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      })
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId))
      } else {
        setError('Failed to delete user')
      }
    } catch (err) {
      setError('Failed to delete user')
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'SUSPENDED' && user.isSuspended) ||
                         (statusFilter === 'ACTIVE' && !user.isSuspended)
    return matchesSearch && matchesRole && matchesStatus
  })

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
          <Link 
            href="/dashboard/admin" 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all border border-white/20"
          >
            <Home className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <button 
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ORGANIZER">Organizers</option>
            <option value="ADMIN">Admins</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-all">
            <Download className="w-4 h-4" />
            Export
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

      {/* Users List */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/60">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-white/60">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/60 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Verification</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-black/20">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-white/60 text-sm">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-600/20 text-red-400' :
                        user.role === 'ORGANIZER' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-green-600/20 text-green-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isSuspended ? (
                        <span className="flex items-center gap-1 text-red-400">
                          <UserX className="w-4 h-4" />
                          Suspended
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-400">
                          <UserCheck className="w-4 h-4" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'ORGANIZER' && (
                        user.isVerified ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400">
                            <AlertTriangle className="w-4 h-4" />
                            Pending
                          </span>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchUserDetails(user.id)}
                          className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Role Management */}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updating === user.id}
                          className="px-2 py-1 bg-black/60 border border-white/20 text-white rounded text-xs"
                        >
                          <option value="USER">User</option>
                          <option value="ORGANIZER">Organizer</option>
                          <option value="ADMIN">Admin</option>
                        </select>

                        {/* Organizer Approval */}
                        {user.role === 'ORGANIZER' && !user.isVerified && (
                          <button
                            onClick={() => handleVerifyOrganizer(user.id, true)}
                            disabled={updating === user.id}
                            className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-all"
                            title="Verify Organizer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Suspend/Reactivate */}
                        <button
                          onClick={() => handleSuspendUser(user.id, !user.isSuspended)}
                          disabled={updating === user.id}
                          className={`p-2 rounded transition-all ${
                            user.isSuspended 
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                              : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          }`}
                          title={user.isSuspended ? 'Reactivate' : 'Suspend'}
                        >
                          {user.isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={updating === user.id}
                          className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 bg-white/10 rounded hover:bg-white/20 transition-all"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-black/40 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-sm">Name</label>
                    <p className="text-white font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Email</label>
                    <p className="text-white font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Role</label>
                    <p className="text-white font-medium">{selectedUser.role}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Status</label>
                    <p className="text-white font-medium">
                      {selectedUser.isSuspended ? 'Suspended' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Login History */}
              {selectedUser.loginHistory && selectedUser.loginHistory.length > 0 && (
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Login History</h3>
                  <div className="space-y-3">
                    {selectedUser.loginHistory.map((login: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${login.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div>
                            <p className="text-white text-sm">{login.ipAddress}</p>
                            <p className="text-white/60 text-xs">{login.userAgent}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 text-xs">
                            {new Date(login.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-white/60 text-xs">
                            {new Date(login.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Verification */}
              {selectedUser.role === 'ORGANIZER' && (
                <div className="bg-black/40 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Organizer Verification</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.isVerified 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {selectedUser.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                    {!selectedUser.isVerified && (
                      <button
                        onClick={() => handleVerifyOrganizer(selectedUser.id, true)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all"
                      >
                        Verify Organizer
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 