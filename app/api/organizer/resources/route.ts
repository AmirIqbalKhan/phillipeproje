import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// List resources for an organizer
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const organizerId = searchParams.get('organizerId')
  if (!organizerId) {
    return NextResponse.json({ error: 'Missing organizerId' }, { status: 400 })
  }
  const resources = await prisma.resource.findMany({ where: { organizerId } })
  return NextResponse.json({ resources })
}

// Create a new resource
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, type, quantity, organizerId } = body
  if (!name || !type || !quantity || !organizerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const resource = await prisma.resource.create({
    data: { name, type, quantity: Number(quantity), organizerId }
  })
  return NextResponse.json({ resource })
}

// Update a resource
export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, name, type, quantity } = body
  if (!id) {
    return NextResponse.json({ error: 'Missing resource id' }, { status: 400 })
  }
  const resource = await prisma.resource.update({
    where: { id },
    data: { name, type, quantity: quantity ? Number(quantity) : undefined }
  })
  return NextResponse.json({ resource })
}

// Delete a resource
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing resource id' }, { status: 400 })
  }
  await prisma.resource.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 