import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/chat/messages?eventId=... or ?userId=...
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get('eventId');
  const userId = searchParams.get('userId');
  const currentUserId = session.user?.id;

  if (eventId) {
    // Fetch messages for an event
    const messages = await prisma.message.findMany({
      where: { eventId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(messages);
  } else if (userId) {
    // Fetch direct messages between current user and userId
    const messages = await prisma.message.findMany({
      where: {
        eventId: null,
        OR: [
          { userId: currentUserId },
          { userId },
        ],
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(messages);
  } else {
    return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
  }
}

// POST /api/chat/messages
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const currentUserId = session.user?.id;
  const { text, eventId, recipientId } = await req.json();
  if (!text || (!eventId && !recipientId)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!currentUserId) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  }
  let message;
  if (eventId) {
    // Send message to event chat
    message = await prisma.message.create({
      data: {
        text,
        userId: currentUserId,
        eventId,
      },
    });
  } else if (recipientId) {
    // Send direct message (eventId is null)
    message = await prisma.message.create({
      data: {
        text,
        userId: currentUserId,
        eventId: null,
      },
    });
  }
  return NextResponse.json(message);
} 