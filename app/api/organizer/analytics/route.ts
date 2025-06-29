import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user.role !== 'ORGANIZER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const events = await prisma.event.findMany({ where: { organizerId: session.user.id } })
  const eventIds = events.map((e: { id: string }) => e.id)
  const totalEvents = events.length
  const totalRsvps = await prisma.rSVP.count({ where: { eventId: { in: eventIds } } })
  const upcomingEvents = events.filter((e: { date: string }) => new Date(e.date) > new Date()).length
  return NextResponse.json({ totalEvents, totalRsvps, upcomingEvents })
} 