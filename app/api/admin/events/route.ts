import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET: List events with moderation status and history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const statusFilter = searchParams.get('status')

  if (eventId) {
    // Fetch single event with full details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        },
        moderationHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        featuredHistory: {
          orderBy: { featuredAt: 'desc' },
          take: 5
        },
        rsvps: {
          include: {
            user: { select: { name: true, email: true } }
          }
        }
      }
    })
    return NextResponse.json({ event })
  }

  // List events with filters
  const where: any = {}
  if (statusFilter && statusFilter !== 'ALL') {
    where.status = statusFilter
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      organizer: {
        select: { id: true, name: true, email: true, isVerified: true }
      },
      _count: {
        select: { rsvps: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json({ events })
}

// PUT: Update event (approve, reject, edit, feature, reschedule)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { 
    id, 
    status, 
    isFeatured, 
    name, 
    description, 
    date, 
    location, 
    price, 
    capacity,
    reason 
  } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 })
  }

  try {
    // Start transaction for event update and audit log
    const result = await prisma.$transaction(async (tx) => {
      // Update event
      const event = await tx.event.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(typeof isFeatured === 'boolean' && { isFeatured }),
          ...(name && { name }),
          ...(description && { description }),
          ...(date && { date: new Date(date) }),
          ...(location && { location }),
          ...(typeof price === 'number' && { price }),
          ...(typeof capacity === 'number' && { capacity })
        }
      })

      // Create audit log entry
      let action = 'UPDATED'
      if (status === 'APPROVED') action = 'APPROVED'
      else if (status === 'REJECTED') action = 'REJECTED'
      else if (typeof isFeatured === 'boolean') action = isFeatured ? 'FEATURED' : 'UNFEATURED'

      await tx.eventModerationHistory.create({
        data: {
          eventId: id,
          moderatorId: session.user?.id || '',
          action,
          reason: reason || null
        }
      })

      // Handle featuring/unfeaturing
      if (typeof isFeatured === 'boolean') {
        if (isFeatured) {
          await tx.eventFeaturedHistory.create({
            data: {
              eventId: id,
              featuredBy: session.user.id,
              reason: reason || null
            }
          })
        } else {
          await tx.eventFeaturedHistory.updateMany({
            where: { 
              eventId: id,
              unfeaturedAt: null
            },
            data: {
              unfeaturedAt: new Date(),
              reason: reason || null
            }
          })
        }
      }

      return event
    })

    return NextResponse.json({ event: result })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

// DELETE: Delete event
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, reason } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Create audit log before deletion
      await tx.eventModerationHistory.create({
        data: {
          eventId: id,
          moderatorId: session.user.id,
          action: 'DELETED',
          reason: reason || null
        }
      })

      // Delete the event
      await tx.event.delete({ where: { id } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}

// POST: Bulk actions (approve multiple, feature multiple, etc.)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { eventIds, action, reason } = await req.json()
  
  if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
    return NextResponse.json({ error: 'Missing event IDs' }, { status: 400 })
  }

  if (!action) {
    return NextResponse.json({ error: 'Missing action' }, { status: 400 })
  }

  try {
    const results = await prisma.$transaction(async (tx) => {
      const updates = []

      for (const eventId of eventIds) {
        let updateData: any = {}
        
        switch (action) {
          case 'APPROVE':
            updateData.status = 'APPROVED'
            break
          case 'REJECT':
            updateData.status = 'REJECTED'
            break
          case 'FEATURE':
            updateData.isFeatured = true
            break
          case 'UNFEATURE':
            updateData.isFeatured = false
            break
          case 'CANCEL':
            updateData.status = 'CANCELLED'
            break
          default:
            throw new Error(`Invalid action: ${action}`)
        }

        // Update event
        const event = await tx.event.update({
          where: { id: eventId },
          data: updateData
        })

        // Create audit log
        await tx.eventModerationHistory.create({
          data: {
            eventId,
            moderatorId: session.user.id,
            action,
            reason: reason || null
          }
        })

        // Handle featuring/unfeaturing
        if (action === 'FEATURE') {
          await tx.eventFeaturedHistory.create({
            data: {
              eventId,
              featuredBy: session.user.id,
              reason: reason || null
            }
          })
        } else if (action === 'UNFEATURE') {
          await tx.eventFeaturedHistory.updateMany({
            where: { 
              eventId,
              unfeaturedAt: null
            },
            data: {
              unfeaturedAt: new Date(),
              reason: reason || null
            }
          })
        }

        updates.push(event)
      }

      return updates
    })

    return NextResponse.json({ events: results })
  } catch (error) {
    console.error('Error performing bulk action:', error)
    return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 })
  }
} 