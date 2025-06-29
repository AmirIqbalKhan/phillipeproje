"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li><a href="/dashboard/admin/users" className="underline hover:text-purple-400">Manage Users</a></li>
        <li><a href="/dashboard/admin/events" className="underline hover:text-purple-400">Manage Events</a></li>
        <li><a href="/dashboard/admin/moderation" className="underline hover:text-purple-400">Moderation Tools</a></li>
        <li><a href="/dashboard/admin/settings" className="underline hover:text-purple-400">Platform Settings</a></li>
      </ul>
    </div>
  )
} 