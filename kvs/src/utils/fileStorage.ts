import fs from 'fs/promises'
import path from 'path'

const dir = path.resolve(process.cwd(), 'src/storage/pdfs')

export async function pdfExists(filename: string): Promise<boolean> {
  try {
    await fs.access(path.join(dir, filename))
    return true
  } catch {
    return false
  }
}

//if the PDF exists, it will return the buffer or null if it does not exist
export async function loadPDF(filename: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(dir, filename))
  } catch (e) {
    console.error('LoadPDF Error:', e)
    return null
  }
}

//if pdf does not exist, it will create the directory and save the PDF     
export async function savePDF(filename: string, buffer: Buffer): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), buffer)
  } catch (e) {
    console.error('SavePDF Error:', e)
    throw e
  }
}