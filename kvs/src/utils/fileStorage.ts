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

export async function loadPDF(filename: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(dir, filename))
  } catch (e) {
    console.error('LoadPDF Error:', e)
    return null
  }
}

export async function savePDF(filename: string, buffer: Buffer): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), buffer)
  } catch (e) {
    console.error('SavePDF Error:', e)
    throw e
  }
}


// import fs from 'fs/promises'
// import path from 'path'

// const dir = path.resolve(process.cwd(), 'src/storage/pdfs')

// // Prüfen, ob PDF schon existiert
// export async function pdfExists(filename: string): Promise<boolean> {
//   try {
//     await fs.access(path.join(dir, filename))
//     return true
//   } catch {
//     return false
//   }
// }

// // PDF-Datei laden (Buffer zurückgeben) oder null bei Fehler
// export async function loadPDF(filename: string): Promise<Buffer | null> {
//   try {
//     return await fs.readFile(path.join(dir, filename))
//   } catch (e) {
//     console.error('LoadPDF Error:', e)
//     return null
//   }
// }

// // PDF-Datei speichern, ggf. Ordner erstellen
// export async function savePDF(filename: string, buffer: Buffer): Promise<void> {
//   try {
//     await fs.mkdir(dir, { recursive: true })
//     await fs.writeFile(path.join(dir, filename), buffer)
//   } catch (e) {
//     console.error('SavePDF Error:', e)
//     throw e
//   }
// }
