import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Parse form data
    const form = formidable({ multiples: false })
    // Get the raw Node.js request from NextRequest
    // @ts-ignore
    const nodeReq = req instanceof Request ? (req as any).node?.req : (req as any)
    const data = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err: any, fields: any, files: any) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })
    // @ts-ignore
    const file = data.files.file
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    const ext = path.extname(file.originalFilename)
    const filename = uuidv4() + ext
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await fs.copyFile(file.filepath, filePath)
    const url = `/uploads/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
} 