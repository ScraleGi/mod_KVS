import { PrismaClient } from '../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// Server action to restore a participant
async function restoreParticipant(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.participant.update({
    where: { id },
    data: { deletedAt: null },
  })
  redirect('/participant/deleted')
}

export default async function DeletedParticipantsPage() {
  const deletedParticipants = await prisma.participant.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Deleted Participants</h1>
          {deletedParticipants.length === 0 ? (
            <p className="text-gray-500 text-sm">No deleted participants found.</p>
          ) : (
            <ul className="space-y-4">
              {deletedParticipants.map(participant => (
                <li
                  key={participant.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="font-semibold text-gray-800">
                      {participant.name} {participant.surname}
                    </span>
                    <span className="ml-4 text-gray-500 text-xs">
                      {participant.email}
                    </span>
                  </div>
                  <form action={restoreParticipant}>
                    <input type="hidden" name="id" value={participant.id} />
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
            href="/participant"
            className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Participants
          </Link>
        </div>
      </div>
    </div>
  )
}