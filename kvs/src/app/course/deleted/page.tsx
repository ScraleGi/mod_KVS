import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDate } from '@/lib/utils'
import { DeletedCourseWithProgram } from '@/types/query-models'
import { getAuthorizing } from '@/lib/getAuthorizing';
import ClientToasterWrapper from './ClientToasterWrapper'

/**
 * Server action to restore a soft-deleted course
 */
async function restoreCourse(formData: FormData) {
  'use server'
  const id = formData.get('id') as string

  await db.course.update({
    where: { id },
    data: { deletedAt: null },
  })

  redirect('/course?restored=1')
}

/**
 * Page component for displaying and managing deleted courses
 */
export default async function DeletedCoursesPage() {
  // Check user authorization
    await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER'],
    })
  // Fetch all deleted courses with their program names
  const deletedCoursesData = await db.course.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    include: {
      program: true,
    },
  })

  // Sanitize data to handle any Decimal values
  const deletedCourses = sanitize<typeof deletedCoursesData, DeletedCourseWithProgram[]>(deletedCoursesData)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <ClientToasterWrapper />
      <div className="w-full max-w-2xl">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/" className="hover:underline text-gray-700">
            Kursübersicht
          </Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">Archiv</span>
        </nav>
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Archivierte Kurse</h1>

          {/* Show message when no deleted courses exist */}
          {deletedCourses.length === 0 ? (
            <p className="text-gray-500 text-sm">Keine archivierten Kurse gefunden.</p>
          ) : (
            <ul className="space-y-4">
              {deletedCourses.map(course => (
                <li
                  key={course.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="font-semibold text-gray-800">
                      {course.program?.name || 'Unnamed Course'}
                    </span>
                    <span className="ml-4 text-gray-500 text-xs">
                      {course.startDate ? formatDate(course.startDate) : 'No date'}
                    </span>
                    {course.deletedAt && (
                      <span className="ml-4 text-red-500 text-xs">
                        Archiviert: {formatDate(course.deletedAt)}
                      </span>
                    )}
                  </div>

                  {/* Restore form */}
                  <form action={restoreCourse}>
                    <input type="hidden" name="id" value={course.id} />
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                      aria-label={`Restore ${course.program?.name || 'course'}`}
                    >
                      Wiederherstellen
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}