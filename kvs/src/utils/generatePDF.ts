import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';

export async function generatePDF(templateName: string, data: object): Promise<Buffer> {
  const templatePath = path.resolve(process.cwd(), 'src/templates', `${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer as Buffer;
}