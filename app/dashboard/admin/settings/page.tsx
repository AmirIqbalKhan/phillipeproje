import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    if (typeof window !== 'undefined') router.push('/dashboard')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting...</div>
  }
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Platform Settings</h1>
      <div className="bg-white/10 p-8 rounded-lg">
        <p className="text-xl">Placeholder for platform settings (roles, permissions, etc.)</p>
      </div>
    </div>
  )
} 