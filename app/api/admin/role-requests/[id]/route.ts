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
    // Send detailed congrats email
    await sendEmail(
      request.user.email,
      'Congratulations! Your role promotion was approved',
      `<p>Dear ${request.user.name},</p>
      <p>We are thrilled to inform you that your request to be promoted to <b>${request.requestedRole}</b> has been <b>approved</b>!</p>
      <p><b>What does this mean?</b><br/>
      You now have access to all the features and responsibilities associated with the <b>${request.requestedRole}</b> role on Event Mashups. Please log in to your dashboard to explore your new permissions and tools.</p>
      <p><b>Next Steps:</b><br/>
      - Review your new dashboard and available features.<br/>
      - If you have any questions or need onboarding help, please reply to this email or contact our support team at <a href="mailto:support@eventmashups.com">support@eventmashups.com</a>.<br/>
      - Check out our <a href="https://eventmashups.com/help">Help Center</a> for guides and resources.</p>
      <p>Once again, congratulations and welcome to your new role!</p>
      <p>Best regards,<br/>The Event Mashups Team</p>`,
      `Dear ${request.user.name},\n\nWe are thrilled to inform you that your request to be promoted to ${request.requestedRole} has been approved!\n\nWhat does this mean?\nYou now have access to all the features and responsibilities associated with the ${request.requestedRole} role on Event Mashups. Please log in to your dashboard to explore your new permissions and tools.\n\nNext Steps:\n- Review your new dashboard and available features.\n- If you have any questions or need onboarding help, please reply to this email or contact our support team at support@eventmashups.com.\n- Check out our Help Center at https://eventmashups.com/help for guides and resources.\n\nOnce again, congratulations and welcome to your new role!\n\nBest regards,\nThe Event Mashups Team`
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