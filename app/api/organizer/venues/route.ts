import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// List venues for an organizer
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const organizerId = searchParams.get('organizerId');
  if (!organizerId) {
    return NextResponse.json({ error: 'Missing organizerId' }, { status: 400 });
  }
  const venues = await prisma.venue.findMany({ where: { ownerId: organizerId } });
  return NextResponse.json({ venues });
}

// Create a new venue
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, address, city, capacity, ownerId } = body;
  if (!name || !address || !city || !capacity || !ownerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const venue = await prisma.venue.create({
    data: { name, address, city, capacity: Number(capacity), ownerId }
  });
  return NextResponse.json({ venue });
}

// Update a venue
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, name, address, city, capacity } = body;
  if (!id) {
    return NextResponse.json({ error: 'Missing venue id' }, { status: 400 });
  }
  const venue = await prisma.venue.update({
    where: { id },
    data: { name, address, city, capacity: capacity ? Number(capacity) : undefined }
  });
  return NextResponse.json({ venue });
}

// Delete a venue
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing venue id' }, { status: 400 });
  }
  await prisma.venue.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 