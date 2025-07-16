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
    redirect(`/invoicerRecipient/create`)
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Rechnungsempfänger</h1>
        <div className="flex gap-2">
          {firstCourseRegistrationId && (
            <Link
               href="/invoiceRecipient/create"
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Add New Recipient"
              aria-label="Add New Recipient"
            >
              <Plus className="h-5 w-5" />
            </Link>
          )}
          <Link
            href="/"
            className="p-2 rounded-md bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition"
            title="Back to Home"
            aria-label="Back to Home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Typ</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Anrede</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Vorname</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Nachname</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Firma</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">E-Mail</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Ort</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-neutral-700">Land</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 bg-white">
            {recipients.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2 text-sm text-neutral-900">{r.type}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientSalutation ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientName ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientSurname ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.companyName ?? '-'}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientEmail}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientCity}</td>
                <td className="px-4 py-2 text-sm text-neutral-700">{r.recipientCountry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
