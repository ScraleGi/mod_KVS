import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getTemplateData } from '@/utils/getTemplateData'
import { generatePDF } from '@/utils/generatePDF'
import { pdfExists, loadPDF, savePDF } from '@/utils/fileStorage'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const type = url.searchParams.get('type')  // 'invoice' or 'certificate'
  const id = url.searchParams.get('id')      // invoiceId or courseRegistrationId (for certificate)

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id' }, { status: 400 })
  }

  if (type !== 'invoice' && type !== 'certificate') {
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  }

  const filename = `${type}_${id}.pdf`

  if (await pdfExists(filename)) {
    const existingPdf = await loadPDF(filename)
    if (existingPdf) {
      return new NextResponse(existingPdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }
  }

  const templateData = await getTemplateData(type, id, prisma)

  if (!templateData) {
    console.log('No template data found for', { type, id }) // Debug Log
    return NextResponse.json({ error: 'Data not found' }, { status: 404 })
  }

  const pdfBuffer = await generatePDF(type, templateData)

  await savePDF(filename, pdfBuffer)

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}