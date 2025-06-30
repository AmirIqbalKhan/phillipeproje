'use client'

import { useState } from 'react'
import { Music, BookOpen, Users, Coffee, Camera, Gamepad2, Utensils, Palette, Zap, Building2 } from 'lucide-react'

const categories = [
  { 
    id: 'concert', 
    name: 'Concerts', 
    icon: Music, 
    color: 'from-purple-500/50 to-purple-600/50',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'workshop', 
    name: 'Workshops', 
    icon: BookOpen, 
    color: 'from-blue-500/50 to-blue-600/50',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'conference', 
    name: 'Conferences', 
    icon: Building2, 
    color: 'from-indigo-500/50 to-indigo-600/50',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'meetup', 
    name: 'Meetups', 
    icon: Users, 
    color: 'from-green-500/50 to-green-600/50',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'food', 
    name: 'Food & Drink', 
    icon: Utensils, 
    color: 'from-orange-500/50 to-orange-600/50',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'art', 
    name: 'Art & Culture', 
    icon: Palette, 
    color: 'from-pink-500/50 to-pink-600/50',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'technology', 
    name: 'Technology', 
    icon: Zap, 
    color: 'from-yellow-500/50 to-yellow-600/50',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: Gamepad2, 
    color: 'from-red-500/50 to-red-600/50',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    icon: Camera, 
    color: 'from-gray-500/50 to-gray-600/50',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'networking', 
    name: 'Networking', 
    icon: Coffee, 
    color: 'from-teal-500/50 to-teal-600/50',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
  },
]

interface CategoryFilterProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">Browse by Category</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 ${
                isSelected ? 'ring-2 sm:ring-4 ring-purple-400/50 shadow-xl sm:shadow-2xl' : 'hover:shadow-lg sm:hover:shadow-xl'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80'
                  }}
                />
                {/* Fade overlays */}
                <div className="absolute inset-0 image-fade-overlay"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60`}></div>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center p-3 sm:p-4 lg:p-6 h-full justify-center text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 backdrop-blur-sm ${
                  isSelected ? 'bg-white/30' : 'bg-white/20'
                } group-hover:bg-white/30 transition-all duration-300`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${
                    isSelected ? 'text-white' : 'text-white/90'
                  } group-hover:text-white transition-colors`} />
                </div>
                <span className={`font-semibold text-xs sm:text-sm lg:text-lg ${
                  isSelected ? 'text-white' : 'text-white/90'
                } group-hover:text-white transition-colors drop-shadow-lg leading-tight`}>
                  {category.name}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-3 lg:right-3 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          )
        })}
      </div>
    </div>
  )
} 