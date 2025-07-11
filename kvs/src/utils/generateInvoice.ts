'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { generatePDF } from '@/utils/generatePDF'
import { savePDF } from '@/utils/fileStorage'
import { Decimal } from '../../generated/prisma/runtime/library'

export async function generateInvoice(formData: FormData) {
  try {
    // Extract form data with validation
    const registrationId = formData.get("registrationId") as string
    if (!registrationId) throw new Error("Registration ID is required")
    
    const type = formData.get("type") as "PERSON" | "COMPANY"
    if (!type || (type !== "PERSON" && type !== "COMPANY")) {
      throw new Error("Valid recipient type (PERSON or COMPANY) is required")
    }
    
    const recipientSalutation = formData.get("recipientSalutation") as string
    const recipientName = formData.get("recipientName") as string
    const recipientSurname = formData.get("recipientSurname") as string
    const companyName = formData.get("companyName") as string
    const recipientEmail = formData.get("recipientEmail") as string
    const recipientStreet = formData.get("recipientStreet") as string
    const postalCode = formData.get("postalCode") as string
    const recipientCity = formData.get("recipientCity") as string
    const recipientCountry = formData.get("recipientCountry") as string

  const recipient = await db.invoiceRecipient.create({
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

    // Get registration details
    const registration = await db.courseRegistration.findUnique({
      where: { id: registrationId },
      include: { course: { include: { program: true } }, participant: true }
    })


    if (!registration) {
      throw new Error(`Course registration with ID ${registrationId} not found`)
    }

    // calculation logic for dicounts and final amount
  
  const amountNumber = 1
  const baseAmount: Decimal = (registration.course?.program?.price ?? new Decimal(0)).mul(amountNumber)
  const discountAmount: Decimal = (registration.discountAmount ?? new Decimal(0)).mul(amountNumber)
  const finalAmount = baseAmount.minus(discountAmount)

  // Use dueDate from form if provided, otherwise default to 14 days from now
  const dueDateStr = formData.get("dueDate") as string | null
  const dueDate = dueDateStr
    ? new Date(dueDateStr)
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    
    // hier Invocie nummer logik bearbeiten
  const invoiceNumber = `INV-${Date.now()}`

    // Create the invoice record
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        amount: baseAmount,
        finalAmount,
        dueDate,
        courseRegistrationId: registrationId,
        recipientId: recipient.id,
      }
    })



    // Prepare data for PDF template
    const templateData = {
      invoice,
      recipient,
      registration,
      participant: registration.participant,
      course: registration.course,
      program: registration.course?.program,
      amountNumber,
      baseAmount,
      finalAmount,                  // <-- added new
      discountAmount,         // <-- added new  
    }

    // Generate and save PDF
    const pdfBuffer = await generatePDF('invoice', templateData)
    await savePDF(registrationId, `${invoice.id}.pdf`, pdfBuffer)

    // Refresh the UI
    revalidatePath(`/courseregistration/${registrationId}`)
    
    return { success: true, invoiceId: invoice.id }
  } catch (error) {
    console.error('Failed to generate invoice:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}