import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function sendEmail(email: string, subject: string, html: string, text: string) {
  // Use Resend API or your preferred email service
  const RESEND_API_KEY = 're_bMRDW2sy_3fqo2Y1w6qmUnfmRpDJzUVrz';
  const FROM_EMAIL = 'noreply@eventmashups.com';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
    }),
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { action } = await req.json()
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
  const request = await prisma.rolePromotionRequest.findUnique({
    where: { id: params.id },
    include: { user: true },
  })
  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }
  if (request.status !== 'PENDING') {
    return NextResponse.json({ error: 'Request already processed' }, { status: 400 })
  }
  if (action === 'approve') {
    await prisma.user.update({
      where: { id: request.userId },
      data: { role: request.requestedRole },
    })
    await prisma.rolePromotionRequest.update({
      where: { id: params.id },
      data: { status: 'APPROVED' },
    })
    // Send congrats email
    await sendEmail(
      request.user.email,
      'Congratulations! Your role promotion was approved',
      `<p>Dear ${request.user.name},<br/>Congratulations! Your request to become a <b>${request.requestedRole}</b> has been approved. Welcome to your new role!</p>`,
      `Dear ${request.user.name},\nCongratulations! Your request to become a ${request.requestedRole} has been approved. Welcome to your new role!`
    )
    return NextResponse.json({ message: 'Request approved and user promoted.' })
  } else {
    await prisma.rolePromotionRequest.update({
      where: { id: params.id },
      data: { status: 'REJECTED' },
    })
    // Send rejection email
    await sendEmail(
      request.user.email,
      'Role Promotion Request Rejected',
      `<p>Dear ${request.user.name},<br/>We regret to inform you that your request to become a <b>${request.requestedRole}</b> was not approved at this time. You may try again later.</p>`,
      `Dear ${request.user.name},\nWe regret to inform you that your request to become a ${request.requestedRole} was not approved at this time. You may try again later.`
    )
    return NextResponse.json({ message: 'Request rejected and user notified.' })
  }
} 