import fs from 'fs/promises';
import path from 'path';

const pdfDir = path.join(process.cwd(), 'src', 'storage', 'pdfs');

export async function savePDF(filename: string, data: Buffer): Promise<string> {
  await fs.mkdir(pdfDir, { recursive: true });
  const filePath = path.join(pdfDir, filename);
  await fs.writeFile(filePath, data);
  return filePath;
}

export async function loadPDF(filename: string): Promise<Buffer | null> {
  const filePath = path.join(pdfDir, filename);
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

export async function pdfExists(filename: string): Promise<boolean> {
  const filePath = path.join(pdfDir, filename);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}