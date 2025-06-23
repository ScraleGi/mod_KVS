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

    const a = document.createElement('a');
    a.href = url;
    a.download = 'mein.pdf';
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