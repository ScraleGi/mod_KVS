'use client';

import { useState } from 'react';

export default function TestPDF() {
  const [type, setType] = useState('invoice');
  const [id, setId] = useState('1'); // Optional: id per Input ändern, hier statisch

  const handleDownload = async () => {
    const res = await fetch(`/api/pdf?type=${type}&id=${id}`);
    if (!res.ok) {
      alert(`Fehler beim Laden des ${type} PDFs`);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const disposition = res.headers.get('Content-Disposition');
    let filename = `${type}.pdf`;
    if (disposition) {
      const match = disposition.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)/i);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      }
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 flex flex-col items-center space-y-4 bg-white rounded shadow w-72">
        <h1 className="text-xl font-bold">PDF Generator</h1>

        <label htmlFor="pdf-type" className="font-semibold">Dokumenttyp auswählen:</label>
        <select
          id="pdf-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        >
          <option value="invoice">Invoice</option>
          <option value="certificate">Certificate</option>
          {/* weitere Typen hier */}
        </select>

        {/* Optional: id ändern, z.B. via Input */}
        {/* <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="ID eingeben"
        /> */}

        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          PDF herunterladen
        </button>
      </div>
    </div>
  );
}
