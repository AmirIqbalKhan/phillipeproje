import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find all saved events for the user, including event details
    const savedEvents = await prisma.savedEvent.findMany({
      where: {
        userId: params.id
      },
      include: {
        event: true
      }
    })
    return NextResponse.json({ savedEvents })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch saved events' }, { status: 500 })
  }
} 