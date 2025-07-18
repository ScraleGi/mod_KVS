import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import { DownloadPDFLink } from '@/components/DownloadButton/DownloadButton'
import RemoveButton from '@/components/RemoveButton/RemoveButton'

//---------------------------------------------------
// SERVER ACTION (local logic, no API route needed!)
//---------------------------------------------------
async function toggleInvoiceCancelled(formData: FormData) {
  "use server";
  const invoiceId = formData.get("invoiceId") as string;
  const isCancelled = !!formData.get("isCancelled");
  if (!invoiceId) return;
  await db.invoice.update({
    where: { id: invoiceId },
    data: { isCancelled },
  });
}

async function deleteInvoice(formData: FormData) {
  "use server";
  const invoiceId = formData.get("id") as string;
  if (!invoiceId) return;
  await db.invoice.update({
    where: { id: invoiceId },
    data: { deletedAt: new Date() },
  });
}

//---------------------------------------------------
// DATA FETCHING
//---------------------------------------------------
async function getInvoices() {
  try {
    return await db.invoice.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        courseRegistration: true,
      },
    })
  } catch (error) {
    console.error('Error loading invoices:', error)
    return []
  }
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function InvoicePage() {
  const dbInvoices = await getInvoices()
  const sanitizedInvoices = dbInvoices
    .filter(inv => inv.courseRegistration && inv.deletedAt === null)
    .map(inv => ({
      ...inv,
      sanitizedRegistration: inv.courseRegistration,
    }))

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rechnungen</h1>
          <nav className="flex gap-2">
            <Link
              href="/invoice/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Deleted Invoices"
              aria-label="Deleted Invoices"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition"
              title="Zurück zur Startseite"
            >
              <ArrowLeft className="h-5 w-5" />
              Startseite
            </Link>
          </nav>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="divide-y divide-gray-100">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600 rounded-t-sm border-b border-gray-200">
              <div>Rechnungsnr</div>
              <div>Empfänger</div>
              <div>E-Mail</div>
              <div>Betrag</div>
              <div>Fällig am</div>
              <div>Status</div>
              <div>Edit</div>
              <div>Delete</div>
            </div>

            {/* Empty state */}
            {sanitizedInvoices.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">
                Keine Rechnungen gefunden.
              </div>
            )}

            {/* List rows */}
            {sanitizedInvoices.map((inv) => (
              <div
                key={inv.id}
                className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition group text-[13px]"
              >
                {/* Download Link */}
                <div className="font-medium text-blue-700 hover:text-blue-900 truncate">
                  <DownloadPDFLink
                    uuidString={inv.sanitizedRegistration?.id ?? ''}
                    filename={`${inv.invoiceNumber}.pdf`}
                    displayName={inv.invoiceNumber}
                  />
                </div>

                {/* Recipient */}
                <div className="text-gray-700 truncate">
                  {inv.recipientSalutation ? inv.recipientSalutation + ' ' : ''}
                  {inv.recipientName ?? ''}
                  {inv.recipientSurname ? ' ' + inv.recipientSurname : ''}
                  {inv.companyName ? ` (${inv.companyName})` : ''}
                </div>

                {/* Email */}
                <div className="text-blue-600 underline decoration-dotted decoration-blue-400 hover:text-blue-800 truncate">
                  {inv.recipientEmail ?? '-'}
                </div>

                {/* Amount */}
                <div className="text-gray-700 truncate">
                  {inv.finalAmount?.toFixed(2)} €
                </div>

                {/* Due Date */}
                <div className="text-gray-700 truncate">
                  {inv.dueDate ? format(new Date(inv.dueDate), 'dd.MM.yyyy') : '-'}
                </div>

                {/* Status - Clickable toggle with Server Action */}
                <div className="text-gray-700 text-sm truncate text-center">
                  <form action={toggleInvoiceCancelled} className="inline">
                    <input type="hidden" name="invoiceId" value={inv.id} />
                    <input type="hidden" name="registrationId" value={inv.courseRegistrationId ?? ""} />
                    <button
                      type="submit"
                      name="isCancelled"
                      value={inv.isCancelled ? "" : "on"}
                      className={`px-2 py-1 rounded text-xs font-semibold transition
                        ${inv.isCancelled
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"}
                      `}
                      title={inv.isCancelled ? "Reaktivieren" : "Stornieren"}
                    >
                      {inv.isCancelled ? "storniert" : "aktiv"}
                    </button>
                  </form>
                  <br />
                  {inv.transactionNumber && !inv.isCancelled ? (
                    <span className="text-green-700 font-medium">bezahlt</span>
                  ) : (
                    !inv.isCancelled && <span className="text-yellow-600 font-medium">nicht bezahlt</span>
                  )}
                </div>

                {/* Edit */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/invoice/${inv.id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Rechnung bearbeiten"
                  >
                    Edit
                  </Link>
                </div>

                {/* Delete - Using RemoveButton */}
                <div className="flex items-center space-x-2 ">
                  <RemoveButton
                    itemId={inv.id}
                    onRemove={deleteInvoice}
                    title="Delete Invoice"
                    message="Are you sure you want to delete this invoice? It will be moved to the deleted invoices section."
                    fieldName="id"
                    customButton={
                      <button
                        type="submit"
                        className="px-3 py-1.5 cursor-pointer bg-red-300 border border-gray-300 rounded text-sm text-gray-600 hover:bg-red-400  hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          Archivieren
                        </div>
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}