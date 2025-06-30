import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// List staff for an organizer
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const organizerId = searchParams.get('organizerId')
  if (!organizerId) {
    return NextResponse.json({ error: 'Missing organizerId' }, { status: 400 })
  }
  const staff = await prisma.staff.findMany({ where: { organizerId } })
  return NextResponse.json({ staff })
}

// Create a new staff member
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, role, organizerId } = body
  if (!name || !email || !role || !organizerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const staff = await prisma.staff.create({
    data: { name, email, role, organizerId }
  })
  return NextResponse.json({ staff })
}

// Update a staff member
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, name, email, role } = body
  if (!id) {
    return NextResponse.json({ error: 'Missing staff id' }, { status: 400 })
  }
  const staff = await prisma.staff.update({
    where: { id },
    data: { name, email, role }
  })
  return NextResponse.json({ staff })
}

// Delete a staff member
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing staff id' }, { status: 400 })
  }
  await prisma.staff.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 