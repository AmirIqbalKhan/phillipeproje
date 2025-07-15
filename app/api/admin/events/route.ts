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
    const result = await prisma.$transaction(async (tx: any) => {
      // Update event
      let event = await tx.event.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(status === 'REJECTED' && { rejectionReason: reason }),
          ...(typeof isFeatured === 'boolean' && { isFeatured }),
          ...(name && { name }),
          ...(description && { description }),
          ...(date && { date: new Date(date) }),
          ...(location && { location }),
          ...(typeof price === 'number' && { price }),
          ...(typeof capacity === 'number' && { capacity })
        }
      })

      // If approving and event has no images, fetch Unsplash image
      if (status === 'APPROVED' && (!event.images || event.images.length === 0)) {
        let unsplashUrl = '';
        try {
          const query = encodeURIComponent(event.category || event.name || 'event');
          const res = await fetch(`https://source.unsplash.com/800x600/?${query}`);
          unsplashUrl = res.url;
        } catch (e) {
          unsplashUrl = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80'; // fallback
        }
        event = await tx.event.update({
          where: { id },
          data: { images: [unsplashUrl] },
        });
      }

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
              featuredBy: session.user?.id || '',
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

    // After transaction, send email if approved or rejected
    if (status === 'APPROVED') {
      const subject = 'Your event has been approved!';
      const html = `<p>Congratulations! Your event <b>${result.name}</b> has been approved and is now live on Event Mashups.</p>`;
      const text = `Congratulations! Your event ${result.name} has been approved and is now live on Event Mashups.`;
      await sendEventEmail(result.organizerEmail, subject, html, text);
    } else if (status === 'REJECTED') {
      const subject = 'Your event has been rejected';
      const html = `<p>We're sorry, but your event <b>${result.name}</b> was rejected for the following reason:</p><p><i>${reason}</i></p>`;
      const text = `We're sorry, but your event ${result.name} was rejected for the following reason: ${reason}`;
      await sendEventEmail(result.organizerEmail, subject, html, text);
    }

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
    await prisma.$transaction(async (tx: any) => {
      // Create audit log before deletion
      await tx.eventModerationHistory.create({
        data: {
          eventId: id,
          moderatorId: session.user?.id || '',
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
    const results = await prisma.$transaction(async (tx: any) => {
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
            moderatorId: session.user?.id || '',
            action,
            reason: reason || null
          }
        })

        // Handle featuring/unfeaturing
        if (action === 'FEATURE') {
          await tx.eventFeaturedHistory.create({
            data: {
              eventId,
              featuredBy: session.user?.id || '',
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

// Email sending logic (copied from resend/route.ts)
async function sendEventEmail(email: string, subject: string, html: string, text: string): Promise<void> {
  const RESEND_API_KEY = 're_bMRDW2sy_3fqo2Y1w6qmUnfmRpDJzUVrz';
  const FROM_EMAIL = 'noreply@eventmashups.com';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Failed to send email.');
  }
} 