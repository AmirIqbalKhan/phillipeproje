import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Fetch platform settings
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.platformSetting.findFirst();

    if (!settings) {
      return NextResponse.json({ settings: null });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json({ error: 'Failed to fetch platform settings' }, { status: 500 });
  }
}

// PUT: Update platform settings
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { settings } = await req.json();

  if (!settings) {
    return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
  }

  try {
    const updatedSettings = await prisma.platformSetting.upsert({
      where: { id: 1 },
      update: {
        ...settings,
        updatedAt: new Date()
      },
      create: {
        id: 1,
        ...settings
      }
    });

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error('Error updating platform settings:', error);
    return NextResponse.json({ error: 'Failed to update platform settings' }, { status: 500 });
  }
}

// POST: Initialize default platform settings
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const defaultSettings = {
      branding: 'Event Mashups',
      terms: 'Default terms of service',
      pricing: 'Default pricing information',
      commissionRate: 0.10,
      currency: 'USD',
      timezone: 'UTC',
      emailTemplates: {
        welcome: 'Welcome to Event Mashups!',
        reminder: 'Don\'t forget your event!'
      },
      featureFlags: {
        socialFeatures: true,
        advancedAnalytics: false
      }
    };

    const settings = await prisma.platformSetting.upsert({
      where: { id: 1 },
      update: defaultSettings,
      create: {
        id: 1,
        ...defaultSettings
      }
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error initializing platform settings:', error);
    return NextResponse.json({ error: 'Failed to initialize platform settings' }, { status: 500 });
  }
} 