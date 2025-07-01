import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const form = formidable({ multiples: false })
    const data: any = await new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })
    const file = data.files.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })
    const ext = path.extname(file.originalFilename)
    const filename = uuidv4() + ext
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await fs.copyFile(file.filepath, filePath)
    const url = `/uploads/${filename}`
    return res.status(200).json({ url })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to upload image' })
  }
} 