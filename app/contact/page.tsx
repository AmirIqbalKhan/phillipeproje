"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) {
      setError('Please fill in all fields.')
      return
    }
    setSent(true)
    setError('')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1500&q=80"
          alt="Contact background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Contact Us
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Have a question, feedback, or partnership inquiry? We'd love to hear from you.
          </p>
          
          {/* Contact Form */}
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20 space-y-6">
              {error && <div className="text-red-400 font-bold mb-4 text-center drop-shadow-lg">{error}</div>}
              {sent ? (
                <div className="text-green-400 font-bold text-center text-xl drop-shadow-lg py-8">
                  Thank you! Your message has been sent.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Name</label>
                    <input 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                      placeholder="Your name" 
                    />
                  </div>
                  <div>
                    <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Email</label>
                    <input 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                      placeholder="you@email.com" 
                    />
                  </div>
                  <div>
                    <label className="block mb-3 font-semibold text-white text-lg drop-shadow-lg">Message</label>
                    <textarea 
                      value={message} 
                      onChange={e => setMessage(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm" 
                      rows={4} 
                      placeholder="How can we help?"
                    />
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold py-4 px-6 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-lg">
                    Send Message
                  </button>
                </>
              )}
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