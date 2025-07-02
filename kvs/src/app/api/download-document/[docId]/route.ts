import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../../generated/prisma/client'
import path from 'path'
import { promises as fs } from 'fs'
import { generateAndDownloadPDF } from '@/app/actions/pdfActions' // Adjust path if needed

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: { docId: string } }
) {
  const { docId } = params

  // Find the document in the DB
  const doc = await prisma.document.findUnique({ where: { id: docId } })
  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Build the file path (adjust this to your storage logic)
  const storageRoot = process.env.STORAGE_ROOT || process.cwd()
  const filePath = path.join(storageRoot, 'pdf', doc.courseRegistrationId, doc.file)

  let fileBuffer: Buffer | null = null

  try {
    fileBuffer = await fs.readFile(filePath)
  } catch (err) {
    // File not found, try to regenerate
    try {
      // Fetch registration and participant data for PDF generation
      const registration = await prisma.courseRegistration.findUnique({
        where: { id: doc.courseRegistrationId },
        include: {
          participant: true,
          course: {
            include: {
              program: true,
              mainTrainer: true,
            },
          },
        },
      })

      if (!registration) {
        return NextResponse.json({ error: 'Registration not found for PDF regeneration' }, { status: 404 })
      }

      // Regenerate PDF using your existing logic
      fileBuffer = await generateAndDownloadPDF(
        doc.courseRegistrationId,
        doc.role,
        registration,
        doc.file
      )
    } catch (regenErr) {
      return NextResponse.json({ error: 'File not found and could not be regenerated' }, { status: 404 })
    }
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${doc.file}"`,
    },
  })
}