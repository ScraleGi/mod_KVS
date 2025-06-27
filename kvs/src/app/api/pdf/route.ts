import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/utils/generatePDF';
import { pdfExists, loadPDF, savePDF } from '@/utils/fileStorage';
import { getTemplateData } from '@/utils/getTemplateData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as string;
  const id = searchParams.get('id') as string;

  // Fetch data for the template (async)
  const data = await getTemplateData(type, id);

    // Optional: Man könnte hier einen "forceGenerate"-Parameter einbauen,
  // um die PDF-Erzeugung zu erzwingen und den Cache zu umgehen.
  // Das ist praktisch, wenn man eine aktualisierte Version benötigt.
  // const forceGenerate = searchParams.get('forceGenerate') === 'true';s

  if ('error' in data) {
    return new NextResponse(data.error, { status: 404 });
  }

  // filename logic with basic fallback if user field is missing
  const filenameRaw = `${type}_${(data.user || 'Unbekannt').replace(/\s+/g, '_')}_${data.date}.pdf`;
  const filename = filenameRaw.replace(/[^a-zA-Z0-9_\-.]/g, '');

  // Cache prüfen - wenn PDF schon existiert, zurückgeben
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

  // PDF generieren und speichern
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