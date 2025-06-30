import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const apiKeys = await prisma.apiKey.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ apiKeys });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const key = randomBytes(32).toString('hex');
  const apiKey = await prisma.apiKey.create({ data: { key } });
  return NextResponse.json({ apiKey });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await prisma.apiKey.update({ where: { id }, data: { revoked: true } });
  return NextResponse.json({ success: true });
} 