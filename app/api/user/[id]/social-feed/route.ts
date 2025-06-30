import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find all friend user IDs
    const friendships = await prisma.friendship.findMany({
      where: { userId: params.id },
      select: { friendId: true }
    })
    const friendIds = friendships.map((f: { friendId: string }) => f.friendId)
    if (friendIds.length === 0) {
      return NextResponse.json({ feed: [] })
    }
    // Find recent RSVPs from friends (limit 20, most recent first)
    const feed = await prisma.rSVP.findMany({
      where: { userId: { in: friendIds } },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        user: { select: { name: true, email: true, id: true } },
        event: { select: { name: true, date: true, location: true, id: true } }
      }
    })
    return NextResponse.json({ feed })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social feed' }, { status: 500 })
  }
} 