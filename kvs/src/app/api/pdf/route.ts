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

  // 🔁 Dynamischer Dateiname basierend auf Daten
  const filename = `invoice_${data.user.replace(/\s+/g, '')}_${data.date}.pdf`;

  // 📦 Prüfen, ob Datei bereits existiert
  if (await pdfExists(filename)) {
    const fileBuffer = await loadPDF(filename);
    if (fileBuffer) {
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      });
    }
  }

  // 🖨 PDF generieren + speichern
  const pdfBuffer = await generatePDF('invoice', data);
  await savePDF(filename, pdfBuffer);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}