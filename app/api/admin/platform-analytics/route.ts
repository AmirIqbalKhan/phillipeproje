import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [userCount, eventCount, paymentStats, rsvpCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.payment.aggregate({
      _count: { id: true },
      _sum: { amount: true },
    }),
    prisma.rSVP.count(),
  ])

  return NextResponse.json({
    userCount,
    eventCount,
    paymentCount: paymentStats._count.id,
    paymentTotal: paymentStats._sum.amount || 0,
    rsvpCount,
  })
} 