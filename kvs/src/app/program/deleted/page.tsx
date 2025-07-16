import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import ClientToasterWrapper from './ClientToasterWrapper'
import { getAuthorizing } from '@/lib/getAuthorizing'

// Server action to restore a program
async function restoreProgram(formData: FormData) {
  'use server'

  const id = formData.get('id') as string

  try {
    await db.program.update({
      where: { id },
      data: { deletedAt: null },
    })
  } catch (error) {
    console.error('Failed to restore program:', error)
    throw error
  }

  redirect('/program?restored=1')
}

export default async function DeletedProgramsPage() {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
  try {
    const deletedProgramsData = await db.program.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: 'desc' },
      include: { area: true }
    })

    // Sanitize data to handle any Decimal values
    const deletedPrograms = sanitize(deletedProgramsData)

    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <ClientToasterWrapper />
        <div className="w-full max-w-2xl">
          <nav className=" mb-6 text-sm  text-gray-500 flex items-center gap-2 pl-2">
            <Link href="/program" className="hover:underline text-gray-700">Programm</Link>
            <span>&gt;</span>
            <span className="text-gray-700 font-semibold">gelöschte Programme</span>
          </nav>
          <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Gelöschte Programme</h1>
            {deletedPrograms.length === 0 ? (
              <p className="text-gray-500 text-sm">Keine gelöschten Programme gefunden.</p>
            ) : (
              <ul className="space-y-4">
                {deletedPrograms.map(program => (
                  <li
                    key={program.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <span className="font-semibold text-gray-800">{program.name}</span>
                      {program.area && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({program.area.name})
                        </span>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Gelöscht: {program.deletedAt ? new Date(program.deletedAt).toLocaleString() : 'Unknown'}
                      </div>
                    </div>
                    <form action={restoreProgram}>
                      <input type="hidden" name="id" value={program.id} />
                      <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      >
                        Wiederherstellen
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex items-center">
          
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to load deleted programs:', error)

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md bg-white rounded-sm shadow border border-gray-100 p-6">
          <div className="text-lg text-red-500 mb-4">Fehler beim laden der gelöschten Programme.</div>
          <Link
            href="/program"
            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Programme
          </Link>
        </div>
      </div>
    )
  }
}