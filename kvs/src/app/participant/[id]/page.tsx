import { PrismaClient, RecipientType } from '../../../../generated/prisma'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import ClientInvoiceModalWrapper from './ClientInvoiceModalWrapper'
import ClientCourseModalWrapper from './ClientCourseModalWrapper'

const prisma = new PrismaClient()

interface ParticipantPageProps {
  params: { id: string }
  searchParams?: { showAdd?: string, showAddInvoice?: string }
}

export default async function ParticipantPage({ params, searchParams }: ParticipantPageProps) {
  const { id } = await params

  // Fetch participant and their registrations
  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      registrations: {
        include: {
          course: { include: { program: true } },
          invoices: {
            include: {
              recipient: true,
            }
          },
        }
      },
      invoiceRecipients: true,
    }
  })

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href="/" className="text-blue-500 hover:underline mb-6 block">
            &larr; Back to Home
          </Link>
          <div className="text-red-600 text-lg font-semibold">Participant not found.</div>
        </div>
      </div>
    )
  }

  // Fetch courses where participant is NOT registered
  const registeredCourseIds = participant?.registrations.map(r => r.courseId) ?? []
  let availableCourses = await prisma.course.findMany({
    where: {
      id: { notIn: registeredCourseIds },
      deletedAt: null,
    },
    include: { program: true }
  })

  // --- SANITIZE availableCourses ---
  availableCourses = availableCourses.map(course => ({
    ...course,
    program: course.program
      ? {
          ...course.program,
          price: course.program.price ? course.program.price.toString() : null,
        }
      : null,
  })) as any

  // --- SANITIZE registrations for client component ---
  // Only convert subsidyAmount and discountAmount for the course registration list
  const sanitizedRegistrations = participant.registrations.map(reg => ({
    ...reg,
    subsidyAmount: reg.subsidyAmount ? reg.subsidyAmount.toString() : null,
    discountAmount: reg.discountAmount ? reg.discountAmount.toString() : null,
    course: reg.course
      ? {
          ...reg.course,
          program: reg.course.program
            ? {
                ...reg.course.program,
                price: reg.course.program.price ? reg.course.program.price.toString() : null,
              }
            : null,
        }
      : null,
    invoices: reg.invoices.map(inv => ({
      ...inv,
      amount: inv.amount != null ? inv.amount.toString() : null,
      recipient: inv.recipient,
    })),
  }))

  // Flatten all invoices for listing (sanitize amount here)
  const allInvoices = sanitizedRegistrations.flatMap(reg =>
    reg.invoices.map(inv => ({
      ...inv,
      course: reg.course,
    }))
  )

  // Fetch all documents for this participant (not soft-deleted)
  const registrationIds = participant?.registrations.map(r => r.id) ?? []
  const documents = registrationIds.length
    ? await prisma.document.findMany({
        where: {
          courseRegistrationId: { in: registrationIds },
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          courseRegistration: {
            include: {
              course: { include: { program: true } }
            }
          }
        }
      })
    : []

  // Server action to register participant in a course
  async function registerToCourse(formData: FormData) {
    'use server'
    const courseId = formData.get('courseId') as string
    await prisma.courseRegistration.create({
      data: {
        courseId,
        participantId: id,
      }
    })
    revalidatePath(`/participant/${id}`)
  }

  async function removeRegistration(formData: FormData) {
    "use server"
    const registrationId = formData.get("registrationId") as string
    await prisma.courseRegistration.delete({
      where: { id: registrationId }
    })
    revalidatePath(`/participant/${id}`)
  }
  
  // Server action to add an invoice
  async function addInvoice(formData: FormData) {
    'use server'
    const registrationId = formData.get('registrationId') as string
    const amount = parseFloat(formData.get('amount') as string)
    const dueDateString = formData.get('dueDate') as string

    // Get recipient fields from form
    const recipientType = formData.get('recipientType') as RecipientType
    const recipientName = formData.get('recipientName') as string | null
    const recipientSurname = formData.get('recipientSurname') as string | null
    const companyName = formData.get('companyName') as string | null
    const recipientEmail = formData.get('recipientEmail') as string
    const postalCode = formData.get('postalCode') as string
    const recipientCity = formData.get('recipientCity') as string
    const recipientStreet = formData.get('recipientStreet') as string
    const recipientCountry = formData.get('recipientCountry') as string

    if (!recipientType || !recipientEmail || !postalCode || !recipientCity || !recipientStreet || !recipientCountry) {
      throw new Error('All recipient fields are required.')
    }

    let recipientData: any = {
      type: recipientType,
      recipientEmail,
      postalCode,
      recipientCity,
      recipientStreet,
      recipientCountry,
    }

    if (recipientType === RecipientType.PERSON) {
      recipientData.recipientName = recipientName
      recipientData.recipientSurname = recipientSurname
      recipientData.companyName = null
      recipientData.participantId = id
    } else if (recipientType === RecipientType.COMPANY) {
      recipientData.companyName = companyName
      recipientData.recipientName = null
      recipientData.recipientSurname = null
      recipientData.participantId = null
    }

    // Create the recipient
    const recipient = await prisma.invoiceRecipient.create({
      data: recipientData
    })

    // Generate a unique invoice number
  const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`

  await prisma.invoice.create({
    data: {
      invoiceNumber,
      courseRegistrationId: registrationId,
      amount,
      transactionNumber: null, // explicitly set to null for unpaid invoice
      dueDate: dueDateString ? new Date(dueDateString) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      recipientId: recipient.id,
    }
  })
    revalidatePath(`/participant/${id}`)
  }

  // Server action to remove an invoice
  async function removeInvoice(formData: FormData) {
    "use server"
    const invoiceId = formData.get("invoiceId") as string
    await prisma.invoice.delete({
      where: { id: invoiceId }
    })
    revalidatePath(`/participant/${id}`)
  }

  // Server action to soft-delete a document
  async function removeDocument(formData: FormData) {
    "use server"
    const documentId = formData.get("documentId") as string
    await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: new Date() }
    })
    revalidatePath(`/participant/${id}`)
  }

  // Helper for aligned listing
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

  // Courses listing data
  const courseFields = [
    {
      label: 'Course',
      render: (reg: typeof participant.registrations[0]) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/course/${reg.course?.id}`}
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            {reg.course?.program?.name ?? 'Unknown Course'}
          </Link>
          {reg.course?.startDate && (
            <span className="text-xs text-neutral-400 ml-2">
              {new Date(reg.course.startDate).toLocaleDateString('de-DE')}
            </span>
          )}
        </div>
      ),
      width: 'flex-[2]'
    },
  ]

  // Invoice listing data
  const invoiceFields = [
    {
      label: 'Invoice',
      render: (inv: any) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/invoice/${inv.id}`}
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            #{inv.invoiceNumber ?? inv.id}
          </Link>
          {inv.course?.program?.name && (
            <span className="text-xs text-neutral-400 ml-2">
              {inv.course.program.name}
            </span>
          )}
        </div>
      ),
      width: 'flex-[2]'
    },
    {
      label: 'Amount',
      render: (inv: any) => (
        <div className="flex items-center h-full text-neutral-700 text-sm">€{inv.amount}</div>
      ),
      width: 'flex-1'
    },
    {
      label: 'Recipient',
      render: (inv: any) => (
        <div className="flex flex-col text-neutral-700 text-xs">
          {inv.recipient?.type === 'COMPANY'
            ? inv.recipient?.companyName
            : `${inv.recipient?.recipientName ?? ''} ${inv.recipient?.recipientSurname ?? ''}`}
          <span className="text-neutral-400">{inv.recipient?.recipientEmail}</span>
        </div>
      ),
      width: 'flex-[2]'
    }
  ]

  // Document listing data
  const documentFields = [
    {
      label: 'Document',
      render: (doc: any) => (
        <div className="flex items-center gap-2">
          <a
            href={doc.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            {doc.file.split('/').pop()}
          </a>
          {doc.courseRegistration?.course?.program?.name && (
            <span className="text-xs text-neutral-400 ml-2">
              {doc.courseRegistration.course.program.name}
            </span>
          )}
        </div>
      ),
      width: 'flex-[2]'
    },
    {
      label: 'File',
      render: (doc: any) => (
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
      render: (doc: any) => (
        <div className="flex items-center h-full text-neutral-700 text-sm">{doc.role}</div>
      ),
      width: 'flex-1'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-neutral-100 p-0 overflow-hidden">
        {/* Profile Card */}
        <section className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 border-b border-neutral-200">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-700 select-none">
            {participant.name[0]}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-neutral-900">{participant.name}</h1>
            <div className="flex flex-wrap gap-4 text-neutral-500 text-sm mt-1">
              <span><span className="font-medium text-neutral-700">Email:</span> {participant.email}</span>
              <span><span className="font-medium text-neutral-700">Phone:</span> {participant.phoneNumber}</span>
              <span><span className="font-medium text-neutral-700">ID:</span> {participant.id}</span>
            </div>
          </div>
        </section>

        {/* Courses Registered */}
        <section className="px-8 py-6 border-b border-neutral-200">
        <AlignedList
          items={participant.registrations}
          fields={courseFields}
            actions={reg => (
              <form action={removeRegistration}>
                <input type="hidden" name="registrationId" value={reg.id} />
                <button
                  type="submit"
                  className="cursor-pointer flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                  title="Remove registration"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
                  </svg>
                </button>
              </form>
            )}
            emptyText="No courses registered"
            addButton={
              <ClientCourseModalWrapper
                registerToCourse={registerToCourse}
                availableCourses={availableCourses}
              />
            }
          />
        </section>

        {/* Invoices Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <AlignedList
            items={allInvoices}
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
            addButton={
              <ClientInvoiceModalWrapper
                addInvoice={addInvoice}
                registrations={sanitizedRegistrations}
              />
            }
          />
        </section>

        {/* Documents Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <AlignedList
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

        </section>

        {/* Navigation */}
        <nav className="flex gap-4 justify-end px-8 py-6">
          <Link href="/participant" className="text-neutral-400 hover:text-blue-600 text-sm transition">
            &larr; Participants
          </Link>
          <Link href="/" className="text-neutral-400 hover:text-blue-600 text-sm transition">
            Home
          </Link>
        </nav>
      </div>
    </div>
  )
}