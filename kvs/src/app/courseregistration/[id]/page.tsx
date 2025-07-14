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
import { 
  SanitizedRegistration,
  SanitizedInvoice,
  SanitizedDocument,
} from '@/types/query-models'
import RemoveButton from '@/components/RemoveButton/RemoveButton'


//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
// Update course registration remark
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

// Toggle invoice cancellation status
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

// Soft-delete a document
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
  //---------------------------------------------------
  // DATA FETCHING
  //---------------------------------------------------
  // Extract registration ID from params
  const { id } = await params
  const registrationId = id
  console.log(`Fetching details for participant ID: ${registrationId}`)

  // Fetch registration with related data
  const registration = await db.courseRegistration.findFirst({
    where: { id: registrationId },
    include: {
      participant: true,
      course: { include: { program: true, mainTrainer: true } },
      invoices: { include: { recipient: true } },
    }
  })

  // Fetch documents for this registration (not soft-deleted)
  const documents: Document[] = registration
    ? await db.document.findMany({
        where: {
          courseRegistrationId: registration.id,
          deletedAt: null,
        },
        orderBy: { createdAt: 'desc' },
      })
    : []

  //---------------------------------------------------
  // DATA PROCESSING
  //---------------------------------------------------
  // Sanitize registration data for client components
  const sanitizedRegistration = sanitize(registration) as unknown as SanitizedRegistration;

  // Ensure decimal properties are fully sanitized
  if (sanitizedRegistration) {
    // Handle subsidyAmount
    if (sanitizedRegistration.subsidyAmount && 
        typeof sanitizedRegistration.subsidyAmount === 'object' && 
        'toString' in sanitizedRegistration.subsidyAmount) {
      sanitizedRegistration.subsidyAmountDisplay = sanitizedRegistration.subsidyAmount.toString();
    }
    
    // Handle discountAmount
    if (sanitizedRegistration.discountAmount && 
        typeof sanitizedRegistration.discountAmount === 'object' && 
        'toString' in sanitizedRegistration.discountAmount) {
      sanitizedRegistration.discountAmountDisplay = sanitizedRegistration.discountAmount.toString();
    }
  }

  // Sanitize invoices
  const sanitizedInvoices: SanitizedInvoice[] = sanitizedRegistration
    ? sanitizedRegistration.invoices
    : []

  // Sanitize documents
  const sanitizedDocuments = sanitize(documents) as SanitizedDocument[];

  // Check if there are any active invoices  
  const hasActiveInvoice = sanitizedInvoices.some(inv => !inv.isCancelled)

  // Document type translation mapping
  const labelMap: Record<string, string> = {
    certificate: 'Zertifikat',
    KursRegeln: 'Kursregeln',
    Teilnahmebestaetigung: 'Teilnahmebestätigung',
    vvvTicket: 'VVV Ticket',
  }

  //---------------------------------------------------
  // EARLY RETURN FOR MISSING DATA
  //---------------------------------------------------
  if (!sanitizedRegistration || !sanitizedRegistration.participant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4">
          <Link href={`/course/${registration?.courseId}`} className="text-blue-500 hover:text-blue-800 mb-6 block">
            &larr; Back to Course
          </Link>
          <div className="text-red-600 text-lg font-semibold">Participant not found for this course.</div>
        </div>
      </div>
    )
  }

  //---------------------------------------------------
  // RENDER UI
  //---------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-2 py-8">
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
                <span className="font-medium text-neutral-700">Phone:</span> {sanitizedRegistration.participant.phoneNumber}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Birthday:</span> {formatDateGerman(sanitizedRegistration.participant.birthday)}
              </span>
              <span>
                <span className="font-medium text-neutral-700">Address:</span> {sanitizedRegistration.participant.street}, {sanitizedRegistration.participant.postalCode} {sanitizedRegistration.participant.city}, {sanitizedRegistration.participant.country}
              </span>
            </div>
          </div>
        </section>

        {/* Registration Details Section */}
        <section className="px-8 py-6 border-b border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">
            Course:&nbsp;
            <Link
              href={`/course/${sanitizedRegistration.course?.id}`}
              className="text-blue-700 hover:text-blue-800 font-medium hover:underline"
            >
              {sanitizedRegistration.course?.program?.name ?? '-'}
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
                <span className="font-medium text-neutral-600">End:</span>
                <span className="text-neutral-600">
                  {sanitizedRegistration.course?.endDate
                    ? formatDateGerman(sanitizedRegistration.course.endDate)
                    : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-600">Registered:</span>
                <span className="text-neutral-600">
                  {sanitizedRegistration.registeredAt
                    ? formatDateGerman(sanitizedRegistration.registeredAt)
                    : '-'}
                </span>
              </div>
            </div>
            
            {/* Right column - Registration details */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-600">Unregistered:</span>
                <span className="text-neutral-600">
                  {sanitizedRegistration.unregisteredAt
                    ? formatDateGerman(sanitizedRegistration.unregisteredAt)
                    : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-600">Info Session:</span>
                <span className="text-neutral-600">
                  {sanitizedRegistration.infoSessionAt
                    ? formatDateGerman(sanitizedRegistration.infoSessionAt)
                    : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-neutral-600">Interested:</span>
                <span className="text-neutral-600">
                  {sanitizedRegistration.interestedAt
                    ? formatDateGerman(sanitizedRegistration.interestedAt)
                    : '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Subsidy:</span>
                {sanitizedRegistration.subsidyRemark || sanitizedRegistration.subsidyAmount ? (
                  <>
                    {sanitizedRegistration.subsidyRemark && (
                      <span>{sanitizedRegistration.subsidyRemark}</span>
                    )}
                    {sanitizedRegistration.subsidyAmount && (
                      <span className="text-green-700 ml-1 text-xs">
                        ({sanitizedRegistration.subsidyAmountDisplay}€)
                      </span>
                    )}
                  </>
                ) : (
                  <span>-</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Discount:</span>
                {sanitizedRegistration.discountRemark || sanitizedRegistration.discountAmount ? (
                  <>
                    {sanitizedRegistration.discountRemark && (
                      <span>{sanitizedRegistration.discountRemark}</span>
                    )}
                    {sanitizedRegistration.discountAmount && (
                      <span className="text-violet-800 ml-1 text-xs">
                        ({sanitizedRegistration.discountAmountDisplay}€)
                      </span>
                    )}
                  </>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Remark Form Section */}
          <hr className="my-6 border-t border-neutral-200" />
          <div className="mt-6">
            <div className="text-sm font-semibold text-neutral-800 mb-2">Remark:</div>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Invoices Section */}
        <section className="px-8 py-3 border-b border-neutral-200">
          <div>
            {/* Header row - Changed from grid-cols-4 to grid-cols-3 to match the data rows */}
            <div className="grid grid-cols-3 font-semibold text-neutral-700 text-xs uppercase border-b border-neutral-200 pb-2">
              <div className="col-span-1">Invoice</div>
              <div className="col-span-1 text-center">Recipient</div>
              <div className="col-span-1 text-center">Status</div>
            </div>
            
            {/* Invoice list */}
            <div className="border-b border-neutral-200 mb-2">
              {sanitizedInvoices.length === 0 && (
                <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                  No invoices found
                </div>
              )}
              {sanitizedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="grid grid-cols-3 items-center py-2 border-b border-neutral-100 last:border-b-0 bg-white transition-colors hover:bg-blue-50"
                >
                  <div className="col-span-1 flex items-center gap-2">
                    {/* Downloadable invoice link with tooltip */}
                    <span 
                      className="truncate max-w-[120px] block" 
                      title={`#${inv.id || inv.id || ''} - €${inv.amount?.toString() || ''}`}
                    >
                      <DownloadPDFLink
                        uuidString={sanitizedRegistration.id}
                        filename={`${inv.invoiceNumber}.pdf`}
                        className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                      />
                    </span>
                    
                    {/* View invoice details icon */}
                    <Link
                      href={`/invoice/${inv.id}`}
                      className="text-neutral-400 hover:text-blue-600 transition"
                      title="View invoice details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
                      </svg>
                    </Link>
                    
                    {/* Add Edit link */}
                    <Link
                      href={`/invoice/${inv.id}/edit`}
                      className="text-neutral-400 hover:text-blue-600 transition"
                      title="Edit invoice"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                  </div>
                  
                  {/* Invoice recipient */}
                  <div className="col-span-1 flex items-center justify-center text-xs">
                    {inv.recipient?.type === 'PERSON'
                      ? `${inv.recipient.recipientName ?? ''} ${inv.recipient.recipientSurname ?? ''}`.trim() || '-'
                      : inv.recipient?.type === 'COMPANY'
                        ? inv.recipient.companyName ?? '-'
                        : '-'}
                  </div>
                  
                  {/* Invoice status */}
                  <div className="col-span-1 flex items-center justify-center text-xs">
                    <form action={toggleInvoiceCancelled}>
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
                        {inv.isCancelled ? "Cancelled" : "Active"}
                      </button>
                    </form>
                    {inv.transactionNumber && !inv.isCancelled && (
                      <span className="ml-2 text-green-700 font-semibold">Paid</span>
                    )}
                    {!inv.transactionNumber && !inv.isCancelled && (
                      <span className="ml-2 text-yellow-600 font-semibold">Unpaid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Create Invoice Button */}
            <div className="flex justify-end mt-4">
              {hasActiveInvoice ? (
                <span
                  className="px-3 py-1 rounded text-xs font-medium bg-neutral-200 text-neutral-400 cursor-not-allowed select-none"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  Create Invoice
                </span>
              ) : (
                <Link
                  href={`/courseregistration/${registrationId}/create-invoice`}
                  className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Create Invoice
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="px-8 py-3 border-b border-neutral-200">
          <div>
            {/* Header row */}
            <div className="flex items-center font-semibold text-neutral-700 text-xs uppercase border-b border-neutral-200 pb-2">
              <div className="flex-1">Document</div>
              <div className="w-40">Type</div>
              <div className="w-10"></div>
            </div>
            
            {/* Document list */}
            <div className="border-b border-neutral-200 mb-2">
              {sanitizedDocuments.length === 0 ? (
                <div className="flex items-center px-2 py-2 text-neutral-400 italic text-xs bg-white rounded">
                  No documents found
                </div>
              ) : (
                sanitizedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0 bg-white transition-colors hover:bg-blue-50"
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <DownloadPDFLink
                        uuidString={sanitizedRegistration.id}
                        filename={doc.file}
                        className="text-blue-700 hover:text-blue-900 font-medium text-sm"
                      />
                    </div>
                    <div className="w-40 text-neutral-600 text-xs">{labelMap[doc.role] || doc.role}</div>
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
            
            {/* Link to deleted documents */}
            <div className="flex justify-start mt-4">
              <Link
                href={`/courseregistration/${registrationId}/deletedDocuments`}
                className="inline-flex items-center gap-1 text-neutral-400 hover:text-orange-600 text-xs transition"
              >
                View Deleted Documents
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
          <h2 className="text-sm font-semibold text-neutral-800 mb-4">Generate Documents</h2>
          <div className="flex gap-4 flex-wrap justify-center">

            {/* Create a fully serialized version of the registration */}
            {(() => {
              // This immediately-invoked function ensures we only do this once
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
        {/* Navigation Footer */}
        <nav className="flex gap-4 justify-end px-8 py-6">
          <Link href={`/course/${registration?.courseId}`} className="text-neutral-400 hover:text-blue-600 text-sm transition">
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