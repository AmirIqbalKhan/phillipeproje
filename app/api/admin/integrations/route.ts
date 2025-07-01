import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET: Fetch integrations (API keys, webhooks)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // API_KEY, WEBHOOK
  const status = searchParams.get('status') // ACTIVE, INACTIVE

  try {
    const apiKeys = type === 'WEBHOOK' ? [] : await prisma.apiKey.findMany({
      where: status && status !== 'ALL' ? { 
        revoked: status === 'INACTIVE' 
      } : {},
      orderBy: { createdAt: 'desc' }
    })
    const webhooks = type === 'API_KEY' ? [] : await prisma.webhook.findMany({
      where: status && status !== 'ALL' ? { 
        isActive: status === 'ACTIVE' 
      } : {},
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ apiKeys, webhooks })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}

// POST: Add new API key or webhook
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, data } = await req.json()
  if (!type || !data) {
    return NextResponse.json({ error: 'Missing type or data' }, { status: 400 })
  }

  try {
    let created
    if (type === 'API_KEY') {
      created = await prisma.apiKey.create({ data })
    } else if (type === 'WEBHOOK') {
      created = await prisma.webhook.create({ data })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: `CREATE_${type}`,
        resource: type,
        resourceId: created.id,
        details: { type, data }
      }
    })
    return NextResponse.json({ success: true, integration: created })
  } catch (error) {
    console.error('Error creating integration:', error)
    return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 })
  }
}

// PUT: Update API key or webhook
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, id, data } = await req.json()
  if (!type || !id || !data) {
    return NextResponse.json({ error: 'Missing type, id, or data' }, { status: 400 })
  }

  try {
    let updated
    if (type === 'API_KEY') {
      updated = await prisma.apiKey.update({ where: { id }, data })
    } else if (type === 'WEBHOOK') {
      updated = await prisma.webhook.update({ where: { id }, data })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: `UPDATE_${type}`,
        resource: type,
        resourceId: id,
        details: { type, data }
      }
    })
    return NextResponse.json({ success: true, integration: updated })
  } catch (error) {
    console.error('Error updating integration:', error)
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 })
  }
}

// DELETE: Delete API key or webhook
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role?.toLowerCase() !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, id } = await req.json()
  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id' }, { status: 400 })
  }

  try {
    let deleted
    if (type === 'API_KEY') {
      deleted = await prisma.apiKey.delete({ where: { id } })
    } else if (type === 'WEBHOOK') {
      deleted = await prisma.webhook.delete({ where: { id } })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user?.id || '',
        action: `DELETE_${type}`,
        resource: type,
        resourceId: id,
        details: { type }
      }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting integration:', error)
    return NextResponse.json({ error: 'Failed to delete integration' }, { status: 500 })
  }
} 