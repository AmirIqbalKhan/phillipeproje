import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id;
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { name, email, password: '', role: 'USER' } });
    }

    // Check for existing RSVP
    const existing = await prisma.rSVP.findFirst({ where: { userId: user.id, eventId } });
    if (existing) {
      return NextResponse.json({ message: 'You have already registered for this event.' }, { status: 200 });
    }

    // Create RSVP
    await prisma.rSVP.create({
      data: {
        userId: user.id,
        eventId,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json({ message: 'Registration successful!' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 });
  }
} 