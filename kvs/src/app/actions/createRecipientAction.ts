"use server"
import { db } from '@/lib/db'

/**
 * Server action for creating an InvoiceRecipient.
 * Returns { error: string } for validation issues, otherwise { redirect: string }.
 */
export async function createRecipientAction(formData: FormData) {
  const type = formData.get('type') as 'PERSON' | 'COMPANY'
  const payload = {
    type,
    recipientSalutation: formData.get('recipientSalutation') as string | null,
    recipientName: formData.get('recipientName') as string | null,
    recipientSurname: formData.get('recipientSurname') as string | null,
    companyName: formData.get('companyName') as string | null,
    recipientEmail: formData.get('recipientEmail') as string,
    postalCode: formData.get('postalCode') as string,
    recipientCity: formData.get('recipientCity') as string,
    recipientStreet: formData.get('recipientStreet') as string,
    recipientCountry: formData.get('recipientCountry') as string,
  }

  // Validation
  if (type === 'PERSON' && (!payload.recipientName || !payload.recipientSurname)) {
    return { error: 'Bitte Name und Nachname für Person ausfüllen.' }
  }
  if (type === 'COMPANY' && !payload.companyName) {
    return { error: 'Bitte Firmenname für Firma ausfüllen.' }
  }

  // Check for exact duplicate
  const existing = await db.invoiceRecipient.findFirst({
    where: {
      deletedAt: null,
      ...payload,
    }
  })
  if (existing) {
    // Already have one with identical values → just redirect to it
    return { redirect: `/invoiceRecipient/${existing.id}` }
  }

  // Otherwise create new
  const recipient = await db.invoiceRecipient.create({ data: payload })
  return { redirect: `/invoiceRecipient/${recipient.id}` }
}

// The vulnerability is in the lack of further input validation and sanitization.
// For example, you do not validate the email format, nor do you check the length or content of strings (e.g. someone could enter <script>alert(1)</script> as a name).