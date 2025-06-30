import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // For now, recommend the 5 most recent upcoming events
    const now = new Date()
    const recommendations = await prisma.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: 'asc' },
      take: 5
    })
    return NextResponse.json({ recommendations })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
} 