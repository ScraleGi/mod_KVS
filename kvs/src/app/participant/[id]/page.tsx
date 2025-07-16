//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import { db } from '@/lib/db'
import Link from 'next/link'
import { redirect } from "next/navigation"
import { revalidatePath } from 'next/cache'
import ClientCourseModalWrapper from './ClientCourseModalWrapper'
import ParticipantToaster from './ParticipantToaster'
import { sanitize } from '@/lib/sanitize'
import RemoveButton from '@/components/RemoveButton/RemoveButton'
import { DownloadPDFLink } from '@/components/DownloadButton/DownloadButton'

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ParticipantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
            invoices: true,
          }
        },
      }
    })

    // Early return if participant not found
    if (!participant) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md w-full px-4">
            <Link href="/" className="text-blue-500 hover:underline mb-6 block">
              &larr; Home
            </Link>
            <div className="text-red-600 text-lg font-semibold">Teilnehmer nicht gefunden.</div>
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

      redirect('/participant/deleted?deleted=1')
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
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-2 py-8">
        <ParticipantToaster />

        <div className="w-full max-w-2xl">
          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
            <Link href="/participant" className="hover:underline text-gray-700">Teilnehmer</Link>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">{participant.name} {participant.surname}</span>
          </nav>
        </div>
        
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
                  <span className="font-medium text-neutral-700">Tel.::</span> {sanitizedParticipant.phoneNumber}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Geburtstag:</span> {sanitizedParticipant.birthday ? new Date(sanitizedParticipant.birthday).toLocaleDateString('de-DE') : 'N/A'}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Straße:</span> {sanitizedParticipant.street}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">PLZ.:</span> {sanitizedParticipant.postalCode}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Ort:</span> {sanitizedParticipant.city}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Land:</span> {sanitizedParticipant.country}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Teilnehmer Code:</span> {sanitizedParticipant.code}
                </span>
              </div>
            </div>

            {/* Action buttons - Edit only */}
            <Link
              href={`/participant/${sanitizedParticipant.id}/edit`}
              className="absolute top-6 right-8 text-neutral-400 hover:text-blue-600 transition"
              title="Teilnehmer bearbeiten"
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
            <div className="flex items-center mb-2">
              <h2 className="text-sm font-semibold text-neutral-800">Kurs Registrationen</h2>
              <span className="ml-3">
                <ClientCourseModalWrapper
                  registerToCourse={registerToCourse}
                  availableCourses={availableCourses}
                />
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Name</th>
                    <th className="px-3 py-2 text-center font-semibold">Code</th>
                    <th className="px-3 py-2 text-center font-semibold">Start</th>
                    <th className="px-3 py-2 text-center font-semibold">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {sanitizedParticipant.registrations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                        Keine Kurse registriert.
                      </td>
                    </tr>
                  ) : (
                    sanitizedParticipant.registrations.map((reg) => (
                      <tr key={reg.id} className="border-t border-neutral-200 bg-white hover:bg-sky-50 transition">
                        <td className="px-3 py-2">
                          <Link
                            href={`/course/${reg.course?.id}`}
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                          >
                            {reg.course?.program?.name ?? 'Unbekannter Kurs'}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {reg.course?.code ?? <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {reg.course?.startDate
                            ? new Date(reg.course.startDate).toLocaleDateString('de-DE')
                            : <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="px-3 py-2 text-center flex justify-center items-center">
                          <RemoveButton
                            itemId={reg.id}
                            onRemove={removeRegistration}
                            title="Kursanmeldung entfernen"
                            message="Sind Sie sicher, dass Sie diesen Artikel entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
                            fieldName="registrationId"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Invoices Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-2">Rechnungen</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Rechnung</th>
                    <th className="px-3 py-2 text-center font-semibold">Kurs Code</th>
                    <th className="px-3 py-2 text-center font-semibold">Empfänger</th>
                    <th className="px-3 py-2 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                        Keine Rechnungen gefunden.
                      </td>
                    </tr>
                  ) : (
                    allInvoices.map((inv) => (
                      <tr key={inv.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition">
                        <td className="px-3 py-2">
                          <DownloadPDFLink
                            uuidString={inv.courseRegistrationId ||  inv.id}
                            filename={`${inv.invoiceNumber}.pdf`}
                            displayName={`${inv.invoiceNumber ?? inv.id}`}
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          {inv.course?.code ?? <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          N/A
                        </td>
                        <td className="px-3 py-2 text-center">
                          {inv.isCancelled ? (
                            <span className="px-2 py-1 rounded bg-red-100 text-red-600">Canceled</span>
                          ) : inv.transactionNumber ? (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-700">bezahlt</span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">nicht bezahlt</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Documents Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-2">Dokumente</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Dokument</th>
                    <th className="px-3 py-2 text-center font-semibold">Kurs Code</th>
                    <th className="px-3 py-2 text-center font-semibold">Type</th>
                    <th className="px-3 py-2 text-center font-semibold">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {sanitizedDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                        Keine Dokumente gefunden.
                      </td>
                    </tr>
                  ) : (
                    sanitizedDocuments.map((doc) => (
                      <tr key={doc.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition">
                        <td className="px-3 py-2">
                          <DownloadPDFLink
                            uuidString={doc.courseRegistrationId || doc.courseRegistration?.id}
                            filename={doc.file}
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                            displayName={doc.file.split('/').pop()}
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          {doc.courseRegistration?.course?.code ?? <span className="text-neutral-300">—</span>}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {labelMap[doc.role] || doc.role}
                        </td>
                        <td className="px-3 py-2 text-center flex justify-center items-center">
                          <RemoveButton
                            itemId={doc.id}
                            onRemove={removeDocument}
                            title="Dokument entfernen"
                            message="Sind Sie sicher, dass Sie dieses Dokument entfernen möchten? Sie haben dann keinen Zugriff mehr darauf."
                            fieldName="documentId"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          {/* Danger Zone Section */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Archiv</h3>
                <p className="text-xs text-gray-500 mt-1">In Ablage verwahren.</p>
              </div>
              <RemoveButton
                itemId={sanitizedParticipant.id}
                onRemove={deleteParticipant}
                title="Teilnehmer entfernen"
                message="Sind Sie sicher, dass Sie diesen Teilnehmer sanft löschen möchten? Dadurch werden auch alle zugehörigen Registrierungen und Dokumente entfernt."
                fieldName="id"
                customButton={
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white border border-red-300 cursor-pointer rounded text-sm text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Archivieren
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
            Beim Laden der Teilnehmerdaten ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.
          </p>
          <Link href="/participant" className="text-blue-500 hover:text-blue-700">
            &larr; Teilnehmer
          </Link>
        </div>
      </div>
    )
  }
}