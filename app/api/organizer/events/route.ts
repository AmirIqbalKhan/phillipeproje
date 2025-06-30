import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: session.user?.id
      },
      include: {
        organizer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, date, location, price, capacity, category, images, tags, isFeatured } = await request.json()
    
    const event = await prisma.event.create({
      data: {
        name,
        description,
        date: new Date(date),
        location,
        price: price || 0,
        capacity: capacity || 100,
        category: category || 'meetup',
        images: images || [],
        tags: tags || [],
        isFeatured: isFeatured || false,
        organizerId: session.user?.id as string
      },
      include: {
        organizer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({ event })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
} 