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

    const { name, description, longDescription, date, location, address, price, capacity, category, images, tags, agenda, speakers, isFeatured, organizerEmail, organizerPhone, organizerDescription, startDate, endDate } = await request.json()
    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start date and end date are required.' }, { status: 400 })
    }

    let eventImages = images || [];
    if (!eventImages || eventImages.length === 0) {
      // Fetch Unsplash image based on category or name
      let unsplashUrl = '';
      try {
        const query = encodeURIComponent(category || name || 'event');
        const res = await fetch(`https://source.unsplash.com/800x600/?${query}`);
        unsplashUrl = res.url;
      } catch (e) {
        unsplashUrl = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'; // fallback
      }
      eventImages = [unsplashUrl];
    }
    
    const event = await prisma.event.create({
      data: {
        name,
        description,
        longDescription,
        date: new Date(date),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        address,
        price: price || 0,
        capacity: capacity || 100,
        category: category || 'meetup',
        images: eventImages,
        tags: tags || [],
        agenda: agenda || [],
        speakers: speakers || [],
        isFeatured: isFeatured || false,
        organizerId: session.user?.id as string,
        organizerEmail,
        organizerPhone,
        organizerDescription,
        status: 'PENDING_APPROVAL'
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