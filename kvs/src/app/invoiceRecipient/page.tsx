import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'

//---------------------------------------------------
// DATA FETCHING
//---------------------------------------------------
async function getInvoiceRecipients() {
  try {
    return await db.invoiceRecipient.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error loading recipients:', error)
    return []
  }
}

async function getFirstCourseRegistrationId(): Promise<string | null> {
  try {
    const first = await db.courseRegistration.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    })
    return first?.id ?? null
  } catch (error) {
    console.error('Error loading first course registration:', error)
    return null
  }
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function InvoiceRecipientPage() {
  const [recipients, firstCourseRegistrationId] = await Promise.all([
    getInvoiceRecipients(),
    getFirstCourseRegistrationId(),
  ])

  if (recipients.length === 0 && firstCourseRegistrationId) {
    redirect('/invoiceRecipient/create')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Rechnungsempfänger</h1>
          <nav className="flex gap-2">
            {firstCourseRegistrationId && (
              <Link
                href="/invoiceRecipient/create"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                aria-label="Neuen Rechnungsempfänger hinzufügen"
                title="Neuen Rechnungsempfänger hinzufügen"
              >
                <Plus className="h-5 w-5" />
              </Link>
            )}

            <Link
              href="/invoiceRecipient/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Teilnehmer löschen"
              aria-label="Teilnehmer löschen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                  <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
              </svg>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition"
              aria-label="Zurück zur Startseite"
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
            <div className="hidden md:grid grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr_2fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600 rounded-t-sm border-b border-gray-200">
              <div>Typ</div>
              <div>Anrede</div>
              <div>Vorname</div>
              <div>Nachname</div>
              <div>Firma</div>
              <div>E-Mail</div>
              <div>PLZ</div>
              <div>Ort</div>
              <div>Land</div>
              <div>Edit</div>
            </div>

            {/* Empty state */}
            {recipients.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">
                Keine Rechnungsempfänger gefunden.
              </div>
            )}

            {/* List rows */}
            {recipients.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_1.5fr_2fr_1fr_1fr_1fr_0.7fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition group text-[13px]"
              >
                <div className="font-medium text-gray-900 truncate">{r.type}</div>
                <div className="text-gray-700 truncate">{r.recipientSalutation ?? '-'}</div>
                <div className="text-gray-700 truncate">{r.recipientName ?? '-'}</div>
                <div className="text-gray-700 truncate">{r.recipientSurname ?? '-'}</div>
                <div className="text-gray-700 truncate">{r.companyName ?? '-'}</div>
                <div className="text-blue-600 underline decoration-dotted decoration-blue-400 hover:text-blue-800 truncate">
                  {r.recipientEmail}
                </div>
                <div className="text-gray-700 truncate">{r.postalCode ?? '-'}</div>
                <div className="text-gray-700 truncate">{r.recipientCity ?? '-'}</div>
                <div className="text-gray-700 truncate">{r.recipientCountry ?? '-'}</div>
                {/* Edit button in separate column */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/invoiceRecipient/${r.id}/edit`}
                    className="text-blue-600 hover:text-blue-800"
                    title="Rechnungsempfänger bearbeiten"
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