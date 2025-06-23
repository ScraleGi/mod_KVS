import { generatePDF } from '@/utils/puppeteer';

export async function GET() {
  const pdfBuffer = await generatePDF({
    user: 'Max Mustermann',
    date: new Date().toLocaleDateString(),
  });

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="test.pdf"',
    },
  });
}