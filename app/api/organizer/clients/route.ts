import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const organizerId = searchParams.get('organizerId')
  if (!organizerId) {
    return NextResponse.json({ error: 'Missing organizerId' }, { status: 400 })
  }
  // Find all events for this organizer
  const events = await prisma.event.findMany({ where: { organizerId }, select: { id: true } })
  const eventIds = events.map((e: { id: string }) => e.id)
  if (eventIds.length === 0) return NextResponse.json({ clients: [] })
  // Find all RSVPs for these events, include user and event info
  const rsvps = await prisma.rSVP.findMany({
    where: { eventId: { in: eventIds } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      event: { select: { id: true, name: true, date: true } }
    }
  })
  // Group by user
  const clientsMap = new Map()
  rsvps.forEach((rsvp: any) => {
    if (!clientsMap.has(rsvp.userId)) {
      clientsMap.set(rsvp.userId, { user: rsvp.user, rsvps: [] })
    }
    clientsMap.get(rsvp.userId).rsvps.push({ event: rsvp.event, status: rsvp.status })
  })
  const clients = Array.from(clientsMap.values())
  return NextResponse.json({ clients })
} 