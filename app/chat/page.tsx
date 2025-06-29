"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMingle } from '@/context/EventMingleContext'
import { useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ChatPage() {
  const { user, chatMessages, sendMessage } = useEventMingle()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const value = inputRef.current?.value.trim()
    if (value) {
      sendMessage({ user: user.name, text: value })
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=80"
          alt="Chat background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Real-Time Chat
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Connect with event-goers in real-time conversations
          </p>
          
          {/* Chat Interface */}
          <div className="max-w-2xl mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mt-10 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-6">Event Chat</h2>
            <div className="h-64 overflow-y-auto mb-4 bg-gray-100 rounded-xl p-4 flex flex-col gap-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="mb-4 flex flex-col">
                  <span className="text-sm text-purple-300 font-bold drop-shadow-lg">{msg.user}</span>
                  <span className="text-white/90 text-base drop-shadow-lg">{msg.text}</span>
                  <span className="text-xs text-white/40 self-end drop-shadow-lg">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                ref={inputRef}
                className="flex-1 rounded-full border px-4 py-2"
                placeholder="Type your message..."
                autoComplete="off"
              />
              <button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white rounded-full px-6 py-2 font-bold">Send</button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      
      {/* Footer with top blend */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
        <Footer />
      </div>
    </div>
  )
} 