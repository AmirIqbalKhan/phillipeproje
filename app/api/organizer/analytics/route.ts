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
  const events = await prisma.event.findMany({ where: { organizerId }, select: { id: true, name: true, date: true } })
  const eventIds = events.map((e: { id: string }) => e.id)
  if (eventIds.length === 0) return NextResponse.json({ totalEvents: 0, totalRsvps: 0, upcomingEvents: 0, avgRsvps: 0, topEvents: [] })
  // Total RSVPs
  const totalRsvps = await prisma.rSVP.count({ where: { eventId: { in: eventIds } } })
  // Upcoming events
  const now = new Date()
  const upcomingEvents = events.filter((e: { date: Date }) => new Date(e.date) > now).length
  // Average RSVPs per event
  const avgRsvps = totalRsvps / events.length
  // Top events by attendance
  const rsvpCounts = await prisma.rSVP.groupBy({
    by: ['eventId'],
    where: { eventId: { in: eventIds } },
    _count: { eventId: true }
  })
  const topEvents = rsvpCounts
    .sort((a: any, b: any) => b._count.eventId - a._count.eventId)
    .slice(0, 3)
    .map((rc: any) => {
      const event = events.find((e: { id: string }) => e.id === rc.eventId)
      return { name: event?.name, count: rc._count.eventId }
    })
  return NextResponse.json({ totalEvents: events.length, totalRsvps, upcomingEvents, avgRsvps, topEvents })
} 