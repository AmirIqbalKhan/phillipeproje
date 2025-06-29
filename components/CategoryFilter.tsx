'use client'

import { useState } from 'react'
import { Music, BookOpen, Users, Coffee, Camera, Gamepad2, Utensils, Palette, Zap, Building2 } from 'lucide-react'

const categories = [
  { 
    id: 'concert', 
    name: 'Concerts', 
    icon: Music, 
    color: 'from-purple-500/50 to-purple-600/50',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'workshop', 
    name: 'Workshops', 
    icon: BookOpen, 
    color: 'from-blue-500/50 to-blue-600/50',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'conference', 
    name: 'Conferences', 
    icon: Building2, 
    color: 'from-indigo-500/50 to-indigo-600/50',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'meetup', 
    name: 'Meetups', 
    icon: Users, 
    color: 'from-green-500/50 to-green-600/50',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'food', 
    name: 'Food & Drink', 
    icon: Utensils, 
    color: 'from-orange-500/50 to-orange-600/50',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'art', 
    name: 'Art & Culture', 
    icon: Palette, 
    color: 'from-pink-500/50 to-pink-600/50',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'technology', 
    name: 'Technology', 
    icon: Zap, 
    color: 'from-yellow-500/50 to-yellow-600/50',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: Gamepad2, 
    color: 'from-red-500/50 to-red-600/50',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'photography', 
    name: 'Photography', 
    icon: Camera, 
    color: 'from-gray-500/50 to-gray-600/50',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'networking', 
    name: 'Networking', 
    icon: Coffee, 
    color: 'from-teal-500/50 to-teal-600/50',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
]

interface CategoryFilterProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="section-glass p-8">
      <h3 className="text-2xl font-bold text-white mb-8 text-center">Browse by Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          const isSelected = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-110 ${
                isSelected ? 'ring-4 ring-purple-400/50 shadow-2xl' : 'hover:shadow-xl'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                {/* Fade overlays */}
                <div className="absolute inset-0 image-fade-overlay"></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-60`}></div>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center p-6 h-full justify-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm ${
                  isSelected ? 'bg-white/30' : 'bg-white/20'
                } group-hover:bg-white/30 transition-all duration-300`}>
                  <Icon className={`w-8 h-8 ${
                    isSelected ? 'text-white' : 'text-white/90'
                  } group-hover:text-white transition-colors`} />
                </div>
                <span className={`font-semibold text-lg ${
                  isSelected ? 'text-white' : 'text-white/90'
                } group-hover:text-white transition-colors drop-shadow-lg`}>
                  {category.name}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
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