'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { generatePDF } from '@/utils/generatePDF'
import { savePDF } from '@/utils/fileStorage'
import { Decimal } from '../../generated/prisma/runtime/library'

export async function generateInvoice(formData: FormData) {
  try {
    const registrationId = formData.get("registrationId") as string
    if (!registrationId) throw new Error("Registration ID is required")

/*
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
*/
    const registration = await db.courseRegistration.findUnique({
      where: { id: registrationId },
      include: {
        course: {
          include: {
            program: {
              include: {
                area: true,
              }
            }
          }
        },
        participant: true,
        invoiceRecipient: true,
      }
    })
    console.log('Registration:', registration, registration?.invoiceRecipient)

    if (!registration) throw new Error(`Course registration with ID ${registrationId} not found`)
    const course = registration.course
    const program = course?.program
    const area = program?.area

    if (!course || !program || !area) {
      throw new Error("Missing course, program, or area information")
    }

    let recipientSalutation = ''
    let recipientName = ''
    let recipientSurname = ''
    let companyName = ''
    let recipientEmail = ''
    let recipientStreet = ''
    let postalCode = ''
    let recipientCity = ''
    let recipientCountry = ''
    if (registration.invoiceRecipient) {
      // Use data from recipient details
      recipientSalutation = registration.invoiceRecipient.recipientSalutation ?? ''
      recipientName = registration.invoiceRecipient.recipientName ?? ''
      recipientSurname = registration.invoiceRecipient.recipientSurname ?? ''
      companyName = registration.invoiceRecipient.companyName ?? ''
      recipientEmail = registration.invoiceRecipient.recipientEmail ?? ''
      recipientStreet = registration.invoiceRecipient.recipientStreet ?? ''
      postalCode = registration.invoiceRecipient.postalCode ?? ''
      recipientCity = registration.invoiceRecipient.recipientCity ?? ''
      recipientCountry = registration.invoiceRecipient.recipientCountry ?? ''

    } else {
      // Use data from praticipant
      recipientSalutation = registration.participant.salutation ?? ''
      recipientName = registration.participant.name ?? ''
      recipientSurname = registration.participant.surname ?? ''
      recipientEmail = registration.participant.email ?? ''
      recipientStreet = registration.participant.street ?? ''
      postalCode = registration.participant.postalCode ?? ''
      recipientCity = registration.participant.city ?? ''
      recipientCountry = registration.participant.country ?? ''
    
    }


    const amountNumber = 1 // Static quantity
    const programPrice = program.price ?? new Decimal(0)
    const baseAmount: Decimal = programPrice.mul(amountNumber)
    const discountAmount: Decimal = (registration.discountAmount ?? new Decimal(0)).mul(amountNumber)
    const subsidyAmount: Decimal = (registration.subsidyAmount ?? new Decimal(0)).mul(amountNumber)
    const finalAmount = baseAmount.minus(discountAmount).minus(subsidyAmount)

    const dueDateStr = formData.get("dueDate") as string | null
    const dueDate = dueDateStr ? new Date(dueDateStr) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

    let invoice
    let retries = 0
    const maxRetries = 3

    while (!invoice && retries < maxRetries) {
      const invoiceCountForCourse = await db.invoice.count({
        where: { courseCode: course.code }
      })

      const nextSequential = invoiceCountForCourse + 1
      const paddedSequential = String(nextSequential).padStart(3, '0')
      const invoiceNumber = `${course.code}-${paddedSequential}-${area.code}`

      try {
        invoice = await db.invoice.create({
          data: {
            invoiceNumber,
            courseRegistrationId: registrationId,
            courseCode: course.code,
            programName: program.name,
            programPrice: program.price ?? new Decimal(0),
            discountAmount,
            discountRemark: registration.discountRemark ?? '',
            subsidyAmount,
            subsidyRemark: registration.subsidyRemark ?? '',
            amount: baseAmount,
            finalAmount,
            dueDate,
            recipientSalutation,
            recipientName,
            recipientSurname,
            companyName,
            recipientEmail,
            recipientStreet,
            postalCode,
            recipientCity,
            recipientCountry,
          }
        })
      } catch (error) {
        const msg = error instanceof Error ? error.message : ''
        if (msg.includes('Unique constraint') || msg.includes('unique')) {
          retries++
          continue
        }
        throw error
      }
    }

    if (!invoice) throw new Error('Failed to generate a unique invoice number after multiple attempts')

    const templateData = {
      invoice,
      registration,
      recipientSalutation,
      recipientName,
      recipientSurname,
      companyName,
      participant: registration.participant,
      course,
      program,
      amountNumber,
      baseAmount,
      finalAmount,
      discountAmount,
    }

    const pdfBuffer = await generatePDF('invoice', templateData)
    await savePDF(registrationId, `${invoice.invoiceNumber}.pdf`, pdfBuffer)

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





// 'use server'

// import { db } from '@/lib/db'
// import { revalidatePath } from 'next/cache'
// import { generatePDF } from '@/utils/generatePDF'
// import { savePDF } from '@/utils/fileStorage'
// import { Decimal } from '../../generated/prisma/runtime/library'

// export async function generateInvoice(formData: FormData) {
//   try {
//     const registrationId = formData.get("registrationId") as string
//     if (!registrationId) throw new Error("Registration ID is required")

//     const type = formData.get("type") as "PERSON" | "COMPANY"
//     if (!type || (type !== "PERSON" && type !== "COMPANY")) {
//       throw new Error("Valid recipient type (PERSON or COMPANY) is required")
//     }

//     const recipientSalutation = formData.get("recipientSalutation") as string
//     const recipientName = formData.get("recipientName") as string
//     const recipientSurname = formData.get("recipientSurname") as string
//     const companyName = formData.get("companyName") as string
//     const recipientEmail = formData.get("recipientEmail") as string
//     const recipientStreet = formData.get("recipientStreet") as string
//     const postalCode = formData.get("postalCode") as string
//     const recipientCity = formData.get("recipientCity") as string
//     const recipientCountry = formData.get("recipientCountry") as string

//     const registration = await db.courseRegistration.findUnique({
//       where: { id: registrationId },
//       include: {
//         course: {
//           include: {
//             program: {
//               include: {
//                 area: true,
//               }
//             }
//           }
//         },
//         participant: true,
//       }
//     })

//     if (!registration) {
//       throw new Error(`Course registration with ID ${registrationId} not found`)
//     }

//     const course = registration.course
//     const program = course?.program
//     const area = program?.area

//     if (!course || !program || !area) {
//       throw new Error("Missing course, program, or area information")
//     }

//     const amountNumber = 1 // Assuming a fixed amount of 1 for simplicity, adjust as needed
//     const baseAmount: Decimal = (program.price ?? new Decimal(0)).mul(amountNumber)
//     const discountAmount: Decimal = (registration.discountAmount ?? new Decimal(0)).mul(amountNumber)
//     const subsidyAmount: Decimal = (registration.subsidyAmount ?? new Decimal(0)).mul(amountNumber)
//     const finalAmount = baseAmount.minus(discountAmount).minus(subsidyAmount)

//     const dueDateStr = formData.get("dueDate") as string | null
//     const dueDate = dueDateStr
//       ? new Date(dueDateStr)
//       : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)

//     let invoice
//     let retries = 0
//     const maxRetries = 3

//     while (!invoice && retries < maxRetries) {
//       const invoiceCountForCourse = await db.invoice.count({
//         where: {
//           courseCode: course.code
//         }
//       })

//       const nextSequential = invoiceCountForCourse + 1
//       const paddedSequential = String(nextSequential).padStart(3, '0')
//       const invoiceNumber = `${course.code}-${paddedSequential}-${area.code}`

//       try {
//         invoice = await db.invoice.create({
//           data: {
//             invoiceNumber,
//             courseRegistrationId: registrationId,
//             courseCode: course.code,
//             programName: program.name,
//             programPrice: program.price,
//             discountAmount,
//             discountRemark: registration.discountRemark ?? '',
//             subsidyAmount,
//             subsidyRemark: registration.subsidyRemark ?? '',
//             finalAmount,
//             dueDate,
//             amount: baseAmount,
//             recipientSalutation: type === 'PERSON' ? recipientSalutation : null,
//             recipientName: type === 'PERSON' ? recipientName : null,
//             recipientSurname: type === 'PERSON' ? recipientSurname : null,
//             companyName: type === 'COMPANY' ? companyName : null,
//             recipientEmail,
//             recipientStreet,
//             postalCode,
//             recipientCity,
//             recipientCountry,
//           }
//         })
//       } catch (error) {
//         const msg = error instanceof Error ? error.message : ''
//         if (msg.includes('Unique constraint') || msg.includes('unique')) {
//           retries++
//           continue
//         }
//         throw error
//       }
//     }

//     if (!invoice) {
//       throw new Error('Failed to generate a unique invoice number after multiple attempts')
//     }

//     const templateData = {
//       invoice,
//       registration,
//       recipientSalutation,
//       recipientName,
//       recipientSurname,
//       companyName,
//       participant: registration.participant,
//       course,
//       program,
//       amountNumber,
//       baseAmount,
//       finalAmount,
//       discountAmount,
//     }

  
//     const pdfBuffer = await generatePDF('invoice', templateData)
//     await savePDF(registrationId, `${invoice.invoiceNumber}.pdf`, pdfBuffer)

//     revalidatePath(`/courseregistration/${registrationId}`)
//     return { success: true, invoiceId: invoice.id }
//   } catch (error) {
//     console.error('Failed to generate invoice:', error)
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : 'Unknown error occurred'
//     }
//   }
// }
