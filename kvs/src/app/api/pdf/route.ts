import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/utils/generatePDF';
import { pdfExists, loadPDF, savePDF } from '@/utils/fileStorage';
import { getTemplateData } from '@/utils/getTemplateData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'invoice';
  const id = searchParams.get('id') || '1';

  // Beispiel: hol dir die Daten für das PDF basierend auf type und id
  // Hier einfach Dummy-Daten oder aus DB (ohne Prisma: hardcoded oder via getTemplateData)
  const data = getTemplateData(type, id);  // Du kannst getTemplateData anpassen, um id zu nutzen

  const filenameRaw = `${type}_${data.user.replace(/\s+/g, '_')}_${data.date}.pdf`;
  const filename = filenameRaw.replace(/[^a-zA-Z0-9_\-.]/g, '');

  if (await pdfExists(filename)) {
    const fileBuffer = await loadPDF(filename);
    if (fileBuffer) {
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }
  }

  const pdfBuffer = await generatePDF(type, data);
  await savePDF(filename, pdfBuffer);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}