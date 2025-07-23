import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import { DownloadPDFLink } from '@/components/DownloadButton/DownloadButton'
import RemoveButton from '@/components/RemoveButton/RemoveButton'

// Server Actions
async function toggleInvoiceCancelled(formData: FormData) {
  'use server'
  const invoiceId = formData.get('invoiceId') as string
  const isCancelled = !!formData.get('isCancelled')
  if (!invoiceId) return
  await db.invoice.update({
    where: { id: invoiceId },
    data: { isCancelled },
  })
}

async function deleteInvoice(formData: FormData) {
  'use server'
  const invoiceId = formData.get('id') as string
  if (!invoiceId) return
  await db.invoice.update({
    where: { id: invoiceId },
    data: { deletedAt: new Date() },
  })
}

// Data Fetching
async function getInvoices() {
  try {
    return await db.invoice.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { courseRegistration: true },
    })
  } catch (error) {
    console.error('Error loading invoices:', error)
    return []
  }
}

export default async function InvoicePage() {
  const dbInvoices = await getInvoices()
  const invoices = dbInvoices
    .filter(inv => inv.courseRegistration)
    .map(inv => ({
      ...inv,
      sanitizedRegistration: inv.courseRegistration,
    }))

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        <Header />
        <div className="bg-white rounded-sm shadow border border-gray-100">
          {invoices.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-400 text-sm">
              Keine Rechnungen gefunden.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <TableHeader />
              {invoices.map(inv => (
                <InvoiceRow key={inv.id} invoice={inv} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Subcomponents
function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rechnungen</h1>
      <nav className="flex gap-2">
        <Link
          href="/invoice/deleted"
          className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
          title="Gelöschte Rechnungen"
        >
          <TrashIcon />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Startseite
        </Link>
      </nav>
    </div>
  )
}

function TableHeader() {
  return (
    <div className="hidden md:grid grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600">
      <div>Rechnungsnr</div>
      <div>Empfänger</div>
      <div>E-Mail</div>
      <div>Betrag</div>
      <div>Fällig am</div>
      <div>Zahlstatus</div>
      <div>Edit</div>
      <div>Status</div>
    </div>
  )
}

function InvoiceRow({ invoice }: { invoice: any }) {
  const {
    id,
    invoiceNumber,
    sanitizedRegistration,
    recipientSalutation,
    recipientName,
    recipientSurname,
    companyName,
    recipientEmail,
    finalAmount,
    dueDate,
    isCancelled,
    transactionNumber,
    courseRegistrationId,
  } = invoice

  const displayName = `${recipientSalutation ?? ''} ${recipientName ?? ''} ${recipientSurname ?? ''}`.trim()
  const recipient = companyName ? `${displayName} (${companyName})` : displayName

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_2fr_1fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition text-[13px]">
      <div className="font-medium text-blue-700 truncate">
        <DownloadPDFLink
          uuidString={sanitizedRegistration?.id ?? ''}
          filename={`${invoiceNumber}.pdf`}
          displayName={invoiceNumber}
        />
      </div>

      <div className="text-gray-700 truncate">{recipient}</div>

      <div className="text-blue-600 underline truncate hover:text-blue-800">
        {recipientEmail ?? '-'}
      </div>

      <div className="text-gray-700 truncate">{finalAmount?.toFixed(2)} €</div>

      <div className="text-gray-700 truncate">
        {dueDate ? format(new Date(dueDate), 'dd.MM.yyyy') : '-'}
      </div>

      <div className="text-sm font-medium">
        {transactionNumber && !isCancelled ? (
          <span className="text-green-700">bezahlt</span>
        ) : !isCancelled ? (
          <span className="text-yellow-600">nicht bezahlt</span>
        ) : (
          <span className="text-gray-400 italic">-</span>
        )}
      </div>

      <div>
        <Link
          href={`/invoice/${id}/edit`}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </Link>
      </div>

      <div className="text-sm text-center">
        <form action={toggleInvoiceCancelled}>
          <input type="hidden" name="invoiceId" value={id} />
          <input type="hidden" name="registrationId" value={courseRegistrationId ?? ''} />
          <button
            type="submit"
            name="isCancelled"
            value={isCancelled ? '' : 'on'}
            className={`px-2 py-1 rounded text-xs font-semibold transition ${
              isCancelled
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title={isCancelled ? 'Reaktivieren' : 'Stornieren'}
          >
            {isCancelled ? 'storniert' : 'aktiv'}
          </button>
        </form>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
      <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
    </svg>
  )
}
