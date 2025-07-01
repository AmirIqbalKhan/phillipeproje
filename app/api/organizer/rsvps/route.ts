import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || (session.user.role !== 'ORGANIZER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Find all events owned by this organizer
  const events = await prisma.event.findMany({ where: { organizerId: session.user?.id || '' } })
  const eventIds = events.map((e: { id: string }) => e.id)
  // Find all RSVPs for these events
  const rsvps = await prisma.rSVP.findMany({
    where: { eventId: { in: eventIds } },
    include: { event: true, user: true },
  })
  return NextResponse.json({ rsvps })
} 