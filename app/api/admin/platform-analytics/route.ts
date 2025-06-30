import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  // Total users
  const totalUsers = await prisma.user.count()
  // Total events
  const totalEvents = await prisma.event.count()
  // Total RSVPs
  const totalRsvps = await prisma.rSVP.count()
  // Total payments
  const totalPayments = await prisma.payment.count()
  // Top events by attendance
  const rsvpCounts = await prisma.rSVP.groupBy({
    by: ['eventId'],
    _count: { eventId: true }
  })
  const events = await prisma.event.findMany({ select: { id: true, name: true } })
  const topEvents = rsvpCounts
    .sort((a: any, b: any) => b._count.eventId - a._count.eventId)
    .slice(0, 5)
    .map((rc: any) => {
      const event = events.find((e: any) => e.id === rc.eventId)
      return { name: event?.name, count: rc._count.eventId }
    })
  return NextResponse.json({ totalUsers, totalEvents, totalRsvps, totalPayments, topEvents })
} 