import { PrismaClient } from '../../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function DeletedItemsPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const participantId = id


  // Find the registration
  const registration = await prisma.courseRegistration.findFirst({
    where: { 
      id: participantId 
    },
  })

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
            <p className="text-gray-500 text-sm">No registration found.</p>
            <Link
              href={`/courseregistration/${participantId}`}
              className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch soft-deleted documents
  const deletedDocuments = await prisma.document.findMany({
    where: {
      courseRegistrationId: registration.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: 'desc' },
  })

  // Restore document action
  async function restoreDocument(formData: FormData) {
    'use server'
    const documentId = formData.get('documentId') as string
    await prisma.document.update({
      where: { id: documentId },
      data: { deletedAt: null },
    })
    redirect(`/courseregistration/${participantId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Deleted Documents</h1>
          {deletedDocuments.length === 0 ? (
            <p className="text-gray-500 text-sm">No deleted documents found.</p>
          ) : (
            <ul className="space-y-4">
              {deletedDocuments.map(doc => (
                <li
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 underline"
                    >
                      {doc.file.split('/').pop()}
                    </a>
                    <span className="ml-2 text-xs text-gray-500">({doc.role})</span>
                  </div>
                  <form action={restoreDocument} className="mt-3 sm:mt-0">
                    <input type="hidden" name="documentId" value={doc.id} />
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Restore
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/courseregistration/${participantId}`}
            className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Participant
          </Link>
        </div>
      </div>
    </div>
  )
}