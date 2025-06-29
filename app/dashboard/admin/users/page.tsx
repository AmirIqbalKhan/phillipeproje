"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error)
          else setUsers(data.users || [])
        })
        .catch(() => setError('Failed to load users.'))
        .finally(() => setLoading(false))
    }
  }, [status])

  const handleRoleChange = async (id: string, role: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    if (res.ok) {
      setUsers(users.map(u => (u.id === id ? { ...u, role } : u)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setUsers(users.filter(u => u.id !== id))
  }

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || session.user?.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : (
        <ul className="space-y-4">
          {users.length === 0 && <li className="text-center py-8">No users found.</li>}
          {users.map(user => (
            <li key={user.id} className="bg-white/10 p-4 rounded-lg flex justify-between items-center">
              <span>{user.name} ({user.email})</span>
              <div className="flex gap-2">
                <select
                  className="bg-black text-white border border-white/20 rounded px-2 py-1"
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="USER">User</option>
                  <option value="ORGANIZER">Organizer</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <button onClick={() => handleDelete(user.id)} className="px-4 py-1 bg-red-700 rounded hover:bg-red-800">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 