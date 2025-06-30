import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const eventId = params.id;
  if (!eventId) return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });

  // Find all users who RSVP'd to this event
  const rsvps = await prisma.rSVP.findMany({
    where: { eventId },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  // Also include the event organizer
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { organizer: { select: { id: true, name: true, email: true } } },
  });
  const participants = [
    ...(event?.organizer ? [event.organizer] : []),
    ...rsvps.map((rsvp: any) => rsvp.user),
  ].filter((user, idx, arr) => arr.findIndex(u => u.id === user.id) === idx); // unique by id

  return NextResponse.json({ participants });
} 