'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const navLinks = [
  { href: '/discover', label: 'Discover' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'Chat' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/profile', label: 'Profile' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navElement = document.querySelector('nav');
      if (isMenuOpen && navElement && !navElement.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <nav className="w-full flex justify-center mt-2 sm:mt-4 md:mt-6 z-50 px-4">
      <div className="flex items-center px-4 sm:px-6 md:px-10 py-2 rounded-full shadow-xl bg-white/20 backdrop-blur-lg border border-white/30 w-full max-w-6xl"
        style={{ height: 'auto', minHeight: 56 }}>
        {/* Logo */}
        <Link href="/" className="mr-4 sm:mr-6 md:mr-10 select-none flex items-center gap-2" style={{ fontFamily: 'Pacifico, cursive', fontSize: 'clamp(20px, 4vw, 32px)', color: 'white', letterSpacing: 1, lineHeight: 1 }}>
          <Image src="/logo.png" alt="Event Mingle Logo" width={40} height={40} priority className="rounded-full bg-white p-1 shadow-md" />
          <span className="hidden sm:inline">Event&nbsp;Mingle</span>
          <span className="sm:hidden">EM</span>
        </Link>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex gap-6 lg:gap-10 text-base lg:text-lg font-semibold text-white/90 items-center">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="hover:text-white transition whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Desktop Auth Buttons/User Info */}
        <div className="hidden md:flex items-center gap-4">
          {status === 'loading' ? (
            <div className="text-white/80 animate-pulse">Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold text-sm lg:text-base truncate max-w-32">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 lg:px-5 py-2 rounded-full bg-white text-sm lg:text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40 whitespace-nowrap"
                style={{ minWidth: 80, height: 40 }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="px-4 lg:px-7 py-2 rounded-full bg-white text-sm lg:text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40 flex items-center justify-center whitespace-nowrap" style={{ minWidth: 90, height: 40 }}>
                Log In
              </Link>
              <Link href="/register" className="ml-2 lg:ml-4 px-4 lg:px-7 py-2 rounded-full bg-white text-sm lg:text-lg font-semibold text-gray-800 shadow hover:bg-gray-100 transition-all border border-white/40 flex items-center justify-center whitespace-nowrap" style={{ minWidth: 90, height: 40 }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          <div className="p-4 space-y-3">
            {/* Mobile Nav Links */}
            <div className="space-y-2">
              {navLinks.map(link => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="block px-4 py-3 text-gray-800 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth/User Info */}
            <div className="border-t border-gray-200 pt-3">
              {status === 'loading' ? (
                <div className="px-4 py-3 text-gray-600 animate-pulse">Loading...</div>
              ) : session ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-gray-800 font-semibold">
                    {session.user?.name || session.user?.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' })
                      setIsMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/login" 
                    className="block px-4 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 