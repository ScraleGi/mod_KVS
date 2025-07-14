import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { SanitizedDocument } from '@/types/query-models'
import { sanitize } from '@/lib/sanitize'
import { revalidatePath } from 'next/cache'

//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
async function restoreDocument(formData: FormData) {
  'use server'
  const documentId = formData.get('documentId') as string
  const registrationId = formData.get('registrationId') as string
  
  await db.document.update({
    where: { id: documentId },
    data: { deletedAt: null },
  })
  
  revalidatePath(`/courseregistration/${registrationId}`)
  redirect(`/courseregistration/${registrationId}`)
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function DeletedDocumentsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const registrationId = id

  // Find the registration
  const registration = await db.courseRegistration.findFirst({
    where: { 
      id: registrationId 
    },
  })

  //---------------------------------------------------
  // EARLY RETURN FOR MISSING DATA
  //---------------------------------------------------
  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
            <p className="text-gray-500 text-sm">Keine Registrationen gefunden.</p>
            <Link
              href={`/courseregistration/${registrationId}`}
              className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Zurück
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch soft-deleted documents
  const documents = await db.document.findMany({
    where: {
      courseRegistrationId: registration.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: 'desc' },
  })

  // Sanitize document data
  const deletedDocuments = sanitize(documents) as SanitizedDocument[];

  //---------------------------------------------------
  // RENDER UI
  //---------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">gelöschte Dokumente</h1>
          
          {/* Document List */}
          {deletedDocuments.length === 0 ? (
            <p className="text-gray-500 text-sm">Keine gelöschten Dokumente gefunden.</p>
          ) : (
            <ul className="space-y-4">
              {deletedDocuments.map(doc => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-blue-900"
                    >
                      {doc.file.split('/').pop()}
                    </a>
                    <span className="ml-4 text-gray-500 text-xs">({doc.role})</span>
                    {doc.deletedAt && (
                      <span className="ml-4 text-red-500 text-xs">
                        Gelöscht: {new Date(doc.deletedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <form action={restoreDocument}>
                    <input type="hidden" name="documentId" value={doc.id} />
                    <input type="hidden" name="registrationId" value={registrationId} />
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      aria-label={`Restore ${doc.file.split('/').pop()}`}
                    >
                       Wiederherstellen
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          
          {/* Navigation */}
          <Link
            href={`/courseregistration/${registrationId}`}
            className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Zurück zu den Registrationen
          </Link>
        </div>
      </div>
    </div>
  )
}