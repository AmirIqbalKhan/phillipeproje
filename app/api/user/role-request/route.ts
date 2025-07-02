import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { PrismaClient, Role, PromotionStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const { requestedRole } = await req.json()
  if (!requestedRole || !Object.values(Role).includes(requestedRole) || requestedRole === 'USER' || requestedRole === 'ADMIN') {
    return NextResponse.json({ error: 'Invalid role requested' }, { status: 400 })
  }
  // Check for existing pending request
  const existing = await prisma.rolePromotionRequest.findFirst({
    where: {
      userId: session.user.id,
      requestedRole,
      status: PromotionStatus.PENDING,
    },
  })
  if (existing) {
    return NextResponse.json({ error: 'A pending request for this role already exists.' }, { status: 409 })
  }
  // Create request
  const request = await prisma.rolePromotionRequest.create({
    data: {
      userId: session.user.id,
      requestedRole,
      status: PromotionStatus.PENDING,
    },
  })
  return NextResponse.json({ request })
} 