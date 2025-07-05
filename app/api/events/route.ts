import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Force dynamic rendering to avoid static generation issues
    const dynamic = 'force-dynamic'
    
    const where: any = {
      date: {
        gte: new Date() // Only upcoming events
      }
    }
    
    if (category && category !== 'all') {
      // Note: category field doesn't exist in current schema, so we'll filter by name for now
      where.name = {
        contains: category,
        mode: 'insensitive'
      }
    }
    
    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: limit,
      skip: (page - 1) * limit
    })
    
    // Transform events to match the expected format in EventCard component
    const transformedEvents = events.map((event: any) => ({
      id: event.id,
      title: event.name,
      description: event.description,
      location: event.location,
      startDate: event.date ? new Date(event.date) : new Date(), // Ensure it's a Date object, fallback to current date
      endDate: event.date ? new Date(event.date.getTime() + 2 * 60 * 60 * 1000) : new Date(), // Ensure it's a Date object, fallback to current date
      price: event.price || 0,
      capacity: event.capacity || 100,
      category: event.category || 'meetup',
      organizer: {
        name: event.organizer.name,
        avatar: undefined
      },
      images: event.images && event.images.length > 0 ? event.images : [
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80'
      ],
      tags: event.tags && event.tags.length > 0 ? event.tags : ['event', 'meetup'],
      isFeatured: event.isFeatured || false
    }))
    
    return NextResponse.json({ events: transformedEvents })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
} 