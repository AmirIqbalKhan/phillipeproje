import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendEmail(email: string, otp: string, type: 'reset' | 'verify') {
  let subject = '', html = '', text = ''
  if (type === 'reset') {
    subject = 'Your EventMingle Password Reset OTP'
    text = `Your OTP for password reset is: ${otp}`
    html = `<p>Your OTP for password reset is: <b>${otp}</b></p>`
  } else {
    subject = 'Your EventMingle Email Verification Code'
    text = `Your verification code is: ${otp}`
    html = `<p>Your verification code is: <b>${otp}</b></p>`
  }
  // Use Resend API
  const RESEND_API_KEY = 're_bMRDW2sy_3fqo2Y1w6qmUnfmRpDJzUVrz';
  const FROM_EMAIL = 'noreply@eventmingle.com';
  const response = await fetch('https://api.resend.com/emails', {
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
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Failed to send email.');
  }
}

// In-memory rate limit store (for demo; use Redis in production)
const lastOtpRequests: Record<string, number[]> = {}
const OTP_LIMIT = 5
const OTP_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: NextRequest) {
  try {
    const { email, type = 'reset' } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }
    if (type !== 'reset' && type !== 'verify') {
      return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
    }
    // Rate limiting
    const now = Date.now()
    if (!lastOtpRequests[email]) lastOtpRequests[email] = []
    lastOtpRequests[email] = lastOtpRequests[email].filter(ts => now - ts < OTP_WINDOW_MS)
    if (lastOtpRequests[email].length >= OTP_LIMIT) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }
    lastOtpRequests[email].push(now)
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
    if (!user) {
      return NextResponse.json({ error: 'No user found with that email.' }, { status: 404 })
    }
    const otp = generateOtp()
    const expires = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    await prisma.user.update({
      where: { email },
      data: { resetOtp: otp, resetOtpExpires: expires }
    })
    await sendEmail(email, otp, type)
    return NextResponse.json({ message: type === 'reset' ? 'OTP sent to your email.' : 'Verification code sent to your email.' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
} 