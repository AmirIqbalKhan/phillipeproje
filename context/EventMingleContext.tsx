"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

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

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Summer Music Festival',
      description: 'A three-day celebration of music featuring top artists from around the world.',
      date: '2024-07-15',
      time: '18:00',
      location: 'Central Park, New York',
      createdBy: '1'
    },
    {
      id: '2',
      name: 'Tech Startup Meetup',
      description: 'Network with fellow entrepreneurs and learn from successful startup founders.',
      date: '2024-06-20',
      time: '19:00',
      location: 'Innovation Hub, San Francisco',
      createdBy: '1'
    },
    {
      id: '3',
      name: 'Yoga in the Park',
      description: 'Join us for a relaxing morning yoga session in the beautiful park setting.',
      date: '2024-06-22',
      time: '08:00',
      location: 'Riverside Park, Los Angeles',
      createdBy: '1'
    }
  ])

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