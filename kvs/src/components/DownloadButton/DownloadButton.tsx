'use client'

import React from 'react'
import { generateAndDownloadPDF } from '@/app/actions/pdfActions'

type Props = {
  registration: any
  documentType: string
  filename: string
}


export function DownloadPDFButton({ registration, documentType, filename }: Props) {
  const handleDownload = async () => {
    try {
      const buffer = await generateAndDownloadPDF(documentType, registration, filename)

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

  return (
    <button
      type="button"
      className="w-full mb-4 px-4 py-3 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors duration-200"
      onClick={handleDownload}
    >
      {documentType + " herunterladen" || 'PDF herunterladen'}
    </button>
  )
}
