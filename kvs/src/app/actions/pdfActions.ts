'use server'

import { generatePDF } from '@/utils/generatePDF'
import { savePDF } from '@/utils/fileStorage'

export async function generateAndDownloadPDF(type: string, data: any, filename?: string): Promise<Buffer> {
  if (!type || !data) {
    throw new Error('Missing type or data for PDF generation')
  }

  const pdfBuffer = await generatePDF(type, data)
  const finalFilename = filename || `${type}_${Date.now()}.pdf`

  await savePDF(finalFilename, pdfBuffer)

  return pdfBuffer
}