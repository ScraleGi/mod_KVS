'use client'

import React from 'react'
import { generateAndDownloadPDF } from '@/app/actions/pdfActions'

type Props = {
  uuidString: string
  registration: any
  documentType: string
  filename: string
  className?: string
}

const labelMap: Record<string, string> = {
  certificate: 'Zertifikat',
  KursRegeln: 'Kursregeln',
  Teilnahmebestaetigung: 'Teilnahmebestätigung',
}

export function DownloadPDFButton({
  uuidString,
  registration,
  documentType,
  filename,
  className = '',
}: Props) {
  const handleDownload = async () => {
    try {
      const buffer = await generateAndDownloadPDF(uuidString, documentType, registration, filename)

      const blob = new Blob([buffer], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    } catch (error) {
      console.error('PDF download failed:', error)
      alert('PDF konnte nicht generiert werden!')
    }
  }

  const buttonLabel = labelMap[documentType] || 'PDF'

  return (
    <button
      type="button"
      className={
        `cursor-pointer inline-flex items-center px-2 py-1 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`
      }
      onClick={handleDownload}
    >
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
      <span className="mx-2 h-5 w-px bg-white/40 rounded-full" aria-hidden="true"></span>
      {buttonLabel}
    </button>
  )
}