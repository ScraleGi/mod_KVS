import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

interface InvoicePageProps {
  params: {
    id: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = params

  const invoice = await prisma.invoice.findUnique({
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

  if (!invoice) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        <div className="text-red-600 text-lg font-semibold">Invoice not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">Invoice #{invoice.transactionNumber}</h1>
        <div className="mb-4">
          <span className="font-semibold">Amount:</span> €{invoice.amount}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Status:</span> {invoice.isCancelled ? "Cancelled" : "Active"}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Recipient:</span> {invoice.recipient?.name} ({invoice.recipient?.email || "No email"})
        </div>
        <div className="mb-4">
          <span className="font-semibold">Participant:</span> {invoice.courseRegistration?.participant?.name}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Course:</span> {invoice.courseRegistration?.course?.program?.name}
        </div>
        <Link href="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}