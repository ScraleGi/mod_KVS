import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { promises as fs } from 'fs';

export async function generatePDF(data: { user: string; date: string }) {
  const templatePath = path.resolve(process.cwd(), 'src/templates/invoice.ejs');
  const html = await ejs.renderFile(templatePath, data);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdfBuffer;
}
