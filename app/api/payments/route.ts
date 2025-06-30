import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user?.id;
  const role = session.user?.role?.toLowerCase();
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const filterUserId = searchParams.get('userId');

  let where: any = {};
  if (role === 'user') {
    where.userId = userId;
  } else if (role === 'organizer') {
    if (eventId) where.eventId = eventId;
    else {
      // Find events organized by this user
      const events = await prisma.event.findMany({ where: { organizerId: userId }, select: { id: true } });
      where.eventId = { in: events.map((e: any) => e.id) };
    }
    if (filterUserId) where.userId = filterUserId;
  } else if (role === 'admin') {
    if (eventId) where.eventId = eventId;
    if (filterUserId) where.userId = filterUserId;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      event: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ payments });
} 