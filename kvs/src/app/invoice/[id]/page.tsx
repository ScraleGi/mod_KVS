import { PrismaClient, RecipientType } from '../../../../generated/prisma'
import Link from 'next/link'

const prisma = new PrismaClient()

interface InvoicePageProps {
  params: {
    id: string
  }
}

function formatRecipient(recipient: any) {
  if (!recipient) return 'N/A'
  if (recipient.type === RecipientType.COMPANY) {
    return (
      <>
        {recipient.companyName}
        <span className="text-gray-400 text-xs ml-1">
          ({recipient.recipientEmail || "No email"})
        </span>
        <div className="text-xs text-gray-400">
          {recipient.recipientStreet}, {recipient.postalCode} {recipient.recipientCity}, {recipient.recipientCountry}
        </div>
      </>
    )
  }
  return (
    <>
      {recipient.recipientName} {recipient.recipientSurname}
      <span className="text-gray-400 text-xs ml-1">
        ({recipient.recipientEmail || "No email"})
      </span>
      <div className="text-xs text-gray-400">
        {recipient.recipientStreet}, {recipient.postalCode} {recipient.recipientCity}, {recipient.recipientCountry}
      </div>
    </>
  )
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = params

  const invoiceRaw = await prisma.invoice.findUnique({
    where: { id },
    include: {
      recipient: true,
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

  if (!invoiceRaw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <Link href="/" className="text-blue-500 hover:underline mb-6 block">
            &larr; Back to Home
          </Link>
          <div className="text-red-600 text-lg font-semibold">Invoice not found.</div>
        </div>
      </div>
    )
  }

  // Convert Decimal to string for serialization
  const invoice = {
    ...invoiceRaw,
    amount: invoiceRaw.amount.toString(),
  }

  const invoiceFields = [
    {
      label: 'Amount',
      value: <>€{invoice.amount}</>,
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
          ? <>Paid <span className="text-xs text-neutral-400">({invoice.transactionNumber})</span></>
          : "Unpaid",
    },
    {
      label: 'Recipient',
      value: formatRecipient(invoice.recipient),
    },
    {
      label: 'Participant',
      value: invoice.courseRegistration?.participant
        ? `${invoice.courseRegistration.participant.salutation} ${invoice.courseRegistration.participant.title ? invoice.courseRegistration.participant.title + ' ' : ''}${invoice.courseRegistration.participant.name} ${invoice.courseRegistration.participant.surname}`
        : 'N/A',
    },
    {
      label: 'Course',
      value: invoice.courseRegistration?.course?.program?.name,
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-sm shadow border border-gray-100 p-8 max-w-xl w-full">
        <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
          Invoice #{invoice.invoiceNumber}
        </h1>
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
        <div className="flex flex-row gap-6 mt-8">
          <Link
            href={`/participant/${invoice.courseRegistration?.participant?.id}`}
            className="text-blue-500 hover:underline text-sm"
          >
            &larr; Back to Participant
          </Link>
          <Link
            href={`/course/${invoice.courseRegistration?.course?.id}`}
            className="text-blue-500 hover:underline text-sm"
          >
            &larr; Back to Course
          </Link>
          <Link href="/" className="text-blue-500 hover:underline text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}