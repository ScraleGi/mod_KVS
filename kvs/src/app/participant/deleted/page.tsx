//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { sanitize } from '@/lib/sanitize'

//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
// Server action to restore a participant
async function restoreParticipant(formData: FormData) {
  'use server'
  try {
    const id = formData.get('id') as string
    await db.participant.update({
      where: { id },
      data: { deletedAt: null },
    })
  } catch (error) {
    console.error('Failed to restore participant:', error)
    throw error
  }
  
  redirect('/participant/deleted')
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function DeletedParticipantsPage() {
  try {
    //---------------------------------------------------
    // DATA FETCHING
    //---------------------------------------------------
    const deletedParticipantsData = await db.participant.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
    })
    
    // Sanitize data to handle any special types
    const deletedParticipants = sanitize(deletedParticipantsData)

    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen bg-neutral-50 py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-md border border-neutral-100 px-8 py-10">
            <h1 className="text-2xl font-bold text-neutral-900 mb-6 tracking-tight">Archived Participants</h1>
            
            {deletedParticipants.length === 0 ? (
              <div className="text-neutral-500 text-sm bg-neutral-50 p-4 rounded-lg">
                No archived participants found.
              </div>
            ) : (
              <ul className="space-y-4">
                {deletedParticipants.map(participant => (
                  <li
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-neutral-800">
                        {participant.name} {participant.surname}
                      </span>
                      <span className="ml-4 text-neutral-500 text-xs">
                        {participant.email}
                      </span>
                      <div className="text-neutral-400 text-xs mt-1">
                        Archived on: {participant.deletedAt ? new Date(participant.deletedAt).toLocaleDateString('de-DE') : 'Unknown date'}
                      </div>
                    </div>
                    <form action={restoreParticipant}>
                      <input type="hidden" name="id" value={participant.id} />
                      <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
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
              className="mt-8 inline-flex items-center text-xs font-medium text-neutral-500 hover:text-blue-700 transition-colors"
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
  } catch (error) {
    console.error('Error loading deleted participants:', error)
    
    //---------------------------------------------------
    // ERROR STATE
    //---------------------------------------------------
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4 bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">
            An error occurred while loading the archived participants. Please try again later.
          </p>
          <Link href="/participant" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Participants
          </Link>
        </div>
      </div>
    )
  }
}