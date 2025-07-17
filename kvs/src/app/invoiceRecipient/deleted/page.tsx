//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { sanitize } from '@/lib/sanitize'


//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
// Server action to restore an invoice recipient
async function restoreRecipient(formData: FormData) {
  'use server'
  try {
    const id = formData.get('id') as string
    await db.invoiceRecipient.update({
      where: { id },
      data: { deletedAt: null },
    })
  } catch (error) {
    console.error('Failed to restore recipient:', error)
    throw error
  }

  redirect('/invoiceRecipient?restored=1')
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function DeletedInvoiceRecipientsPage() {
  try {
    //---------------------------------------------------
    // DATA FETCHING
    //---------------------------------------------------
    const deletedRecipientsData = await db.invoiceRecipient.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    })

    // Sanitize data to handle any special types
    const deletedRecipients = sanitize(deletedRecipientsData)

    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen bg-neutral-50 py-10 px-4 flex items-center justify-center">
       {/* // ClientToasterWrapper is a client component for notifications */}
        <div className="w-full max-w-2xl">
          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
            <Link href="/invoiceRecipient" className="hover:underline text-gray-700">Rechnungsempfänger</Link>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">Archiv</span>
          </nav>
          <div className="bg-white rounded-2xl shadow-md border border-neutral-100 px-8 py-10">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6 tracking-tight">Archivierte Rechnungsempfänger</h1>

            {deletedRecipients.length === 0 ? (
              <div className="text-neutral-500 text-sm bg-neutral-50 p-4 rounded-lg">
                Keine archivierten Rechnungsempfänger gefunden.
              </div>
            ) : (
              <ul className="space-y-4">
                {deletedRecipients.map(recipient => (
                  <li
                    key={recipient.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-neutral-800">
                        {recipient.companyName
                          ? recipient.companyName
                          : `${recipient.recipientName ?? ''} ${recipient.recipientSurname ?? ''}`.trim()}
                      </span>
                      <span className="ml-4 text-neutral-500 text-xs">
                        {recipient.recipientEmail}
                      </span>
                      <div className="text-neutral-400 text-xs mt-1">
                        Archiviert am: {recipient.deletedAt ? new Date(recipient.deletedAt).toLocaleDateString('de-DE') : 'Unbekanntes Datum'}
                      </div>
                    </div>
                    <form action={restoreRecipient}>
                      <input type="hidden" name="id" value={recipient.id} />
                      <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        Wiederherstellen
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading deleted invoice recipients:', error)
    //---------------------------------------------------
    // ERROR STATE
    //---------------------------------------------------
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4 bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">
            Beim Laden der archivierten Rechnungsempfänger ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.
          </p>
          <Link href="/invoiceRecipient" className="text-blue-500 hover:text-blue-700">
            &larr; Rechnungsempfänger
          </Link>
        </div>
      </div>
    )
  }
}