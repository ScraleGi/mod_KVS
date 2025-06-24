import fs from 'fs/promises';
import path from 'path';

const pdfDir = path.resolve(process.cwd(), 'src/storage/pdfs');

export async function savePDF(filename: string, data: Buffer) {
  await fs.mkdir(pdfDir, { recursive: true });
  const filePath = path.join(pdfDir, filename);
  await fs.writeFile(filePath, data);
  return filePath;
}

export async function loadPDF(filename: string): Promise<Buffer | null> {
  try {
    const filePath = path.join(pdfDir, filename);
    const file = await fs.readFile(filePath);
    return file;
  } catch (error) {
    return null; // Datei nicht gefunden
  }
}

export async function pdfExists(filename: string): Promise<boolean> {
  try {
    const filePath = path.join(pdfDir, filename);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}