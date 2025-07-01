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
    const settings = await prisma.platformSetting.findMany({
      orderBy: { category: 'asc' }
    });

    // Group settings by category
    const groupedSettings = settings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    }, {});

    return NextResponse.json({ settings: groupedSettings });
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

  if (!settings || !Array.isArray(settings)) {
    return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
  }

  try {
    const updatedSettings = await prisma.$transaction(async (tx) => {
      const results = [];
      
      for (const setting of settings) {
        const updated = await tx.platformSetting.upsert({
          where: { 
            key: setting.key 
          },
          update: {
            value: setting.value,
            updatedAt: new Date(),
            updatedBy: session.user?.id
          },
          create: {
            key: setting.key,
            value: setting.value,
            category: setting.category,
            description: setting.description,
            type: setting.type || 'STRING',
            isPublic: setting.isPublic || false,
            createdBy: session.user?.id
          }
        });
        results.push(updated);
      }
      
      return results;
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
    const defaultSettings = [
      // Financial Settings
      {
        key: 'commission_rate',
        value: '10',
        category: 'FINANCIAL',
        description: 'Platform commission rate (%)',
        type: 'NUMBER',
        isPublic: false
      },
      {
        key: 'minimum_payout',
        value: '50',
        category: 'FINANCIAL',
        description: 'Minimum payout amount ($)',
        type: 'NUMBER',
        isPublic: false
      },
      {
        key: 'payout_schedule',
        value: 'WEEKLY',
        category: 'FINANCIAL',
        description: 'Payout schedule (DAILY, WEEKLY, MONTHLY)',
        type: 'STRING',
        isPublic: false
      },
      {
        key: 'transaction_fee',
        value: '2.9',
        category: 'FINANCIAL',
        description: 'Transaction processing fee (%)',
        type: 'NUMBER',
        isPublic: false
      },

      // Email Settings
      {
        key: 'welcome_email_template',
        value: 'Welcome to EventMingle! We\'re excited to have you join our community.',
        category: 'EMAIL',
        description: 'Welcome email template',
        type: 'TEXT',
        isPublic: false
      },
      {
        key: 'event_reminder_template',
        value: 'Don\'t forget! Your event {event_name} is coming up on {event_date}.',
        category: 'EMAIL',
        description: 'Event reminder email template',
        type: 'TEXT',
        isPublic: false
      },
      {
        key: 'email_from_name',
        value: 'EventMingle',
        category: 'EMAIL',
        description: 'Default sender name for emails',
        type: 'STRING',
        isPublic: false
      },
      {
        key: 'email_from_address',
        value: 'noreply@eventmingle.com',
        category: 'EMAIL',
        description: 'Default sender email address',
        type: 'STRING',
        isPublic: false
      },

      // Security Settings
      {
        key: 'max_login_attempts',
        value: '5',
        category: 'SECURITY',
        description: 'Maximum login attempts before lockout',
        type: 'NUMBER',
        isPublic: false
      },
      {
        key: 'session_timeout',
        value: '24',
        category: 'SECURITY',
        description: 'Session timeout in hours',
        type: 'NUMBER',
        isPublic: false
      },
      {
        key: 'require_email_verification',
        value: 'true',
        category: 'SECURITY',
        description: 'Require email verification for new users',
        type: 'BOOLEAN',
        isPublic: false
      },
      {
        key: 'require_organizer_verification',
        value: 'true',
        category: 'SECURITY',
        description: 'Require verification for organizer accounts',
        type: 'BOOLEAN',
        isPublic: false
      },

      // Platform Settings
      {
        key: 'platform_name',
        value: 'EventMingle',
        category: 'PLATFORM',
        description: 'Platform name',
        type: 'STRING',
        isPublic: true
      },
      {
        key: 'platform_description',
        value: 'Connect, create, and celebrate events together',
        category: 'PLATFORM',
        description: 'Platform description',
        type: 'TEXT',
        isPublic: true
      },
      {
        key: 'maintenance_mode',
        value: 'false',
        category: 'PLATFORM',
        description: 'Enable maintenance mode',
        type: 'BOOLEAN',
        isPublic: false
      },
      {
        key: 'max_event_capacity',
        value: '10000',
        category: 'PLATFORM',
        description: 'Maximum event capacity',
        type: 'NUMBER',
        isPublic: false
      },
      {
        key: 'max_events_per_organizer',
        value: '50',
        category: 'PLATFORM',
        description: 'Maximum events per organizer',
        type: 'NUMBER',
        isPublic: false
      },

      // Notification Settings
      {
        key: 'email_notifications_enabled',
        value: 'true',
        category: 'NOTIFICATIONS',
        description: 'Enable email notifications',
        type: 'BOOLEAN',
        isPublic: false
      },
      {
        key: 'push_notifications_enabled',
        value: 'true',
        category: 'NOTIFICATIONS',
        description: 'Enable push notifications',
        type: 'BOOLEAN',
        isPublic: false
      },
      {
        key: 'event_approval_notifications',
        value: 'true',
        category: 'NOTIFICATIONS',
        description: 'Send notifications for event approvals',
        type: 'BOOLEAN',
        isPublic: false
      }
    ];

    const createdSettings = await prisma.$transaction(async (tx) => {
      const results = [];
      
      for (const setting of defaultSettings) {
        const created = await tx.platformSetting.upsert({
          where: { key: setting.key },
          update: {},
          create: {
            ...setting,
            createdBy: session.user?.id
          }
        });
        results.push(created);
      }
      
      return results;
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Default settings initialized',
      settings: createdSettings 
    });
  } catch (error) {
    console.error('Error initializing default settings:', error);
    return NextResponse.json({ error: 'Failed to initialize default settings' }, { status: 500 });
  }
} 