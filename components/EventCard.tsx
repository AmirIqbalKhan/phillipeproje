'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Clock, Heart, Share2 } from 'lucide-react'
import { format } from 'date-fns'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    location: string
    startDate: Date
    endDate: Date
    price: number
    capacity: number
    category: string
    organizer: {
      name: string
      avatar?: string
    }
    images: string[]
    tags: string[]
    isFeatured: boolean
  }
  onSave?: (eventId: string) => void
  onShare?: (eventId: string) => void
}

export default function EventCard({ event, onSave, onShare }: EventCardProps) {
  const isFree = event.price === 0
  
  // Use reliable Unsplash images based on category
  const getEventImage = (category: string) => {
    const images = {
      concert: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
      workshop: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      meetup: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      food: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
      art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?auto=format&fit=crop&w=600&q=80',
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=600&q=80',
      sports: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
      photography: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=600&q=80',
      networking: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
    }
    return images[category as keyof typeof images] || images.meetup
  }
  
  const imageUrl = getEventImage(event.category)
  
  return (
    <div className="card group hover:scale-105 transition-all duration-500 overflow-hidden">
      {/* Event Image with Fade Effects */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Fade overlays */}
        <div className="absolute inset-0 image-fade-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Featured badge */}
        {event.isFeatured && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <span className="badge-primary text-xs sm:text-sm">Featured</span>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onSave?.(event.id)}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={() => onShare?.(event.id)}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
        
        {/* Category badge */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
          <span className="badge-secondary capitalize text-xs sm:text-sm">{event.category}</span>
        </div>
      </div>
      
      {/* Event Content */}
      <div className="p-4 sm:p-6">
        {/* Event Title */}
        <Link href={`/event/${event.id}`}>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 hover:text-purple-300 transition-colors line-clamp-2">
            {event.title}
          </h3>
        </Link>
        
        {/* Event Description */}
        <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {event.description}
        </p>
        
        {/* Event Details */}
        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center text-xs sm:text-sm text-white/70">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-300 flex-shrink-0" />
            <span className="truncate">{format(event.startDate, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-white/70">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-pink-300 flex-shrink-0" />
            <span className="truncate">{format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-white/70">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-300 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-white/70">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-300 flex-shrink-0" />
            <span className="truncate">{event.capacity} spots available</span>
          </div>
        </div>
        
        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-white/10 backdrop-blur-sm text-white/80 px-2 py-1 rounded-full border border-white/20">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-lg sm:text-xl font-bold text-white">
            {isFree ? 'Free' : `$${event.price}`}
          </div>
          <Link
            href={`/event/${event.id}`}
            className="btn-primary text-xs sm:text-sm px-4 sm:px-6 py-2"
          >
            View Details
          </Link>
        </div>
        
        {/* Organizer */}
        <div className="pt-3 sm:pt-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 sm:mr-3 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs sm:text-sm">
                {event.organizer.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-white truncate">{event.organizer.name}</p>
              <p className="text-xs text-white/60">Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 