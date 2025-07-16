import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { SanitizedInvoiceWithRelations, SanitizedInvoiceRecipient } from '@/types/query-models'
import { Pencil } from 'lucide-react' // Import the pencil icon (or use SVG if you prefer)

//---------------------------------------------------
// HELPER FUNCTIONS
//---------------------------------------------------
function formatRecipient(recipient: SanitizedInvoiceRecipient | null) {
  if (!recipient) return 'N/A'
  
  const name = recipient.type === 'COMPANY' 
    ? recipient.companyName 
    : `${recipient.recipientName || ''} ${recipient.recipientSurname || ''}`.trim()
  
  return (
    <div>
      <div className="font-medium text-gray-800">{name || 'Unknown'}</div>
      
      {/* Email field */}
      <div className="flex items-center mt-2">
        <span className="text-xs text-gray-500 w-16 flex-shrink-0">Email:</span>
        <span className="text-xs text-gray-700">{recipient.recipientEmail || "No email"}</span>
      </div>
      
      {/* Address field */}
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500 w-16 flex-shrink-0">Address:</span>
        <span className="text-xs text-gray-700">
          {recipient.recipientStreet && recipient.postalCode && recipient.recipientCity && recipient.recipientCountry ? 
            `${recipient.recipientStreet}, ${recipient.postalCode} ${recipient.recipientCity}, ${recipient.recipientCountry}` :
            'No address provided'
          }
        </span>
      </div>
    </div>
  )
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //---------------------------------------------------
  // DATA FETCHING
  //---------------------------------------------------
  const { id } = await params

  const invoiceData = await db.invoice.findUnique({
    where: { id },
    include: {
      courseRegistration: {
        include: {
          participant: true,
          course: {
            include: {
              program: true,
            },
          },
        },
      },
    },
  })

  //---------------------------------------------------
  // EARLY RETURN FOR MISSING DATA
  //---------------------------------------------------
  if (!invoiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 block">
            &larr; Back to Home
          </Link>
          <div className="text-red-600 text-lg font-semibold">Invoice not found.</div>
        </div>
      </div>
    )
  }

  // Sanitize data and cast to the correct type
  const invoice = sanitize(invoiceData) as SanitizedInvoiceWithRelations;

  //---------------------------------------------------
  // INVOICE FIELD DEFINITIONS
  //---------------------------------------------------
  const invoiceFields = [
    {
      label: 'Course',
      value: invoice.courseRegistration?.course?.program?.name || 'N/A',
    },
    {
      label: 'Course Code',
      value: invoice.courseRegistration?.course?.code || 'N/A',
    },
    {
      label: 'Amount',
      value: <>€{invoice.finalAmount}</>,
    },
    {
      label: 'Due Date',
      value: new Date(invoice.dueDate).toLocaleDateString('de-DE'),
    },
    {
      label: 'Status',
      value: invoice.isCancelled
        ? "Cancelled"
        : invoice.transactionNumber
          ? <>Paid <span className="text-xs text-gray-400">({invoice.transactionNumber})</span></>
          : "Unpaid",
    },
    {
      label: 'Recipient',
      value: formatRecipient(invoice.recipient || null),
    },
    {
      label: 'Participant',
      value: invoice.courseRegistration?.participant
        ? `${invoice.courseRegistration.participant.salutation} ${invoice.courseRegistration.participant.title ? invoice.courseRegistration.participant.title + ' ' : ''}${invoice.courseRegistration.participant.name} ${invoice.courseRegistration.participant.surname}`
        : 'N/A',
    },
  ]

  //---------------------------------------------------
  // RENDER UI
  //---------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow border border-gray-100 p-8 max-w-xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Rechnung #{invoice.invoiceNumber}
          </h1>
          
          {/* Add Edit button */}
          <Link
            href={`/invoice/${id}/edit`}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 transition text-sm font-medium"
          >
            <Pencil size={14} />
            Edit Invoice
          </Link>
        </div>
        
        {/* Invoice Details Table */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center border-b border-gray-200 py-1 bg-gray-50 rounded-t">
            <div className="text-xs font-semibold text-gray-500 flex-1 px-1">Field</div>
            <div className="text-xs font-semibold text-gray-500 flex-1 px-1">Value</div>
          </div>
          {invoiceFields.map((field, idx) => (
            <div
              key={idx}
              className="flex items-center bg-white hover:bg-blue-50 transition rounded border-b border-gray-100 group"
            >
              <div className="px-1 py-2 flex-1 text-sm font-medium text-gray-700">{field.label}</div>
              <div className="px-1 py-2 flex-1 text-sm text-gray-700">{field.value}</div>
            </div>
          ))}
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap gap-6 mt-8 justify-end">
          {invoice.courseRegistration?.id && (
            <Link
              href={`/courseregistration/${invoice.courseRegistration.id}`}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              &larr; Back to Registration
            </Link>
          )}
          
          <Link href="/" className="text-blue-500 hover:text-blue-700 text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}