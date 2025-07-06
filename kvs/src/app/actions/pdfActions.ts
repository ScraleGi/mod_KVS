'use server'

import { generatePDF } from '@/utils/generatePDF'
import { savePDF, loadFile } from '@/utils/fileStorage'
import { db } from '@/lib/db'

export async function loadPDF(uuidString: string, filename: string): Promise<Buffer | null> {
  const pdfBuffer = await loadFile(uuidString, filename)
  return pdfBuffer
}

export async function generateAndDownloadPDF(uuidString: string, type: string, data: any, filename?: string): Promise<Buffer> {
  if (!type || !data) {
    throw new Error('Missing type or data for PDF generation')
  }

  try {
    const pdfBuffer = await generatePDF(type, data)
    const finalFilename = filename || `${type}_${Date.now()}.pdf`

    // Save PDF to file system
    await savePDF(uuidString, finalFilename, pdfBuffer)
    
    // Create document record in database
    const document = await db.document.create({
      data: {
        role: type,
        file: finalFilename,
        courseRegistrationId: uuidString
      }
    })
    
    console.log('Document has been registered in DB.')
    
    // Return the PDF buffer for download
    return pdfBuffer
  } catch (error) {
    console.error('Error generating or saving PDF:', error)
    throw error
  }
}