'use client';

export default function testPDF() {
  const handleDownload = async () => {
    const res = await fetch('/api/pdf');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '${user}.pdf';
    a.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">PDF Generator</h1>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        PDF erzeugen
      </button>
    </div>
  );
}