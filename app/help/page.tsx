"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useState } from 'react'

const faqs = [
  { q: 'How do I create an event?', a: 'Go to the Create Event page, fill in the details, and submit. Your event will appear on the calendar and discover page.' },
  { q: 'How do I join a chat?', a: 'Visit the Chat page to join the group chat. Event-specific chats are coming soon!' },
  { q: 'Can I edit my profile?', a: 'Yes! Go to your Profile page to update your name and interests.' },
  { q: 'Is EventMingle free?', a: 'Yes, EventMingle is free to use for discovering and creating events.' },
  { q: 'How do I contact support?', a: 'Use the Contact page to send us a message. We usually reply within 24 hours.' },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=80"
          alt="Help background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Help & FAQ
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Find answers to common questions and get the support you need
          </p>
          
          {/* FAQ Section */}
          <div className="w-full max-w-2xl sm:max-w-3xl mx-auto px-4">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
                  <button 
                    onClick={() => setOpen(open === i ? null : i)} 
                    className="w-full text-left px-4 sm:px-6 lg:px-8 py-4 sm:py-6 font-semibold text-base sm:text-lg lg:text-xl focus:outline-none flex justify-between items-center text-white hover:bg-white/5 transition-all"
                  >
                    <span className="drop-shadow-lg pr-4">{faq.q}</span>
                    <span className="text-xl sm:text-2xl text-purple-300 drop-shadow-lg flex-shrink-0">{open === i ? '−' : '+'}</span>
                  </button>
                  {open === i && (
                    <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed drop-shadow-lg">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
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