import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/utils/generatePDF';
import { loadPDF, savePDF, pdfExists } from '@/utils/fileStorage';


/**
 * API Route zum Generieren und Bereitstellen von PDF-Rechnungen
 * 
 * Diese Route generiert eine PDF-Rechnung basierend auf statischen Demodaten.
 * Wenn die PDF bereits existiert, wird sie geladen und zurückgegeben.
 * Andernfalls wird eine neue PDF generiert, gespeichert und zurückgegeben.
 * 
 * @returns {NextResponse} - Die generierte oder geladene PDF-Datei als Response
 */
export async function GET(req: NextRequest) {
  // ⚠️ In Zukunft: Prisma holen → hier: statische Demodaten das sind beispiele für pdf
  const data = {
    user: 'Max Mustermann',
    date: new Date().toLocaleDateString(),
    cost: 100, // Beispielwert – später aus DB holen
    imageUrl: "https://i.imgur.com/utRZT2L.png"
  };



  // 🔁 Dynamischer Dateiname basierend auf Daten, sanitized für Sicherheit
  const filenameRaw = `invoice_${data.user.replace(/\s+/g, '_')}_${data.date}.pdf`;
  const filename = filenameRaw.replace(/[^a-zA-Z0-9_\-.]/g, '');

  // 📦 Prüfen, ob Datei bereits existiert
  if (await pdfExists(filename)) {
    const fileBuffer = await loadPDF(filename);
    if (fileBuffer) {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        },
      });
    }
  }

  // 🖨 PDF wenn nicht vorhanden generieren + speichern
  const pdfBuffer = await generatePDF('invoice', data);
  await savePDF(filename, pdfBuffer);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}

