'use server'

import { generatePDF } from '@/utils/generatePDF'
import { savePDF, loadFile } from '@/utils/fileStorage'
import { PrismaClient } from '../../../generated/prisma'


const prisma = new PrismaClient()

export async function loadPDF(uuidString: string, filename: string): Promise<Buffer | null> {
  const pdfBuffer = await loadFile(uuidString, filename)

  return pdfBuffer
}


export async function generateAndDownloadPDF(uuidString: string, type: string, data: any, filename?: string): Promise<Buffer> {
  if (!type || !data) {
    throw new Error('Missing type or data for PDF generation')
  }

  const pdfBuffer = await generatePDF(type, data)
  const finalFilename = filename || `${type}_${Date.now()}.pdf`

  await savePDF(uuidString, finalFilename, pdfBuffer)
  await prisma.document.create({
    data: {
      role: type,
      file: finalFilename,
      courseRegistrationId: uuidString
    }
  })  
  .then(() => console.log('Document has been registered in DB.'))
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


  return pdfBuffer
}

