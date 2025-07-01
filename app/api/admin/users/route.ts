import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET: List users with login history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (userId) {
    // Fetch single user with login history
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        loginHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    })
    return NextResponse.json({ user })
  }
  // List all users (basic info)
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, isSuspended: true, isVerified: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ users })
}

// PUT: Update user (role, suspend/reactivate, verify organizer, edit KYC)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, role, suspend, reactivate, verify, kycInfo } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  let data: any = {}
  if (role) data.role = role.toUpperCase()
  if (typeof suspend === 'boolean') data.isSuspended = suspend
  if (typeof reactivate === 'boolean' && reactivate) data.isSuspended = false
  if (typeof verify === 'boolean') data.isVerified = verify
  if (kycInfo) data.kycInfo = kycInfo
  const user = await prisma.user.update({
    where: { id },
    data,
  })
  return NextResponse.json({ user })
}

// DELETE: Delete user
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// POST: Approve/reject organizer application
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, approve, reject } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  let data: any = {}
  if (approve) data.role = 'ORGANIZER'
  if (reject) data.role = 'USER'
  const user = await prisma.user.update({
    where: { id },
    data,
  })
  return NextResponse.json({ user })
} 