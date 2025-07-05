
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

// GET: Fetch all users with an employee role
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const staff = await prisma.user.findMany({
      where: {
        NOT: {
          employeeRole: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        employeeRole: {
          select: {
            role: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedStaff = staff.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.employeeRole?.role,
    }));

    return NextResponse.json({ staff: formattedStaff });
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// POST: Assign an employee role to a user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        employeeRole: {
          upsert: {
            create: { role: role, permissions: [] }, // Start with no permissions
            update: { role: role },
          },
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Failed to assign role:', error);
    return NextResponse.json({ error: 'Failed to assign role' }, { status: 500 });
  }
}

// DELETE: Remove an employee role from a user
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // We delete the EmployeeRole entry, which will cascade and set the relation on User to null.
    await prisma.employeeRole.delete({
      where: { userId: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove role:', error);
    return NextResponse.json({ error: 'Failed to remove role' }, { status: 500 });
  }
}
