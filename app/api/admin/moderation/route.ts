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
  if (type && type !== 'ALL') where.type = type
  if (assignedTo) where.assignedToId = assignedTo

  try {
    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
        post: true,
        comment: true,
        media: true,
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
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
        updates.assignedToId = assignedToId
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
              isSuspended: sanctionType === 'SUSPEND',
              suspensionExpires: sanctionType === 'SUSPEND' ? new Date(Date.now() + sanctionDuration * 24 * 60 * 60 * 1000) : null
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
        action: auditAction,
        note: auditNote,
        reportId,
        performedById: session.user.id
      }
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
} 