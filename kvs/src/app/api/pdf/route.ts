import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'  // prisma instance exportieren, z.B. /lib/prisma.ts
import { getTemplateData } from '@/utils/getTemplateData'
import { generatePDF } from '@/utils/generatePDF'
import { pdfExists, loadPDF, savePDF } from '@/utils/fileStorage'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const invoiceId = url.searchParams.get('invoiceId')

  if (!invoiceId) {
    return NextResponse.json({ error: 'Missing invoiceId' }, { status: 400 })
  }

  // Dateiname mit invoiceId für Eindeutigkeit
  const filename = `invoice_${invoiceId}.pdf`

  // Wenn PDF schon existiert -> direkt zurückgeben
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

  // Daten aus DB holen via Prisma
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      courseRegistration: {
        include: {
          participant: true,
          course: {
            include: {
              program: true,
              trainer: true,
            },
          },
        },
      },
    },
  })

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  // Template-Daten vorbereiten
  const templateData = getTemplateData('invoice', invoice)

  // PDF generieren
  const pdfBuffer = await generatePDF('invoice', templateData)

  // PDF speichern
  await savePDF(filename, pdfBuffer)

  // PDF als Download senden
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
