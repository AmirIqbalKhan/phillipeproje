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
  const webhooks = await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { url, event } = await req.json();
  if (!url || !event) {
    return NextResponse.json({ error: 'Missing url or event' }, { status: 400 });
  }
  const secret = randomBytes(32).toString('hex');
  const webhook = await prisma.webhook.create({ 
    data: { 
      url, 
      event,
      secret
    } 
  });
  return NextResponse.json({ webhook });
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
  await prisma.webhook.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 