// Deine Version
'use client';

export default function TestPDF() {
  const handleDownload = async () => {
    const res = await fetch('/api/pdf');
    if (!res.ok) {
      alert('Fehler beim Laden des PDFs');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Parse filename from Content-Disposition header für Filenmae das es so heis
    const disposition = res.headers.get('Content-Disposition');
    let filename = 'download.pdf';
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-xl font-bold mb-4">PDF Generator</h1>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          PDF erzeugen
        </button>
      </div>
    </div>
  );
}