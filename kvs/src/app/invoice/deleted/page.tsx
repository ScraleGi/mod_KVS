import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDate } from '@/lib/utils'
import { DownloadPDFLink } from '@/components/DownloadButton/DownloadButton'


/**
 * Server action to restore a soft-deleted invoice
 */
async function restoreInvoice(formData: FormData) {
  'use server'
  const id = formData.get('id') as string

  await db.invoice.update({
    where: { id },
    data: { deletedAt: null },
  })

  redirect('/invoice?restored=1')
}

/**
 * Page component for displaying and managing deleted invoices
 */
export default async function DeletedInvoicesPage() {
  // Fetch all deleted invoices with their registration/recipient info
  const deletedInvoicesData = await db.invoice.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    include: {
      courseRegistration: true,
    },
  })

  // Sanitize data to handle any Decimal values
  const deletedInvoices = sanitize(deletedInvoicesData)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">

      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Archivierte Rechnungen</h1>
          
          {/* Show message when no deleted invoices exist */}
          {deletedInvoices.length === 0 ? (
            <p className="text-gray-500 text-sm"><b>Keine archivierten Rechnungen gefunden.</b></p>
          ) : (
            <ul className="space-y-4">
              {deletedInvoices.map(invoice => (
          <li
            key={invoice.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center">
              <span className="font-semibold text-gray-800">
                <DownloadPDFLink
                  uuidString={invoice.courseRegistration?.id ?? ''}
                  filename={`${invoice.invoiceNumber}.pdf`}
                  displayName={invoice.invoiceNumber}
                />
              </span>
              <span className="ml-4 text-gray-500 text-xs">
                <b>{invoice.finalAmount !== null ? invoice.finalAmount.toString() : ''} €</b>
              </span>
              {invoice.deletedAt && (
                <span className="ml-4 text-red-500 text-xs">
                  <b>Archiviert: {formatDate(invoice.deletedAt)}</b>
                </span>
              )}
            </div>
            {/* Restore form */}
            <form action={restoreInvoice}>
              <input type="hidden" name="id" value={invoice.id} />
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                aria-label={`Restore invoice ${invoice.invoiceNumber || invoice.id}`}
              >
                Wiederherstellen
              </button>
            </form>
          </li>
              ))}
            </ul>
          )}
          
          {/* Navigation back to invoices list */}
          <Link
            href="/invoice"
            className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zur Rechnungsübersicht
          </Link>
        </div>
      </div>
    </div>
  )
}