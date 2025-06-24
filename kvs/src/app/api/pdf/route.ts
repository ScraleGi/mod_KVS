import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/utils/generatePDF';
import { loadPDF, savePDF, pdfExists } from '@/utils/fileStorage';

export async function GET(req: NextRequest) {
  // ⚠️ In Zukunft: Prisma holen → hier: statische Demodaten das sind beispiele für pdf
  const data = {
    user: 'Max Mustermann',
    date: new Date().toLocaleDateString(),
    cost: 100, // Beispielwert – später aus DB holen
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
          'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
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
      'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}

// Beispiel: Setting Content-Disposition Header

// 1. inline → PDF wird im Browser-Tab angezeigt, Nutzer sieht die Datei direkt
//    Der Dateiname ist ein Vorschlag, wird aber oft ignoriert bei Anzeige

//                  'Content-Disposition': `inline; filename="${filename}"`

// 2. attachment → PDF wird als Download angeboten
//    Der Browser öffnet einen "Speichern unter"-Dialog mit dem Dateinamen

//                  'Content-Disposition': `attachment; filename="${filename}"`