import puppeteer from 'puppeteer'
import ejs from 'ejs'
import path from 'path'

export async function generatePDF(templateName: string, data: object): Promise<Buffer> {
  // Template-Dateipfad ermitteln
  const templatePath = path.resolve(process.cwd(), 'src/templates', `${templateName}.ejs`)
  
  // EJS Template mit Daten rendern (HTML generieren)
  const html = await ejs.renderFile(templatePath, data)

  // Puppeteer Browser starten (Headless + Sandbox off wegen Server)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  // HTML als Content setzen und warten, bis geladen
  await page.setContent(html, { waitUntil: 'networkidle0' })

  // PDF mit A4 Format erzeugen
  const pdfBuffer = await page.pdf({ format: 'A4' 


    // Optional: the footer should be rendered in every page
    
  // displayHeaderFooter: true,
  // footerTemplate: `<div style="font-size:10px; text-align:center; width:100%;">Your Footer Here</div>`,
  // margin: { bottom: '50px' },
  })



  // Browser schließen
  await browser.close()

  return pdfBuffer as Buffer
}