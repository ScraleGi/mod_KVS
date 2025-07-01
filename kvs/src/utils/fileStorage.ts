import fs from 'fs/promises';
import path from 'path';


function getStoragePath(uuidString: string): string {
  const pdfDir = path.join(process.env.STORAGE_ROOT || process.cwd() ,'pdf', uuidString) ;

  return pdfDir;
}


export async function savePDF(uuidString: string, filename: string, data: Buffer): Promise<string> {
  const pdfDir = getStoragePath(uuidString);
  await fs.mkdir(pdfDir, { recursive: true });
  const filePath = path.join(pdfDir, filename);
  await fs.writeFile(filePath, data);
  return filePath;
}

export async function loadPDF(uuidString: string, filename: string): Promise<Buffer | null> {
  const pdfDir = getStoragePath(uuidString);
  const filePath = path.join(pdfDir, filename);
  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

export async function pdfExists(uuidString: string, filename: string): Promise<boolean> {
  const pdfDir = getStoragePath(uuidString);
  const filePath = path.join(pdfDir, filename);
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}