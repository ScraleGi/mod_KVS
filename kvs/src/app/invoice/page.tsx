import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import { DownloadPDFLink } from '@/components/DownloadButton/DownloadButton'

//---------------------------------------------------
// DATA FETCHING
//---------------------------------------------------
async function getInvoices() {
  try {
    // Include courseRegistration if you need its id for the PDF link
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

  // Sanitize to guarantee we have courseRegistration for PDF
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
              href="/invoice/create"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              title="Neue Rechnung erstellen"
            >
              <Plus className="h-5 w-5" />
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
            <div className="hidden md:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_0.5fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600 rounded-t-sm border-b border-gray-200">
              <div>Rechnungsnr</div>
              <div>Empfänger</div>
              <div>E-Mail</div>
              <div>Betrag</div>
              <div>Fällig am</div>
              <div>Status</div>
              <div>Edit</div>
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
                className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_0.5fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition group text-[13px]"
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
                  {inv.recipientName} {inv.recipientSurname}
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

                {/* Status */}
                <div className="text-gray-700 text-sm truncate">
                  {inv.isCancelled ? (
                    <span className="text-red-600 font-semibold">storniert</span>
                  ) : (
                    <span className="text-green-600 font-semibold">aktiv</span>
                  )}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}