//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import { db } from '@/lib/db'
import Link from 'next/link'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import ClientCourseModalWrapper from './ClientCourseModalWrapper'
import { sanitize } from '@/lib/sanitize'
import RemoveButton from '@/components/RemoveButton/removeButton'
//---------------------------------------------------
// TYPE DEFINITIONS
//---------------------------------------------------
interface ParticipantPageProps {
  params: { id: string }
  searchParams?: { showAdd?: string, showAddInvoice?: string }
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ParticipantPage({ params }: ParticipantPageProps) {
  try {
    const { id } = await params

    //---------------------------------------------------
    // DATA FETCHING
    //---------------------------------------------------
    // 1. Fetch participant and their registrations
    const participant = await db.participant.findUnique({
      where: { id },
      include: {
        registrations: {
          where: { 
            deletedAt: null,
            course: {
              deletedAt: null  // Only include registrations for active courses
            }
          }, 
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

    // Early return if participant not found
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

    // 2. Fetch courses where participant is NOT registered
    const registeredCourseIds = participant?.registrations
      .map(r => r.courseId) ?? []  // Already filtered to deletedAt: null

    let availableCourses = await db.course.findMany({
      where: {
        id: { notIn: registeredCourseIds },
        deletedAt: null,
      },
      include: { program: true }
    })
    
    // 3. Fetch all documents for this participant (not soft-deleted)
    const registrationIds = participant?.registrations
      .map(r => r.id) ?? []  // Already filtered to deletedAt: null

    const documents = registrationIds.length
      ? await db.document.findMany({
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

    //---------------------------------------------------
    // DATA PROCESSING
    //---------------------------------------------------
    // Translation mapping for document types
    const labelMap: Record<string, string> = {
      certificate: 'Zertifikat',
      KursRegeln: 'Kursregeln',
      Teilnahmebestaetigung: 'Teilnahmebestätigung',
    }

    // Sanitize and serialize data for client components
    
    // 1. Process available courses
    availableCourses = sanitize(availableCourses)
    // Complete serialization of Decimal objects to handle pricing data
    availableCourses = JSON.parse(JSON.stringify(availableCourses))

    // 2. Process participant data
    const sanitizedParticipant = sanitize(participant)

    // 3. Flatten all invoices for listing
    const allInvoices = sanitizedParticipant.registrations.flatMap(reg =>
      reg.invoices.map(inv => ({
        ...inv,
        course: reg.course, // Attach course info to each invoice for display
      }))
    )

    // 4. Process documents
    const sanitizedDocuments = sanitize(documents)

    //---------------------------------------------------
    // SERVER ACTIONS
    //---------------------------------------------------
    // 1. Soft delete a participant
    async function deleteParticipant(formData: FormData) {
      'use server'
      try {
        const id = formData.get('id') as string
        await db.participant.update({
          where: { id },
          data: { deletedAt: new Date() }
        })
      } catch (error) {
        console.error('Failed to delete participant:', error)
        throw error
      }

      redirect('/participant')
    }

    // 2. Register participant in a course
    async function registerToCourse(formData: FormData) {
      'use server'
      try {
        const courseId = formData.get('courseId') as string
        await db.courseRegistration.create({
          data: {
            courseId,
            participantId: id,
          }
        })
        revalidatePath(`/participant/${id}`)
      } catch (error) {
        console.error('Failed to register participant to course:', error)
        throw error
      }
    }

    async function removeRegistration(formData: FormData) {
      "use server"
      try {
        const registrationId = formData.get("registrationId") as string
        
        // Change from delete to update with deletedAt timestamp
        await db.courseRegistration.update({
          where: { id: registrationId },
          data: { deletedAt: new Date() }
        })
        
        revalidatePath(`/participant/${id}`)
      } catch (error) {
        console.error('Failed to remove registration:', error)
        throw error
      }
    }

    // 4. Soft-delete a document
    async function removeDocument(formData: FormData) {
      "use server"
      try {
        const documentId = formData.get("documentId") as string
        await db.document.update({
          where: { id: documentId },
          data: { deletedAt: new Date() }
        })
        revalidatePath(`/participant/${id}`)
      } catch (error) {
        console.error('Failed to remove document:', error)
        throw error
      }
    }

    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-neutral-100 p-0 overflow-hidden">
          {/* Profile Card */}
          <section className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 border-b border-neutral-200 relative">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-700 select-none">
              {sanitizedParticipant.name[0]}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-neutral-900">
                {sanitizedParticipant.salutation} {sanitizedParticipant.title ? sanitizedParticipant.title + ' ' : ''}
                {sanitizedParticipant.name} {sanitizedParticipant.surname}
              </h1>
              <div className="flex flex-wrap gap-4 text-neutral-500 text-sm mt-1">
                <span>
                  <span className="font-medium text-neutral-700">Email:</span> {sanitizedParticipant.email}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Phone:</span> {sanitizedParticipant.phoneNumber}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Birthday:</span> {sanitizedParticipant.birthday ? new Date(sanitizedParticipant.birthday).toLocaleDateString('de-DE') : 'N/A'}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Street:</span> {sanitizedParticipant.street}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Postal Code:</span> {sanitizedParticipant.postalCode}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">City:</span> {sanitizedParticipant.city}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Country:</span> {sanitizedParticipant.country}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Participant Code:</span> {sanitizedParticipant.code}
                </span>
              </div>
            </div>
            
            {/* Action buttons - Edit only */}
            <Link
              href={`/participant/${sanitizedParticipant.id}/edit`}
              className="absolute top-6 right-8 text-neutral-400 hover:text-blue-600 transition"
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
          </section>
          
          {/* Courses Registered Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-6 border-b border-neutral-200 py-1 bg-neutral-50 rounded-t">
                <div className="col-span-2 text-xs font-semibold text-neutral-500 flex items-center px-1">Course Registration</div>
                <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-center">Course Code</div>
                <div className="col-span-1"></div> {/* Spacer column */}
                <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-center">Start</div>
                <div className="col-span-1 text-xs font-semibold text-neutral-500 flex items-center justify-end">
                  <ClientCourseModalWrapper
                    registerToCourse={registerToCourse}
                    availableCourses={availableCourses}
                  />
                </div>
              </div>
              
              {/* Course list or empty state */}
              {sanitizedParticipant.registrations.length === 0 && (
                <div className="flex items-center px-2 py-2 text-neutral-400 italic text-sm bg-white rounded">
                  No courses registered
                </div>
              )}
              
              {/* Registered courses */}
              {sanitizedParticipant.registrations.map((reg, idx) => (
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
                  <div className="col-span-1"></div> {/* Spacer column */}
                  <div className="col-span-1 flex items-center justify-center text-xs text-neutral-600">
                    {reg.course?.startDate ? (
                      <span>{new Date(reg.course.startDate).toLocaleDateString('de-DE')}</span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-end h-full">
                    <RemoveButton 
                      itemId={reg.id} 
                      onRemove={removeRegistration} 
                      title="Remove Course Registration"
                      message="Are you sure you want to remove this course registration? This action cannot be undone."
                      fieldName="registrationId"
                    />
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
              
              {/* Invoice list or empty state */}
              <div>
                {allInvoices.length === 0 && (
                  <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                    No invoices found
                  </div>
                )}
                
                {/* Invoice items */}
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
              
              {/* Document list or empty state */}
              <div className="text-black">
                {sanitizedDocuments.length === 0 ? (
                  <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                    No documents found
                  </div>
                ) : (
                  sanitizedDocuments.map((doc) => (
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
                        <RemoveButton 
                          itemId={doc.id} 
                          onRemove={removeDocument}
                          title="Remove Document"
                          message="Are you sure you want to remove this document? You will no longer have access to it."
                          fieldName="documentId"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <nav className="flex gap-4 justify-end px-8 py-6 border-b border-neutral-200">
            <Link href="/participant" className="text-neutral-400 hover:text-blue-600 text-sm transition">
              &larr; Participants
            </Link>
            <Link href="/" className="text-neutral-400 hover:text-blue-600 text-sm transition">
              Home
            </Link>
          </nav>
          
          {/* Danger Zone Section */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Danger Zone</h3>
                <p className="text-xs text-gray-500 mt-1">This action will soft delete Participant</p>
              </div>
              <RemoveButton
                itemId={sanitizedParticipant.id}
                onRemove={deleteParticipant}
                title="Delete Participant"
                message="Are you sure you want to soft delete this participant? This will also remove all associated registrations and documents."
                fieldName="id"
                customButton={
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white border border-red-300 rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Delete
                    </div>
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading participant data:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4 bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">
            An error occurred while loading the participant data. Please try again later.
          </p>
          <Link href="/participant" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Participants
          </Link>
        </div>
      </div>
    )
  }
}