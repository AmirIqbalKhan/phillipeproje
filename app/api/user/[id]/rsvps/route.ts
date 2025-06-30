import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find all RSVPs for the user, including event details
    const rsvps = await prisma.rSVP.findMany({
      where: {
        userId: params.id
      },
      include: {
        event: true
      }
    })
    return NextResponse.json({ rsvps })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch RSVPs' }, { status: 500 })
  }
} 