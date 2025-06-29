'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search, User, Calendar, MapPin } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

interface NavigationProps {
  showDashboard?: boolean
}

export default function Navigation({ showDashboard = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Inject Google Fonts for script logo
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <nav className="w-full flex justify-center mt-6 z-50">
      <div className="flex items-center px-10 py-2 rounded-full shadow-xl bg-white/20 backdrop-blur-lg border border-white/30"
        style={{ maxWidth: 1100, height: 72 }}>
        {/* Logo */}
        <Link href="/" className="mr-10 select-none flex items-center" style={{ fontFamily: 'Pacifico, cursive', fontSize: 32, color: 'white', letterSpacing: 1, lineHeight: 1 }}>
          Event&nbsp;Mingle
        </Link>
        {/* Nav Links */}
        <div className="flex gap-10 text-lg font-semibold text-white/90 items-center">
          <Link href="/discover" className="hover:text-white transition">Discover</Link>
          {showDashboard && (
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          )}
          <Link href="/chat" className="hover:text-white transition">Chat</Link>
          <Link href="/calendar" className="hover:text-white transition">Calendar</Link>
          <Link href="/profile" className="hover:text-white transition">Profile</Link>
        </div>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Auth Buttons/User Info */}
        {status === 'loading' ? (
          <div className="ml-10 text-white/80 animate-pulse">Loading...</div>
        ) : session ? (
          <div className="ml-10 flex items-center gap-4">
            <span className="text-white font-semibold">{session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-5 py-2 rounded-full bg-white text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40"
              style={{ minWidth: 90, height: 48 }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className="ml-4 px-7 py-2 rounded-full bg-white text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40 flex items-center justify-center" style={{ minWidth: 110, height: 48, textAlign: 'center', whiteSpace: 'nowrap' }}>
              Log In
            </Link>
            <Link href="/register" className="ml-4 px-7 py-2 rounded-full bg-white text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40 flex items-center justify-center" style={{ minWidth: 110, height: 48, textAlign: 'center', whiteSpace: 'nowrap' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
} 