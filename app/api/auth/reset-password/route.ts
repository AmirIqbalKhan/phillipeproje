import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json()
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.resetOtp || !user.resetOtpExpires) {
      return NextResponse.json({ error: 'No OTP request found for this user.' }, { status: 400 })
    }
    if (user.resetOtp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 })
    }
    if (user.resetOtpExpires < new Date()) {
      return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 })
    }
    const hashed = await hash(newPassword, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashed, resetOtp: null, resetOtpExpires: null }
    })
    return NextResponse.json({ message: 'Password reset successful.' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 })
  }
} 