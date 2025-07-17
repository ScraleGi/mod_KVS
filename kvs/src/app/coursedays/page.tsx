import Link from 'next/link'
import { db } from '@/src/../lib/db'

export default async function CoursedaysHubPage() {
  // Fetch courses with their related program
  const courses = await db.course.findMany({
    orderBy: { startDate: 'asc' },
    where: { deletedAt: null },
    include: {
      program: true, // This will include the related Program for each Course
    },
  })

  return (
    <main className="min-h-screen flex flex-col items-center py-16 px-2">
      <div className="w-full max-w-2xl bg-white/80 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Kurstermine Verwaltung</h1>
        <div className="space-y-6">
          <Link href="/coursedays/globalHolidays" className="block bg-blue-100 hover:bg-blue-200 rounded px-4 py-3 text-lg font-semibold text-blue-900 text-center">
            Öffentliche Feiertage verwalten
          </Link>
          <div>
            <h2 className="font-semibold mb-2">Kurse</h2>
            <ul className="space-y-2">
              {courses.map(course => (
                <li key={course.id}>
                  <Link
                    href={`/coursedays/${course.id}`}
                    className="block bg-gray-100 hover:bg-gray-200 rounded px-4 py-2 text-gray-800"
                  >
                    {/* Show program name and course code/dates */}
                    {course.program?.name ?? 'Kein Program'} ({course.code})<br />
                    <span className="text-xs text-gray-500">
                      {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}