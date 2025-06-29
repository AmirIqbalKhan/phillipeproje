import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const events = await prisma.event.findMany({
      where: {
        organizerId: params.id
      },
      include: {
        organizer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
} 