"use server"
import { db } from '@/lib/db'

/**
 * Server action for creating an InvoiceRecipient.
 * Returns { error: string } for validation issues, otherwise { redirect: string }.
 */
export async function createRecipientAction(formData: FormData) {
  const type = formData.get('type') as 'PERSON' | 'COMPANY'
  const data: any = {
    type,
    recipientSalutation: formData.get('recipientSalutation') || null,
    recipientName: formData.get('recipientName') || null,
    recipientSurname: formData.get('recipientSurname') || null,
    companyName: formData.get('companyName') || null,
    recipientEmail: formData.get('recipientEmail'), 
    postalCode: formData.get('postalCode'),
    recipientCity: formData.get('recipientCity'),
    recipientStreet: formData.get('recipientStreet'),
    recipientCountry: formData.get('recipientCountry'),
  }

  // Validation: Set user-friendly error messages instead of throwing
  if (type === 'PERSON') {
    if (!data.recipientName || !data.recipientSurname) {
      return { error: 'Bitte Name und Nachname für Person ausfüllen.' }
    }
  }
  if (type === 'COMPANY' && !data.companyName) {
    return { error: 'Bitte Firmenname für Firma ausfüllen.' }
  }

  // Create the InvoiceRecipient
  const recipient = await db.invoiceRecipient.create({ data })
  // Redirect to the recipient detail page after successful creation
  return { redirect: `/invoiceRecipient/` }
}

// The vulnerability is in the lack of further input validation and sanitization.
// For example, you do not validate the email format, nor do you check the length or content of strings (e.g. someone could enter <script>alert(1)</script> as a name).