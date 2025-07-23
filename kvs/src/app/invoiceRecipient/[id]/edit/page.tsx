import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { RecipientType } from '../../../../../generated/prisma'

/**
 * InvoiceRecipient Edit Page - Allows editing of invoice recipient details
 */
export default async function EditInvoiceRecipientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch the recipient to edit
  const recipient = await db.invoiceRecipient.findUnique({
    where: { id },
  })

  // Show error if recipient not found
  if (!recipient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Kein Rechnungsempfänger gefunden.</div>
      </div>
    )
  }

  /**
   * Server action to update recipient details
   */
  const changeRecipient = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const type = formData.get('type') as RecipientType
    const recipientSalutation = formData.get('recipientSalutation') as string
    const recipientName = formData.get('recipientName') as string
    const recipientSurname = formData.get('recipientSurname') as string
    const companyName = formData.get('companyName') as string
    const recipientEmail = formData.get('recipientEmail') as string
    const recipientStreet = formData.get('recipientStreet') as string
    const postalCode = formData.get('postalCode') as string
    const recipientCity = formData.get('recipientCity') as string
    const recipientCountry = formData.get('recipientCountry') as string

    await db.invoiceRecipient.update({
      where: { id },
      data: {
        type,
        recipientSalutation,
        recipientName,
        recipientSurname, 
        companyName,
        recipientEmail,
        recipientStreet,
        postalCode,
        recipientCity,
        recipientCountry,
      },
    })
    redirect(`/invoiceRecipient?edited=1`)
  }

  /**
   * Server action to soft delete a recipient
   */
  async function deleteRecipient(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.invoiceRecipient.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    redirect('/invoiceRecipient/deleted?deleted=1')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Rechnungsempfänger bearbeiten
            </h1>
            <form action={changeRecipient} className="space-y-6">
              <input type="hidden" name="id" value={recipient.id} />
              <fieldset className="border border-neutral-200 rounded-lg p-5">
                <legend className="text-base font-semibold text-blue-700 px-2">
                  Rechnungsempfänger
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Empfänger
                    <select
                      name="type"
                      required
                      defaultValue={recipient.type}
                      className="mt-1 border rounded px-2 py-1"
                    >
                      <option value="PERSON">Person</option>
                      <option value="COMPANY">Firma</option>
                    </select>
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Anrede (Empfänger)
                    <input
                      name="recipientSalutation"
                      defaultValue={recipient.recipientSalutation ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Name (Empfänger)
                    <input
                      name="recipientName"
                      defaultValue={recipient.recipientName ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Nachname (Empfänger)
                    <input
                      name="recipientSurname"
                      defaultValue={recipient.recipientSurname ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Firmen Name (Empfänger)
                    <input
                      name="companyName"
                      defaultValue={recipient.companyName ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Email (Empfänger)
                    <input
                      name="recipientEmail"
                      type="email"
                      required
                      defaultValue={recipient.recipientEmail ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                    Straße (Empfänger)
                    <input
                      name="recipientStreet"
                      required
                      defaultValue={recipient.recipientStreet ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    PLZ (Empfänger)
                    <input
                      name="postalCode"
                      required
                      defaultValue={recipient.postalCode ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700">
                    Ort (Empfänger)
                    <input
                      name="recipientCity"
                      required
                      defaultValue={recipient.recipientCity ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                    Land (Empfänger)
                    <input
                      name="recipientCountry"
                      required
                      defaultValue={recipient.recipientCountry ?? ''}
                      className="mt-1 border rounded px-2 py-1"
                    />
                  </label>
                </div>
              </fieldset>
              <div className="flex justify-between mt-6">
                <Link
                  href="/invoiceRecipient"
                  className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
                >
                  Abbrechen
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
          {/* Danger Zone Section */}
          <div className="border-t border-gray-200 mt-2"></div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Archiv</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Dadurch wird der Rechnungsempfänger archiviert.
                </p>
              </div>
              <form action={deleteRecipient}>
                <input type="hidden" name="id" value={recipient.id} />
                <button
                  type="submit"
                  className="px-3 py-1.5 cursor-pointer bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Archivieren
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}