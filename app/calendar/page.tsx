"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { useEventMingle } from '@/context/EventMingleContext'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function getMonthDays(year: number, month: number) {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Loading...</div>
  }
  if (!session) {
    if (typeof window !== 'undefined') router.push('/login')
    return <div className="min-h-screen flex items-center justify-center text-white text-2xl">Redirecting to login...</div>
  }
  const { events } = useEventMingle()
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const days = getMonthDays(year, month)
  const firstDay = new Date(year, month, 1).getDay()
  const weeks = []
  let week: (Date | null)[] = Array(firstDay).fill(null)
  days.forEach((day) => {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)])

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1500&q=80"
          alt="Calendar background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Event Calendar
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Stay organized and never miss an event
          </p>
          
          {/* Calendar Interface */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="flex items-center justify-between w-full mb-6">
                <button onClick={prevMonth} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-white font-semibold transition-all">
                  ← Prev
                </button>
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  {today.toLocaleString('default', { month: 'long' })} {year}
                </span>
                <button onClick={nextMonth} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 text-white font-semibold transition-all">
                  Next →
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 w-full mb-6">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="text-center font-bold text-white/80 text-lg drop-shadow-lg">{d}</div>
                ))}
                {weeks.flat().map((day, i) => (
                  <div key={i} className="h-24 bg-white/10 rounded-lg p-2 relative border border-white/10">
                    {day && (
                      <>
                        <div className="font-bold text-white/90 drop-shadow-lg">{day.getDate()}</div>
                        <div className="absolute left-2 right-2 top-8 text-xs space-y-1">
                          {events.filter(e => e.date === day.toISOString().slice(0,10)).map(e => (
                            <div key={e.id} className="bg-purple-700/80 rounded px-2 py-1 mb-1 truncate drop-shadow-lg" title={e.name}>{e.name}</div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <a href="/create-event" className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all shadow-lg inline-block">
                  Add Event
                </a>
              </div>
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

      <div className="max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-xl p-8 mt-10 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6">My Event Calendar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-pink-100 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Sample Event 1</span>
            <span className="text-gray-500">April 20, 2024</span>
          </div>
          <div className="bg-yellow-100 rounded-xl p-6 shadow flex flex-col items-center">
            <span className="text-lg font-semibold mb-2">Sample Event 2</span>
            <span className="text-gray-500">May 5, 2024</span>
          </div>
        </div>
      </div>
    </div>
  )
} 