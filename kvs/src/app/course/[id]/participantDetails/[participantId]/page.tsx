import { PrismaClient, RecipientType } from '../../../../../../generated/prisma/client'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import type { Invoice, Document } from '../../../../../../generated/prisma/client'

const prisma = new PrismaClient()

export default async function ParticipantDetailsPage({
  params,
}: {
  params: { id: string, participantId?: string } | Promise<{ id: string, participantId?: string }>
}) {
  const { id, participantId } = await params
  const courseId = id

  if (!participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href={`/course/${courseId}`} className="text-blue-500 hover:underline mb-6 block">
            &larr; Back to Course
          </Link>
          <div className="text-red-600 text-lg font-semibold">No participant selected.</div>
        </div>
      </div>
    )
  }

  // Fetch registration for this participant in this course
  const registration = await prisma.courseRegistration.findFirst({
    where: {
      courseId,
      participantId,
    },
    include: {
      participant: true,
      course: { include: { program: true } },
      invoices: true,
      coupon: true,
    }
  })

  // Fetch documents for this registration (not soft-deleted)
  const documents = registration
    ? await prisma.document.findMany({
        where: {
          courseRegistrationId: registration.id,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  // Server action to add an invoice for this registration
  async function addInvoice(formData: FormData) {
    'use server'
    const amount = parseFloat(formData.get('amount') as string)
    const dueDateString = formData.get('dueDate') as string
    const recipientType = formData.get('recipientType') as RecipientType
    const recipientName = formData.get('recipientName') as string
    const recipientEmail = formData.get('recipientEmail') as string | null
    const recipientAddress = formData.get('recipientAddress') as string | null

    if (!recipientType || !recipientName) {
      throw new Error('Recipient type and name are required.')
    }

    const recipient = await prisma.invoiceRecipient.create({
      data: {
        type: recipientType,
        name: recipientName,
        email: recipientEmail || null,
        address: recipientAddress || null,
      }
    })

    const transactionNumber = `INV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    await prisma.invoice.create({
      data: {
        courseRegistrationId: registration!.id,
        amount,
        transactionNumber,
        dueDate: dueDateString ? new Date(dueDateString) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        recipientId: recipient.id,
      }
    })
    revalidatePath(`/course/${courseId}/participantDetails?participantId=${participantId}`)
  }

  // Server action to remove an invoice
  async function removeInvoice(formData: FormData) {
    "use server"
    const invoiceId = formData.get("invoiceId") as string
    await prisma.invoice.delete({
      where: { id: invoiceId }
    })
    revalidatePath(`/course/${courseId}/participantDetails?participantId=${participantId}`)
  }

  // Server action to remove a document (soft delete)
  async function removeDocument(formData: FormData) {
    "use server"
    const documentId = formData.get("documentId") as string
    await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() }
    })
    revalidatePath(`/course/${courseId}/participantDetails?participantId=${participantId}`)
  }

  if (!registration || !registration.participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href={`/course/${courseId}`} className="text-blue-500 hover:underline mb-6 block">
            &larr; Back to Course
          </Link>
          <div className="text-red-600 text-lg font-semibold">Participant not found for this course.</div>
        </div>
      </div>
    )
  }

  // Invoice listing data for this registration
  const invoiceFields: {
    label: string,
    render: (inv: Invoice) => React.ReactNode,
    width?: string
  }[] = [
    {
      label: 'Invoice',
      render: (inv) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/invoice/${inv.id}`}
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            #{inv.transactionNumber ?? inv.id}
          </Link>
        </div>
      ),
      width: 'flex-[2]'
    },
    {
      label: 'Amount',
      render: (inv) => (
        <div className="flex items-center h-full text-neutral-700 text-sm">€{inv.amount}</div>
      ),
      width: 'flex-1'
    }
  ]

  // Document listing fields
  const documentFields: {
    label: string,
    render: (doc: Document) => React.ReactNode,
    width?: string
  }[] = [
    {
      label: 'Document',
      render: (doc) => (
        <div className="flex items-center gap-2">
          <a
            href={doc.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            {doc.file.split('/').pop()}
          </a>
        </div>
      ),
      width: 'flex-[2]'
    },
    {
      label: 'File',
      render: (doc) => (
        <div className="flex items-center h-full text-neutral-700 text-sm">
          {(() => {
            const ext = doc.file.split('.').pop()?.toUpperCase() || '';
            return ext;
          })()}
        </div>
      ),
      width: 'flex-1'
    },
    {
      label: 'Role',
      render: (doc) => (
        <div className="flex items-center h-full text-neutral-700 text-sm">{doc.role}</div>
      ),
      width: 'flex-1'
    }
  ]

  function AlignedList<T>({
    items,
    fields,
    actions,
    emptyText,
    addButton,
  }: {
    items: T[]
    fields: { label: string, render: (item: T) => React.ReactNode, width?: string }[]
    actions?: (item: T) => React.ReactNode
    emptyText?: string
    addButton?: React.ReactNode
  }) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center border-b border-neutral-200 py-1 bg-neutral-50 rounded-t">
          {fields.map((f, i) => (
            <div key={i} className={`text-xs font-semibold text-neutral-500 ${f.width ?? 'flex-1'} px-1`}>
              {f.label}
            </div>
          ))}
          {actions && <div className="w-10 flex-shrink-0 text-right">{addButton}</div>}
        </div>
        {items.length === 0 && (
          <div className="flex items-center px-2 py-2 text-neutral-400 italic text-sm bg-white rounded">
            {emptyText}
          </div>
        )}
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center bg-white hover:bg-sky-50 transition rounded border-b border-neutral-100 group">
            {fields.map((f, i) => (
              <div key={i} className={`px-1 py-2 ${f.width ?? 'flex-1'}`}>
                {f.render(item)}
              </div>
            ))}
            {actions && (
              <div className="w-10 flex-shrink-0 text-right">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-neutral-100 p-0 overflow-hidden">
        {/* Profile Card */}
        <section className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 border-b border-neutral-200">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-700 select-none">
            {registration.participant.name[0]}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-neutral-900">
              <Link
                href={`/participant/${registration.participant.id}`}
                className="hover:underline text-blue-700"
              >
                {registration.participant.name}
              </Link>
            </h1>
            <div className="flex flex-wrap gap-4 text-neutral-500 text-sm mt-1">
              <span>
                <span className="font-medium text-neutral-700">Email:</span> {registration.participant.email}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Phone:</span> {registration.participant.phoneNumber}
              </span>
            </div>
          </div>
        </section>

        {/* Registration Details */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-800 mb-2">Details</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-neutral-700">
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-600">Course:</span>
              <Link
                href={`/course/${registration.course?.id}`}
                className="text-blue-700 hover:text-blue-900 font-medium"
              >
                {registration.course?.program?.name ?? 'Unknown Course'}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-600">Status:</span>
              <span className="text-neutral-600">{registration.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-600">Start:</span>
              <span className="text-neutral-600">
                {registration.course?.startDate
                  ? new Date(registration.course.startDate).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            {registration.coupon && (
              <div className="flex items-center gap-1 text-green-700">
                <span className="font-medium">Coupon:</span>
                <span className="font-semibold">{registration.coupon.code}</span>
                {registration.coupon.percent && (
                  <span className="ml-1 text-xs">({registration.coupon.percent}% off)</span>
                )}
                {registration.coupon.amount && (
                  <span className="ml-1 text-xs">({registration.coupon.amount}€ off)</span>
                )}
              </div>
            )}
            {registration.discount && (
              <div className="flex items-center gap-1 text-violet-700">
                <span className="font-medium">Extra Discount:</span>
                <span className="font-semibold">€{registration.discount}</span>
              </div>
            )}
          </div>
        </section>

        {/* Invoices Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <AlignedList<Invoice>
            items={registration.invoices}
            fields={invoiceFields}
            actions={inv => (
              <form action={removeInvoice}>
                <input type="hidden" name="invoiceId" value={inv.id} />
                <button
                  type="submit"
                  className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                  title="Remove invoice"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                  </svg>
                </button>
              </form>
            )}
            emptyText="No invoices found"
          />
        </section>

        {/* Documents Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <AlignedList<Document>
            items={documents}
            fields={documentFields}
            actions={doc => (
              <form action={removeDocument}>
                <input type="hidden" name="documentId" value={doc.id} />
                <button
                  type="submit"
                  className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                  title="Remove document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                  </svg>
                </button>
              </form>
            )}
            emptyText="No documents found"
          />
          <div className="flex justify-start mt-4">
            <Link
              href={`/course/${courseId}/participantDetails/deleted?participantId=${participantId}`}
              className="text-neutral-400 hover:text-orange-600 text-sm transition"
            >
              View Deleted Documents
            </Link>
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex gap-4 justify-end px-8 py-6">
          <Link href={`/course/${courseId}`} className="text-neutral-400 hover:text-blue-600 text-sm transition">
            &larr; Back to Course
          </Link>
          <Link href="/" className="text-neutral-400 hover:text-blue-600 text-sm transition">
            Home
          </Link>
        </nav>
      </div>
    </div>
  )
}