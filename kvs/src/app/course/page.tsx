import { PrismaClient } from '../../../generated/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// Soft Delete Action for Course
async function deleteCourse(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.course.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
  redirect('/course')
}

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
                <div className="text-gray-700 truncate max-w-[120px]">{course.mainTrainer?.name || 'N/A'}</div>
                {/* Additional Trainers */}
                <div className="text-gray-700 truncate max-w-[160px]">
                  {course.trainers && course.trainers.length > 0
                    ? course.trainers.map(t => t.name).join(', ')
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
                  <form action={deleteCourse}>
                    <input type="hidden" name="id" value={course.id} />
                    <button
                      type="submit"
                      className="p-2 rounded hover:bg-red-100 text-red-600 transition"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}