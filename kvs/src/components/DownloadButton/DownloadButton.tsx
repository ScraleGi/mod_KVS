//---------------------------------------------------
// CLIENT COMPONENT DIRECTIVE
//---------------------------------------------------
'use client'

//---------------------------------------------------
// IMPORTS
//---------------------------------------------------
import React from 'react'
import { generateAndDownloadPDF, loadPDF } from '@/app/actions/pdfActions'

//---------------------------------------------------
// TYPE DEFINITIONS
//---------------------------------------------------
// Define a more specific type instead of 'any'
type SerializedRegistration = {
  id: string;
  [key: string]: any; // Allow other properties
};

// Props for the GeneratePDFButton component
type Props = {
  uuidString: string
  registration: SerializedRegistration 
  documentType: string
  filename: string
  className?: string
}

// Props for the DownloadPDFLink component
type DownloadProps = {
  uuidString: string
  filename: string
  className?: string
}

//---------------------------------------------------
// CONSTANTS
//---------------------------------------------------
// Translation mapping for document types
const labelMap: Record<string, string> = {
  certificate: 'Zertifikat',
  KursRegeln: 'Kursregeln',
  Teilnahmebestaetigung: 'Teilnahmebestätigung',
  invoice: 'Rechnung',
}

//---------------------------------------------------
// COMPONENTS
//---------------------------------------------------
/**
 * Button component that generates and downloads a PDF document
 */
export function GeneratePDFButton({
  uuidString,
  registration,
  documentType,
  filename,
  className = '',
}: Props) {
  // Make sure we have a fully serialized object by doing a round-trip through JSON
  const serializedRegistration = JSON.parse(JSON.stringify(registration));
  
  const handleDownload = async () => {
    try {
      // Generate the PDF document
      const buffer = await generateAndDownloadPDF(
        uuidString, 
        documentType, 
        serializedRegistration, 
        filename
      )

      // Create a download link and trigger the download
      const blob = new Blob([buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      
      // Clean up the object URL after download
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    } catch (error) {
      console.error('PDF download failed:', error)
      alert('PDF konnte nicht generiert werden!')
    }
  }

  // Get the appropriate button label from the mapping
  const buttonLabel = labelMap[documentType] || 'PDF'

  return (
    <button
      type="button"
      className={
        `cursor-pointer inline-flex items-center px-2 py-1 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`
      }
      onClick={handleDownload}
    >
      {/* Download icon */}
      <svg
        className="w-4 h-4 opacity-80"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
      </svg>
      {/* Separator */}
      <span className="mx-2 h-5 w-px bg-white/40 rounded-full" aria-hidden="true"></span>
      {/* Label */}
      {buttonLabel}
    </button>
  )
}

/**
 * Link component that loads and downloads an existing PDF document
 */
export function DownloadPDFLink({
  uuidString,
  filename,
  className = '',
}: DownloadProps) {
  const handleDownload = async () => {
    try {
      // Load the existing PDF document
      const buffer = await loadPDF(uuidString, filename)
      if (!buffer) {
        throw new Error('PDF not found')
      }
      
      // Create a download link and trigger the download
      const blob = new Blob([buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      
      // Clean up the object URL after download
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    } catch (error) {
      console.error('PDF download failed:', error)
      alert('PDF konnte nicht generiert werden!')
    }
  }

  return (
    <a
      href="#"
      className={`inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none ${className}`}
      onClick={(e) => {
        e.preventDefault();
        handleDownload();
      }}
    >
      {filename}
    </a>
  )
}