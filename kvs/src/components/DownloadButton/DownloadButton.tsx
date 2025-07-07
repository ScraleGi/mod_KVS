//---------------------------------------------------
// CLIENT COMPONENT DIRECTIVE
//---------------------------------------------------
'use client'

//---------------------------------------------------
// IMPORTS
//---------------------------------------------------
import React, { useState } from 'react'
import { generateAndDownloadPDF, loadPDF } from '@/app/actions/pdfActions'

//---------------------------------------------------
// TYPE DEFINITIONS
//---------------------------------------------------
// Define a more specific type instead of 'any'
type SerializedRegistration = {
  id: string;
  [key: string]: unknown; // Better type safety than 'any'
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
  displayName?: string // Optional display name instead of filename
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Make sure we have a fully serialized object by doing a round-trip through JSON
  const serializedRegistration = JSON.parse(JSON.stringify(registration));
  
  const handleDownload = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  // Get the appropriate button label from the mapping
  const buttonLabel = labelMap[documentType] || 'PDF'

  return (
    <button
      type="button"
      disabled={isLoading}
      aria-busy={isLoading}
      className={
        `cursor-pointer inline-flex items-center px-2 py-1 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75' : ''} ${className}`
      }
      onClick={handleDownload}
    >
      {/* Fixed-width icon container to prevent layout shifts */}
      <span className="flex items-center justify-center w-4 h-4">
        {isLoading ? (
          <svg 
            className="animate-spin h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
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
        )}
      </span>
      
      {/* Separator - consistent width */}
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
  displayName,
  className = '',
}: DownloadProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDownload = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  // Show either the provided display name or the filename
  const displayText = displayName || filename;

  return (
    <a
      href="#"
      className={`inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none ${isLoading ? 'opacity-70 pointer-events-none' : ''} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        handleDownload();
      }}
      aria-disabled={isLoading}
    >
      {/* Fixed-width icon container to prevent layout shifts */}
      <span className="inline-flex items-center justify-center w-3 h-3 mr-1">
        {isLoading ? (
          <svg 
            className="animate-spin w-3 h-3 text-blue-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
          </svg>
        )}
      </span>
      
      {/* Display text - same in both states */}
      {displayText}
    </a>
  )
}