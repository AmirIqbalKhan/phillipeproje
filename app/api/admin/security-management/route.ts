import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Get recent sessions (login history)
  const sessions = await prisma.session.findMany({
    orderBy: { expires: 'desc' },
    take: 20,
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });
  // Get all users and their lock status (assume a 'locked' boolean field, if not present, all are unlocked)
  let users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: 'desc' },
  });
  // If 'locked' field does not exist, add locked: false to all
  users = users.map((u: any) => ({ ...u, locked: false }));
  return NextResponse.json({ sessions, users });
} 