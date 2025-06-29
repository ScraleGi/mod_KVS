'use client';

import React from 'react';

interface DownloadButtonsProps {
  registration: any;
}

async function generateAndSavePDFWithName(type: string, registration: any) {
  // Call your API route that triggers PDF generation + saving on server,
  // or call server function via POST fetch to generate & save PDF.
  // Here, simplified as direct fetch call to an API route:
  
  const participantName = registration.participant.name.replace(/\s+/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${type}_${participantName}_${dateStr}.pdf`;

  const res = await fetch(`/api/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, registrationId: registration.id }),
  });

  if (!res.ok) {
    throw new Error('Failed to generate PDF');
  }

  return filename;
}

async function downloadPDF(filename: string) {
  const res = await fetch(`/api/download?filename=${encodeURIComponent(filename)}`);
  if (!res.ok) {
    alert('Download failed');
    return;
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DownloadButtons({ registration }: DownloadButtonsProps) {
  const handleDownload = async (type: string) => {
    try {
      const filename = await generateAndSavePDFWithName(type, registration);
      await downloadPDF(filename);
    } catch (error) {
      alert('Error generating or downloading PDF.');
      console.error(error);
    }
  };

  return (
    <>
      <button
        onClick={() => handleDownload('certificate')}
        className="w-full mb-4 px-4 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Certificate
      </button>

      <button
        onClick={() => handleDownload('KursRegeln')}
        className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Kurs Regeln
      </button>
    </>
  );
}
