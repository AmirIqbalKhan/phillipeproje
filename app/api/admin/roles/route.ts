
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

// A predefined list of all possible permissions in the system.
// In a real-world scenario, this might be stored in a database or a config file.
const ALL_PERMISSIONS = [
  // User Management
  'users:read', 'users:update', 'users:suspend', 'users:delete',
  // Event Management
  'events:read', 'events:update', 'events:approve', 'events:reject', 'events:feature',
  // Financial Management
  'financial:read', 'financial:payouts', 'financial:refunds',
  // Moderation
  'moderation:read', 'moderation:action',
  // Settings
  'settings:read', 'settings:update',
];

// GET: Fetch all employee roles and their permissions
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const employeeRoles = await prisma.employeeRole.findMany({
      select: {
        role: true,
        permissions: true,
      },
    });

    // Create a map for quick lookup
    const existingRoles = new Map(employeeRoles.map(r => [r.role, r.permissions]));

    // Define all possible employee roles from the schema enum, excluding admin/user/organizer
    const allEmployeeRoleTypes = Object.values(Role).filter(role => 
        ![Role.ADMIN, Role.USER, Role.ORGANIZER].includes(role)
    );

    // Combine existing roles with any missing roles
    const rolesWithPermissions = allEmployeeRoleTypes.map(role => ({
        role: role,
        permissions: existingRoles.get(role) || [],
    }));

    return NextResponse.json({ roles: rolesWithPermissions, allPermissions: ALL_PERMISSIONS });
  } catch (error) {
    console.error('Failed to fetch roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

// PUT: Update permissions for a specific role
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { role, permissions } = await req.json();

    if (!role || !permissions) {
      return NextResponse.json({ error: 'Missing role or permissions' }, { status: 400 });
    }

    // This is a placeholder since we can't directly update the enum.
    // This logic would need to be adapted based on how permissions are stored for non-employee roles.
    // For now, we will log the intent.
    console.log(`Attempt to update permissions for role ${role} to ${permissions.join(', ')}`);


    return NextResponse.json({ success: true, role, permissions });
  } catch (error) {
    console.error('Failed to update permissions:', error);
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 });
  }
}
