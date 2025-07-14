'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { generatePDF } from '@/utils/generatePDF'
import { savePDF } from '@/utils/fileStorage'
import { Decimal } from '../../generated/prisma/runtime/library'
import { format } from 'date-fns'

export async function generateInvoice(formData: FormData) {
  try {
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

    const registration = await db.courseRegistration.findUnique({
      where: { id: registrationId },
      include: { course: { include: { program: true } }, participant: true }
    })

    if (!registration) {
      throw new Error(`Course registration with ID ${registrationId} not found`)
    }

    const amountNumber = 1
    const baseAmount: Decimal = (registration.course?.program?.price ?? new Decimal(0)).mul(amountNumber)
    const discountAmount: Decimal = (registration.discountAmount ?? new Decimal(0)).mul(amountNumber)
    const finalAmount = baseAmount.minus(discountAmount)

    const dueDateStr = formData.get("dueDate") as string | null
    const dueDate = dueDateStr
      ? new Date(dueDateStr)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    const today = new Date()
    const datePrefix = format(today, 'yyyyMMdd')

    let invoice
    let retries = 0
    const maxRetries = 3

    while (!invoice && retries < maxRetries) {
      const invoiceCountToday = await db.invoice.count({
        where: {
          invoiceNumber: {
            startsWith: datePrefix
          }
        }
      })

      const nextSequential = invoiceCountToday + 1
      const paddedSequential = String(nextSequential).padStart(7, '0')
      const invoiceNumber = `${datePrefix}_${paddedSequential}`

      try {
        invoice = await db.invoice.create({
          data: {
            invoiceNumber,
            amount: baseAmount,
            finalAmount,
            dueDate,
            courseRegistrationId: registrationId,
            recipientId: recipient.id,
          }
        })
      } catch (error) {
        const msg = error instanceof Error ? error.message : ''
        if (msg.includes('Unique constraint') || msg.includes('unique') || msg.includes('constraint')) {
          retries++
          continue // retry on duplicate
        }
        throw error // throw unknown errors
      }
    }

    if (!invoice) {
      throw new Error('Failed to generate a unique invoice number after 3 retries')
    }

    const templateData = {
      invoice,
      recipient,
      registration,
      participant: registration.participant,
      course: registration.course,
      program: registration.course?.program,
      amountNumber,
      baseAmount,
      finalAmount,
      discountAmount,
    }

    const pdfBuffer = await generatePDF('invoice', templateData)
    await savePDF(registrationId, `${invoice.id}.pdf`, pdfBuffer)

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
