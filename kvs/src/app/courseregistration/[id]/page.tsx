//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { DownloadPDFLink, GeneratePDFButton } from '@/components/DownloadButton/DownloadButton'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDateGerman } from '@/lib/utils'
import { Document } from '@/types/models'
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from 'next/navigation'
import { 
  SanitizedRegistration,
  SanitizedInvoice,
  SanitizedDocument,
} from '@/types/query-models'
import RemoveButton from '@/components/RemoveButton/RemoveButton'
import SubsidyToaster from './subsidy/new/SubsidyToaster'

//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
async function updateRemark(formData: FormData) {
  "use server"
  const registrationId = formData.get("registrationId") as string
  const newRemark = formData.get("remark") as string
  await db.courseRegistration.update({
    where: { id: registrationId },
    data: { generalRemark: newRemark }
  })
  revalidatePath(`/courseregistration/${registrationId}`)
}

async function toggleInvoiceCancelled(formData: FormData) {
  "use server"
  const invoiceId = formData.get("invoiceId") as string
  const isCancelled = formData.get("isCancelled") === "on"
  await db.invoice.update({
    where: { id: invoiceId },
    data: { isCancelled }
  })
  revalidatePath(`/courseregistration/${formData.get("registrationId")}`)
}

async function removeDocument(formData: FormData) {
  "use server"
  const documentId = formData.get("documentId") as string
  const registrationId = formData.get("registrationId") as string
  await db.document.update({
    where: { id: documentId },
    data: { deletedAt: new Date() }
  })
  revalidatePath(`/courseregistration/${registrationId}`)
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ParticipantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }

  // DATA FETCHING
  const { id } = await params
  const registrationId = id

  const registration = await db.courseRegistration.findFirst({
    where: { id: registrationId },
    include: {
      participant: true,
      course: { include: { program: true, mainTrainer: true } },
      invoices: true,
    }
  })

  const documents: Document[] = registration
    ? await db.document.findMany({
      where: {
        courseRegistrationId: registration.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    })
    : []

  // DATA PROCESSING
  const sanitizedRegistration = sanitize(registration) as unknown as SanitizedRegistration;

  if (sanitizedRegistration) {
    sanitizedRegistration.subsidyAmountDisplay =
      sanitizedRegistration.subsidyAmount !== undefined && sanitizedRegistration.subsidyAmount !== null
        ? sanitizedRegistration.subsidyAmount.toString()
        : undefined;

    // Handle discountAmount
    sanitizedRegistration.discountAmountDisplay =
      sanitizedRegistration.discountAmount !== undefined && sanitizedRegistration.discountAmount !== null
        ? sanitizedRegistration.discountAmount.toString()
        : undefined;
  }

  const sanitizedInvoices: SanitizedInvoice[] = sanitizedRegistration
    ? sanitizedRegistration.invoices
    : []

  const sanitizedDocuments = sanitize(documents) as SanitizedDocument[];

  const hasActiveInvoice = sanitizedInvoices.some(inv => !inv.isCancelled)

  const labelMap: Record<string, string> = {
    certificate: 'Zertifikat',
    KursRegeln: 'Kursregeln',
    Teilnahmebestaetigung: 'Teilnahmebestätigung',
    vvvTicket: 'VVV Ticket',
  }

  // EARLY RETURN FOR MISSING DATA
  if (!sanitizedRegistration || !sanitizedRegistration.participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href={`/course/${registration?.courseId}`} className="text-blue-500 hover:text-blue-800 mb-6 block">
            &larr; Startseite
          </Link>
          <div className="text-red-600 text-lg font-semibold">Keine Teilnehmer für diesen Kurs gefunden.</div>
        </div>
      </div>
    )
  }

  // RENDER UI
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
      <SubsidyToaster />
      <div className="w-full max-w-2xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/" className="hover:underline text-gray-700">Kursübersicht</Link>
          <span>&gt;</span>
          <Link href={`/course/${sanitizedRegistration.course?.id}`} className="hover:underline text-gray-700">
            {sanitizedRegistration.course?.program?.name ?? 'Kurs'}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">Kursanmeldung</span>
        </nav>
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md border border-neutral-100 p-0 overflow-hidden">

          {/* Profile Card Section */}
          <section className="flex flex-col sm:flex-row items-center gap-6 px-8 py-8 border-b border-neutral-200">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-700 select-none">
              {sanitizedRegistration.participant.name[0]}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-neutral-900">
                <Link
                  href={`/participant/${sanitizedRegistration.participant.id}`}
                  className="text-blue-700 hover:text-blue-900"
                >
                  {sanitizedRegistration.participant.salutation} {sanitizedRegistration.participant.title ? sanitizedRegistration.participant.title + ' ' : ''}
                  {sanitizedRegistration.participant.name} {sanitizedRegistration.participant.surname}
                </Link>
              </h1>
              <div className="flex flex-wrap gap-4 text-neutral-500 text-sm mt-1">
                <span>
                  <span className="font-medium text-neutral-700">Email:</span> {sanitizedRegistration.participant.email}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Tel.:</span> {sanitizedRegistration.participant.phoneNumber}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Geburtstag:</span> {formatDateGerman(sanitizedRegistration.participant.birthday)}
                </span>
                <span>
                  <span className="font-medium text-neutral-700">Adresse:</span> {sanitizedRegistration.participant.street}, {sanitizedRegistration.participant.postalCode} {sanitizedRegistration.participant.city}, {sanitizedRegistration.participant.country}
                </span>
              </div>
            </div>
          </section>

          {/* Registration Details Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            Kurs:&nbsp;
            <Link
              href={`/course/${sanitizedRegistration.course?.id}`}
              className="text-blue-700 hover:text-blue-800 font-medium hover:underline"
            >
              {sanitizedRegistration.course?.program?.name ?? '-'}
            </Link>
            <span className="flex-1" />
            <Link
              href={`/courseregistration/${sanitizedRegistration.id}/registrationStatus/edit`}
              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              Status bearbeiten
            </Link>
          </h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px] text-neutral-700 border-l-4 border-neutral-200 pl-6 mt-2"
            >
              {/* Left column - Course details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Code:</span>
                  {sanitizedRegistration.course?.code ?? '-'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Trainer:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.course?.mainTrainer
                      ? `${sanitizedRegistration.course.mainTrainer.name} ${sanitizedRegistration.course.mainTrainer.surname}`
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Start:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.course?.startDate
                      ? formatDateGerman(sanitizedRegistration.course.startDate)
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Ende:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.course?.endDate
                      ? formatDateGerman(sanitizedRegistration.course.endDate)
                      : '-'}
                  </span>
                </div>
              </div>
              
              {/* Right column - Registration details */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Registriert:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.registeredAt
                      ? formatDateGerman(sanitizedRegistration.registeredAt)
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Unregistriert:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.unregisteredAt
                      ? formatDateGerman(sanitizedRegistration.unregisteredAt)
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Infoabend:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.infoSessionAt
                      ? formatDateGerman(sanitizedRegistration.infoSessionAt)
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-600">Vormerkung:</span>
                  <span className="text-neutral-600">
                    {sanitizedRegistration.interestedAt
                      ? formatDateGerman(sanitizedRegistration.interestedAt)
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Remark Form Section */}
            <hr className="my-6 border-t border-neutral-200" />
            <div className="mt-6">
              <div className="text-sm font-semibold text-neutral-800 mb-2">Bemerkung:</div>
              <form action={updateRemark} className="flex flex-col gap-2">
                <input type="hidden" name="registrationId" value={sanitizedRegistration.id} />
                <textarea
                  name="remark"
                  defaultValue={sanitizedRegistration.generalRemark || ''}
                  className="bg-neutral-50 border border-neutral-200 rounded px-3 py-2 text-[13px] text-neutral-700 min-h-[64px] whitespace-pre-line break-words resize-y focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter a remark..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="cursor-pointer px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Subsidy & Discount Table Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-4">Gutschein & Rabatt</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Typ</th>
                    <th className="px-3 py-2 text-left font-semibold">Betrag (€)</th>
                    <th className="px-3 py-2 text-left font-semibold">Bemerkung</th>
                    <th className="px-3 py-2 text-left font-semibold">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Gutschein row */}
                  <tr className="border-t border-neutral-200">
                    <td className="px-3 py-2">Gutschein</td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.subsidyAmountDisplay ?? <span className="text-neutral-400">-</span>}
                    </td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.subsidyRemark || <span className="text-neutral-400">-</span>}
                    </td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.subsidyAmount || sanitizedRegistration.subsidyRemark ? (
                        <Link
                          href={`/courseregistration/${sanitizedRegistration.id}/subsidy/edit`}
                          className="text-blue-600 underline"
                        >
                          Bearbeiten
                        </Link>
                      ) : (
                        <Link
                          href={`/courseregistration/${sanitizedRegistration.id}/subsidy/new`}
                          className="text-blue-600 underline"
                        >
                          Hinzufügen
                        </Link>
                      )}
                    </td>
                  </tr>
                  {/* Rabatt row */}
                  <tr className="border-t border-neutral-200">
                    <td className="px-3 py-2">Rabatt</td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.discountAmountDisplay ?? <span className="text-neutral-400">-</span>}
                    </td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.discountRemark || <span className="text-neutral-400">-</span>}
                    </td>
                    <td className="px-3 py-2">
                      {sanitizedRegistration.discountAmount || sanitizedRegistration.discountRemark ? (
                        <Link
                          href={`/courseregistration/${sanitizedRegistration.id}/discount/edit`}
                          className="text-blue-600 underline"
                        >
                          Bearbeiten
                        </Link>
                      ) : (
                        <Link
                          href={`/courseregistration/${sanitizedRegistration.id}/discount/new`}
                          className="text-blue-600 underline"
                        >
                          Hinzufügen
                        </Link>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Create Invoice Button */}
              <div className="flex justify-end mt-4">
                {hasActiveInvoice ? (
                  <span
                    className="px-3 py-1 rounded text-xs font-medium bg-neutral-200 text-neutral-400 cursor-not-allowed select-none"
                    tabIndex={-1}
                    aria-disabled="true"
                  >
                    Rechnung generieren
                  </span>
                ) : (
                  <Link
                    href={`/courseregistration/${registrationId}/create-invoice`}
                    className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Rechnung generieren
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Invoices Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-4">Rechnungen</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Rechnung</th>
                    <th className="px-3 py-2 text-center font-semibold">Empfänger</th>
                    <th className="px-3 py-2 text-center font-semibold">Status</th>
                    <th className="px-3 py-2 text-center font-semibold">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {sanitizedInvoices.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                        Keine Rechnungen gefunden.
                      </td>
                    </tr>
                  )}
                  {sanitizedInvoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-2">
                        <span
                          title={`Invoice #${inv.invoiceNumber || ''} - €${inv.amount?.toString() || ''}`}
                        >
                          <DownloadPDFLink
                            uuidString={sanitizedRegistration.id}
                            filename={`${inv.invoiceNumber}.pdf`}
                            displayName={`${inv.invoiceNumber}`}
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                          />
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {inv.recipient?.type === 'PERSON'
                          ? `${inv.recipient.recipientName ?? ''} ${inv.recipient.recipientSurname ?? ''}`.trim() || '-'
                          : inv.recipient?.type === 'COMPANY'
                            ? inv.recipient.companyName ?? '-'
                            : '-'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <form action={toggleInvoiceCancelled} className="inline">
                          <input type="hidden" name="invoiceId" value={inv.id} />
                          <input type="hidden" name="registrationId" value={registrationId} />
                          <button
                            type="submit"
                            name="isCancelled"
                            value={inv.isCancelled ? "" : "on"}
                            className={`px-2 py-1 rounded text-xs font-semibold transition
                              ${inv.isCancelled
                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"}
                            `}
                          >
                            {inv.isCancelled ? "storniert" : "aktiv"}
                          </button>
                        </form>
                        {inv.transactionNumber && !inv.isCancelled && (
                          <span className="ml-2 text-green-700 font-semibold">bezahlt</span>
                        )}
                        {!inv.transactionNumber && !inv.isCancelled && (
                          <span className="ml-2 text-yellow-600 font-semibold">nicht bezahlt</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Link
                          href={`/invoice/${inv.id}`}
                          className="text-neutral-400 hover:text-blue-600 transition mr-2"
                          title="View invoice details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                          </svg>
                        </Link>
                        <Link
                          href={`/invoice/${inv.id}/edit`}
                          className="text-neutral-400 hover:text-blue-600 transition"
                          title="Edit invoice"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-4">
                {hasActiveInvoice ? (
                  <span
                    className="px-3 py-1 rounded text-xs font-medium bg-neutral-200 text-neutral-400 cursor-not-allowed select-none"
                    tabIndex={-1}
                    aria-disabled="true"
                  >
                    Rechnung generieren
                  </span>
                ) : (
                  <Link
                    href={`/courseregistration/${registrationId}/create-invoice`}
                    className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Rechnung generieren
                  </Link>
                )}
              </div>
            </div>
          </section>

          {/* Documents Section */}
          <section className="px-8 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-4">Dokumente</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border border-neutral-200 rounded">
                <thead>
                  <tr className="bg-neutral-100">
                    <th className="px-3 py-2 text-left font-semibold">Dokument</th>
                    <th className="px-3 py-2 text-left font-semibold">Typ</th>
                    <th className="px-3 py-2 text-center font-semibold">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {sanitizedDocuments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-neutral-400 italic text-xs bg-white rounded text-center">
                        Keine Dokumente gefunden.
                      </td>
                    </tr>
                  ) : (
                    sanitizedDocuments.map((doc) => (
                      <tr key={doc.id} className="border-t border-neutral-200 bg-white hover:bg-blue-50 transition-colors">
                        <td className="px-3 py-2">
                          <DownloadPDFLink
                            uuidString={sanitizedRegistration.id}
                            filename={doc.file}
                            className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">{labelMap[doc.role] || doc.role}</td>
                        <td className="px-3 py-2 text-center flex justify-center items-center">
                          <RemoveButton 
                            itemId={doc.id} 
                            onRemove={removeDocument}
                            title="Remove Document"
                            message="Are you sure you want to remove this document? You will no longer have access to it."
                            fieldName="documentId"
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-start mt-4">
                <Link
                  href={`/courseregistration/${registrationId}/deletedDocuments`}
                  className="inline-flex items-center gap-1 text-neutral-400 hover:text-orange-600 text-xs transition"
                >
                  Gelöschte Dokumente anzeigen
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Generate Documents Section */}
          <section className="px-6 py-6 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-800 mb-4">Dokumente generieren</h2>
            <div className="flex gap-4 flex-wrap justify-center">
              {(() => {
                const fullySerializedRegistration = JSON.parse(JSON.stringify(sanitizedRegistration))
                return (
                  <>
                    <GeneratePDFButton
                      uuidString={sanitizedRegistration.id}
                      registration={fullySerializedRegistration}
                      documentType="certificate"
                      filename={`certificate_${sanitizedRegistration.participant.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                    />
                    <GeneratePDFButton
                      uuidString={sanitizedRegistration.id}
                      registration={fullySerializedRegistration}
                      documentType="KursRegeln"
                      filename={`KursRegeln_${sanitizedRegistration.participant.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                    />
                    <GeneratePDFButton
                      uuidString={sanitizedRegistration.id}
                      registration={fullySerializedRegistration}
                      documentType="Teilnahmebestaetigung"
                      filename={`Teilnahmebestaetigung_${sanitizedRegistration.participant.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                    />
                    <GeneratePDFButton
                      uuidString={sanitizedRegistration.id}
                      registration={fullySerializedRegistration}
                      documentType="vvvTicket"
                      filename={`VVV_Ticket_${sanitizedRegistration.participant.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`}
                    /> 
                  </>
                )
              })()}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}