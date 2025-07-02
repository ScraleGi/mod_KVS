import { PrismaClient } from '../../../generated/prisma'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function Page() {
  const courses = await prisma.course.findMany({
    where: { deletedAt: null },
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true,
      registrations: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Courses</h1>
          <div className="flex gap-2">
            <Link
              href="/course/new"
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Add New Course"
              aria-label="Add New Course"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/"
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              title="Back to Home"
              aria-label="Back to Home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/course/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Deleted Courses"
              aria-label="Deleted Courses"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
              </svg>
            </Link>
          </div>
        </div>
        {/* Courses Table Style List */}
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="divide-y divide-gray-100">
            <div className="hidden md:grid grid-cols-[2.2fr_2.5fr_1fr_1fr_1.5fr_1fr_0.7fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600 rounded-t-sm w-full border-b border-gray-200">
              <div>Course</div>
              <div>Area</div>
              <div>Start</div>
              <div>Trainer</div>
              <div>Additional</div>
              <div>Registrations</div>
              <div className="text-right">Actions</div>
            </div>
            {courses.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">No courses found.</div>
            )}
            {courses.map(course => (
              <div
                key={course.id}
                className="grid grid-cols-1 md:grid-cols-[2.2fr_2.5fr_1fr_1fr_1.5fr_1fr_0.7fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition group w-full text-[13px]"
              >
                {/* Course Name */}
                <div className="font-medium text-blue-700 truncate max-w-[180px]">
                  <Link href={`/course/${course.id}`} className="hover:underline">
                    {course.program?.name}
                  </Link>
                </div>
                {/* Area */}
                <div className="text-gray-700 truncate max-w-[220px]">
                  {course.program?.area?.name || 'N/A'}
                </div>
                {/* Start Date */}
                <div className="text-gray-700 whitespace-nowrap">
                  {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                </div>
                {/* Main Trainer */}
                <div className="text-gray-700 truncate max-w-[120px]">
                {course.mainTrainer
                  ? `${course.mainTrainer.name} ${course.mainTrainer.surname}`
                  : 'N/A'}
                </div>
                {/* Additional Trainers */}
                <div className="text-gray-700 truncate max-w-[160px]">
                  {course.trainers && course.trainers.length > 0
                    ? course.trainers.map(t => `${t.name} ${t.surname}`).join(', ')
                    : <span className="text-gray-400">—</span>}
                </div>
                {/* Registrations */}
                <div>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {course.registrations.length}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/course/${course.id}/edit`}
                    className="p-2 rounded hover:bg-blue-100 text-blue-600 transition"
                    title="Edit"
                    aria-label="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}