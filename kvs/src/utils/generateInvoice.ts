import { PrismaClient } from '../../generated/prisma'
import { revalidatePath } from 'next/cache'
import { generatePDF } from '@/utils/generatePDF'
import { savePDF } from '@/utils/fileStorage'

const prisma = new PrismaClient()

export async function generateInvoice(formData: FormData) {
  "use server"
  const registrationId = formData.get("registrationId") as string
  const type = formData.get("type") as "PERSON" | "COMPANY"
  const recipientSalutation = formData.get("recipientSalutation") as string
  const recipientName = formData.get("recipientName") as string
  const recipientSurname = formData.get("recipientSurname") as string
  const companyName = formData.get("companyName") as string
  const recipientEmail = formData.get("recipientEmail") as string
  const recipientStreet = formData.get("recipientStreet") as string
  const postalCode = formData.get("postalCode") as string
  const recipientCity = formData.get("recipientCity") as string
  const recipientCountry = formData.get("recipientCountry") as string

  const recipient = await prisma.invoiceRecipient.create({
    data: {
      type,
      recipientSalutation: type === "PERSON" ? recipientSalutation : null,
      recipientName: type === "PERSON" ? recipientName : null,
      recipientSurname: type === "PERSON" ? recipientSurname : null,
      companyName: type === "COMPANY" ? companyName : null,
      recipientEmail,
      recipientStreet,
      postalCode,
      recipientCity,
      recipientCountry,
    }
  })

  const registration = await prisma.courseRegistration.findUnique({
    where: { id: registrationId },
    include: { course: { include: { program: true } }, participant: true }
  })

  const amount = registration?.course?.program?.price ?? 0

  // Use dueDate from form if provided, otherwise default to 14 days from now
  const dueDateStr = formData.get("dueDate") as string | null
  const dueDate = dueDateStr
    ? new Date(dueDateStr)
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    
  const invoiceNumber = `INV-${Date.now()}`

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      amount,
      dueDate,
      courseRegistrationId: registrationId,
      recipientId: recipient.id,
    }
  })

  const templateData = {
    invoice,
    recipient,
    registration,
    participant: registration?.participant,
    course: registration?.course,
    program: registration?.course?.program,
  }

    const pdfBuffer = await generatePDF('invoice', templateData)
    await savePDF(registrationId, `${invoice.id}.pdf`, pdfBuffer)

  revalidatePath(`/courseregistration/${registrationId}`)
}