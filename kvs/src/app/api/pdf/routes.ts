import { NextResponse } from 'next/server';
import { generatePDF } from '@/utils/puppeteer';

export async function GET() {
  const pdfBuffer = await generatePDF({
    user: 'Digital Campus',
    date: new Date().toLocaleDateString(),
  });

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="test.pdf"',
    },
  });
}