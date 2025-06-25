'use client';

export default function TestPDF() {
  const handleDownload = async (type: string, id: string) => {
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
      <div className="p-6 flex flex-col items-center space-y-4 bg-white rounded shadow">
        <h1 className="text-xl font-bold">PDF Generator</h1>

        <button
          onClick={() => handleDownload('invoice', '1')}  // Example: invoiceId = 1
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Invoice PDF herunterladen
        </button>

        <button
          onClick={() => handleDownload('certificate', '1')}  // Example: certificateId = 1
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Certificate PDF herunterladen
        </button>
      </div>
    </div>
  );
}
