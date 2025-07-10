import { PrismaClient } from '../../../../generated/prisma'
import Link from 'next/link'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import ClientCourseModalWrapper from './ClientCourseModalWrapper'
import ParticipantToaster from './ParticipantToaster'

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

  const labelMap: Record<string, string> = {
    certificate: 'Zertifikat',
    KursRegeln: 'Kursregeln',
    Teilnahmebestaetigung: 'Teilnahmebestätigung',
  }

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

  // Server action to soft delete a participant (like area)
  async function deleteParticipant(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.participant.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    redirect('/participant')
  }

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

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
      <ParticipantToaster />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-neutral-100 p-0 overflow-hidden">
        {/* Profile Card */}
        <section className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 border-b border-neutral-200 relative">
          <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-700 select-none">
            {participant.name[0]}
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {participant.salutation} {participant.title ? participant.title + ' ' : ''}
              {participant.name} {participant.surname}
            </h1>
            <div className="flex flex-wrap gap-4 text-neutral-500 text-sm mt-1">
              <span>
                <span className="font-medium text-neutral-700">Email:</span> {participant.email}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Phone:</span> {participant.phoneNumber}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Birthday:</span> {participant.birthday ? new Date(participant.birthday).toLocaleDateString('de-DE') : 'N/A'}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Street:</span> {participant.street}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Postal Code:</span> {participant.postalCode}
              </span>
              <span>
                <span className="font-medium text-neutral-700">City:</span> {participant.city}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Country:</span> {participant.country}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Participant Code:</span> {participant.code}
              </span>
            </div>
          </div>
          {/* Edit icon button */}
          <Link
            href={`/participant/${participant.id}/edit`}
            className="absolute top-6 right-16 text-neutral-400 hover:text-blue-600 transition"
            title="Edit participant"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 5.487a2.25 2.25 0 113.182 3.182l-9.193 9.193a2 2 0 01-.708.464l-4.01 1.337a.5.5 0 01-.633-.633l1.337-4.01a2 2 0 01.464-.708l9.193-9.193z"
              />
            </svg>
          </Link>
          {/* Delete icon button */}
<form action={deleteParticipant} className="absolute top-6 right-8">
  <input type="hidden" name="id" value={participant.id} />
  <button
    type="submit"
    className="cursor-pointer text-neutral-400 hover:text-amber-500 transition-all duration-200 hover:scale-110"
    title="Archive participant"
    aria-label="Archive participant"
  >
    {/* Modern archive/box icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 7H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM10 12h4M3 7l1-4h16l1 4"
      />
    </svg>
  </button>
</form>
        </section>
        
{/* Courses Registered */}
<section className="px-8 py-6 border-b border-neutral-200">
  <div className="flex flex-col gap-2">
    <div className="grid grid-cols-6 border-b border-neutral-200 py-1 bg-neutral-50 rounded-t">
      <div className="col-span-2 text-xs font-semibold text-neutral-500 flex items-center px-1">Course</div>
      <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-center">Code</div>
      {/* Spacer column for more space between Code and Start */}
      <div className="col-span-1"></div>
      <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-center">Start</div>
      <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-end">
        <ClientCourseModalWrapper
          registerToCourse={registerToCourse}
          availableCourses={availableCourses}
        />
      </div>
    </div>
    {participant.registrations.length === 0 && (
      <div className="flex items-center px-2 py-2 text-neutral-400 italic text-sm bg-white rounded">
        No courses registered
      </div>
    )}
    {participant.registrations.map((reg, idx) => (
      <div
        key={idx}
        className="grid grid-cols-6 items-center bg-white hover:bg-sky-50 transition rounded border-b border-neutral-100 group"
      >
        <div className="col-span-2 flex items-center px-1 py-2">
          <Link
            href={`/course/${reg.course?.id}`}
            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
          >
            {reg.course?.program?.name ?? 'Unknown Course'}
          </Link>
        </div>
        <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
          {reg.course?.code ? (
            <span title={reg.course.code}>{reg.course.code}</span>
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </div>
        {/* Spacer column */}
        <div className="col-span-1"></div>
        <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
          {reg.course?.startDate ? (
            <span>{new Date(reg.course.startDate).toLocaleDateString('de-DE')}</span>
          ) : (
            <span className="text-neutral-300">—</span>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-end h-full">
          <form action={removeRegistration} className="h-full flex items-center">
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
        </div>
      </div>
    ))}
  </div>
</section>

       {/* Invoices Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <div>
            <div className="grid grid-cols-4 font-semibold text-neutral-700 text-xs uppercase border-b border-neutral-200 pb-2 mb-2">
              <div className="col-span-1">Invoice</div>
              <div className="col-span-1 text-center">Course Code</div>
              <div className="col-span-1 text-center">Recipient</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
            <div>
              {allInvoices.length === 0 && (
                <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                  No invoices found
                </div>
              )}
              {allInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-4 items-center py-2 border-b border-neutral-100 last:border-b-0 bg-white transition-colors hover:bg-blue-50"
                >
                  <div className="col-span-1 flex items-center gap-2">
                    <Link
                      href={`/invoice/${inv.id}`}
                      className="text-blue-700 hover:text-blue-900 font-medium text-sm truncate max-w-[120px]"
                      title={inv.invoiceNumber ?? inv.id}
                    >
                      #{inv.invoiceNumber ?? inv.id}
                    </Link>
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
                    {inv.course?.code ? (
                      <span title={inv.course.code}>{inv.course.code}</span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-xs">
                    {inv.recipient?.type === 'COMPANY'
                      ? inv.recipient?.companyName
                      : `${inv.recipient?.recipientName ?? ''} ${inv.recipient?.recipientSurname ?? ''}`}
                  </div>
                  <div className="col-span-1 flex items-center justify-center text-xs">
                    {inv.isCancelled ? (
                      <span className="px-2 py-1 rounded bg-red-100 text-red-600">Cancelled</span>
                    ) : inv.transactionNumber ? (
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700">Paid</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">Unpaid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <div>
            <div className="grid grid-cols-4 font-semibold text-neutral-700 text-xs uppercase border-b border-neutral-200 pb-2 mb-2">
              <div className="col-span-1">Document</div>
              <div className="col-span-1 text-center">Course Code</div>
              <div className="col-span-1 text-center">Type</div>
              <div className="col-span-1"></div>
            </div>
            <div className="text-black">
              {documents.length === 0 ? (
                <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                  No documents found
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-4 items-center py-2 border-b border-neutral-100 last:border-b-0 bg-white transition-colors hover:bg-blue-50"
                  >
                    <div className="col-span-1 flex items-center gap-2">
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 font-medium text-sm truncate max-w-[140px]"
                        title={doc.file.split('/').pop()}
                      >
                        {doc.file.split('/').pop()}
                      </a>
                    </div>
                    <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
                      {doc.courseRegistration?.course?.code ? (
                        <span title={doc.courseRegistration.course.code}>{doc.courseRegistration.course.code}</span>
                      ) : (
                        <span className="text-neutral-300">—</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
                      {labelMap[doc.role] || doc.role}
                    </div>
                    <div className="col-span-1 flex justify-end pl-2">
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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