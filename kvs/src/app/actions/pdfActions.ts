'use server'

import { generatePDF } from '@/utils/generatePDF'
import { savePDF, loadFile } from '@/utils/fileStorage'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/**
 * Load a PDF file from storage by its UUID and filename
 */
export async function loadPDF(uuidString: string, filename: string): Promise<Buffer | null> {
  try {
    const pdfBuffer = await loadFile(uuidString, filename)
    return pdfBuffer
  } catch (error) {
    console.error(`Failed to load PDF ${filename} for ID ${uuidString}:`, error)
    return null
  }
}

/**
 * Generate a PDF document, save it to storage, and register it in the database
 */
export async function generateAndDownloadPDF(
  uuidString: string, 
  type: string, 
  data: Record<string, unknown>, 
  filename?: string
): Promise<Buffer> {
  // Input validation
  if (!uuidString) throw new Error('Missing registration ID for PDF generation')
  if (!type) throw new Error('Missing document type for PDF generation')
  if (!data) throw new Error('Missing data for PDF generation')

  try {
    const pdfBuffer = await generatePDF(type, data)
    const finalFilename = filename || `${type}_${Date.now()}.pdf`

    // Save PDF to file system
    await savePDF(uuidString, finalFilename, pdfBuffer)
    
    // Check for existing document to prevent duplicates
    const existingDocument = await db.document.findFirst({
      where: {
        courseRegistrationId: uuidString,
        file: finalFilename,
        deletedAt: null
      }
    })
    
    // Only create document record if it doesn't exist
    if (!existingDocument) {
      await db.document.create({
        data: {
          role: type,
          file: finalFilename,
          courseRegistrationId: uuidString
        }
      })
      
      console.log('Document has been registered in DB.')
    } else {
      console.log('Document already exists, skipping DB registration.')
    }
    
    // Refresh UI
    revalidatePath(`/courseregistration/${uuidString}`)
    
    // Return the PDF buffer for download
    return pdfBuffer
  } catch (error) {
    console.error('Error generating or saving PDF:', error)
    throw error // Keep the original error throwing pattern
  }
}

/**
 * Delete a PDF document from the database (soft delete)
 */
export async function deletePDFDocument(documentId: string): Promise<boolean> {
  try {
    // Find the document
    const document = await db.document.findUnique({
      where: { id: documentId }
    })
    
    if (!document) {
      console.error(`Document with ID ${documentId} not found`)
      return false
    }
    
    // Soft delete the document record
    await db.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() }
    })
    
    // Refresh UI
    revalidatePath(`/courseregistration/${document.courseRegistrationId}`)
    
    return true
  } catch (error) {
    console.error('Error deleting PDF document:', error)
    return false
  }
}