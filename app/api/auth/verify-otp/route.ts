import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return NextResponse.json({ error: 'No OTP found for this user.' }, { status: 400 })
    }
    if (user.resetOtp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 })
    }
    if (user.resetOtpExpires < new Date()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 })
    }
    return NextResponse.json({ message: 'OTP verified.' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 })
  }
} 