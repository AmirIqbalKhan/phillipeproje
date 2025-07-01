import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET: Fetch and filter moderation reports
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') // NEW, IN_REVIEW, ACTIONED, ESCALATED, RESOLVED
  const type = searchParams.get('type') // EVENT, POST, COMMENT, USER, MEDIA
  const assignedTo = searchParams.get('assignedTo')
  const limit = parseInt(searchParams.get('limit') || '50')

  const where: any = {}
  if (status && status !== 'ALL') where.status = status
  if (assignedTo) where.moderatorId = assignedTo

  try {
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

// PUT: Take action on a report (approve, reject, escalate, delete, assign, add note)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { reportId, action, note, assignedToId, sanctionType, sanctionDuration } = await req.json()
  if (!reportId || !action) {
    return NextResponse.json({ error: 'Missing reportId or action' }, { status: 400 })
  }

  try {
    const updates: any = {}
    let auditAction = action
    let auditNote = note

    switch (action) {
      case 'APPROVE':
        updates.status = 'RESOLVED'
        updates.resolution = 'APPROVED'
        break
      case 'REJECT':
        updates.status = 'RESOLVED'
        updates.resolution = 'REJECTED'
        break
      case 'ESCALATE':
        updates.status = 'ESCALATED'
        break
      case 'IN_REVIEW':
        updates.status = 'IN_REVIEW'
        break
      case 'ASSIGN':
        if (!assignedToId) return NextResponse.json({ error: 'Missing assignedToId' }, { status: 400 })
        updates.moderatorId = assignedToId
        auditNote = `Assigned to moderator: ${assignedToId}`
        break
      case 'ADD_NOTE':
        auditNote = note
        break
      case 'DELETE_CONTENT':
        updates.status = 'ACTIONED'
        updates.resolution = 'CONTENT_DELETED'
        break
      case 'SANCTION_USER':
        updates.status = 'ACTIONED'
        updates.resolution = 'USER_SANCTIONED'
        // Optionally, apply sanction to user
        if (sanctionType && sanctionDuration) {
          await prisma.user.update({
            where: { id: assignedToId },
            data: {
              isSuspended: sanctionType === 'SUSPEND'
            }
          })
        }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: updates
    })

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: auditAction,
        resource: 'REPORT',
        resourceId: reportId,
        details: { note: auditNote }
      }
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
} 