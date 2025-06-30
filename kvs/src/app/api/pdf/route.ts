import { NextResponse } from 'next/server';
import { generatePDF } from '@/utils/generatePDF';
import { savePDF } from '@/utils/fileStorage';


// This route handles PDF generation and downloading based on a GET request. server side
// Optional: If you want GET for testing, keep it minimal

// export async function GET() {
//   return new NextResponse('Send POST request to generate PDF', { status: 200 });
// }

// This route handles PDF generation and saving based on client requests. cleint side
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data, filename: filenameFromClient } = body;

    if (!type || !data) {
      return new NextResponse('Missing type or data in request body.', { status: 400 });
    }

    wwwwwwwwwwwwwwww
    const pdfBuffer = await generatePDF(type, data);

    // Optional: Man könnte hier einen "forceGenerate"-Parameter einbauen,
    // um die PDF-Erzeugung zu erzwingen und den Cache zu umgehen.
    // Das ist praktisch, wenn man eine aktualisierte Version benötigt.

    const filename = filenameFromClient || `${type}_${Date.now()}.pdf`;

    await savePDF(filename, pdfBuffer);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


