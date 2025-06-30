import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }
    // Check for duplicate email
    const emailLower = email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: emailLower } })
    if (existing) {
      return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
    }
    // Hash password
    const hashed = await hash(password, 10)
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: emailLower,
        password: hashed,
        role: role || 'USER',
      },
      select: { id: true, name: true, email: true, role: true },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }
} 