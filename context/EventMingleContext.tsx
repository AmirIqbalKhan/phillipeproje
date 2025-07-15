"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// Types
interface User {
  id: string
  name: string
  email: string
  interests: string[]
  role: 'user' | 'organizer' | 'admin'
}

interface Event {
  id: string
  name: string
  description: string
  date: string
  time: string
  location: string
  createdBy: string
}

interface ChatMessage {
  id: string
  user: string
  text: string
  timestamp: number
}

interface EventMashupsContextType {
  user: User
  setUser: (user: User) => void
  events: Event[]
  addEvent: (event: Event) => void
  chatMessages: ChatMessage[]
  sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
}

const EventMashupsContext = createContext<EventMashupsContextType | undefined>(undefined)

export function EventMashupsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    interests: ['music', 'technology', 'food'],
    role: 'user'
  })

  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []))
      .catch(() => setEvents([]));
  }, []);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'Alice',
      text: 'Hey everyone! Anyone going to the music festival this weekend?',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      user: 'Bob',
      text: 'I am! Looking forward to it. What time are you planning to arrive?',
      timestamp: Date.now() - 1800000
    },
    {
      id: '3',
      user: 'Charlie',
      text: 'I\'ll be there around 6 PM. Should be a great show!',
      timestamp: Date.now() - 900000
    }
  ])

  function addEvent(event: Event) {
    setEvents(prev => [...prev, event])
  }

  function sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now()
    }
    setChatMessages(prev => [...prev, newMessage])
  }

  const value: EventMashupsContextType = {
    user,
    setUser,
    events,
    addEvent,
    chatMessages,
    sendMessage
  }

  return (
    <EventMashupsContext.Provider value={value}>
      {children}
    </EventMashupsContext.Provider>
  )
}

export function useEventMashups() {
  const context = useContext(EventMashupsContext)
  if (context === undefined) {
    throw new Error('useEventMashups must be used within an EventMashupsProvider')
  }
  return context
} 