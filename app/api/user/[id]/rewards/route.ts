import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

function generateReferralCode() {
  return nanoid(8)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user
    let user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        referredUsers: true,
        rewards: true
      }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // Auto-generate referral code if missing
    if (!user.referralCode) {
      const newCode = generateReferralCode()
      user = await prisma.user.update({
        where: { id: params.id },
        data: { referralCode: newCode },
        include: {
          referredUsers: true,
          rewards: true
        }
      })
    }
    return NextResponse.json({
      referralCode: user.referralCode,
      referredUsers: user.referredUsers,
      rewards: user.rewards
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
  }
} 