import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, name, interests, avatar } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        interests: interests || [],
        avatar: avatar || undefined,
      },
      select: { id: true, name: true, email: true, interests: true, avatar: true },
    });
    return NextResponse.json({ user: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
} 