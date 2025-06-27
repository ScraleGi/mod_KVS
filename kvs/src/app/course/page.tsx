// -------------------- Imports --------------------
import { PrismaClient } from '../../../generated/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// -------------------- Prisma Client Setup --------------------
const prisma = new PrismaClient()

// -------------------- Page Component --------------------
/**
 * Page fetches all courses with related program, area, mainTrainer, and registrations,
 * then renders a styled list of course cards with action buttons.
 */

// Soft Delete Action für Kurs
async function deleteCourse(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.course.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
  // Redirect to course list after deletion
  redirect('/course')
}

export default async function Page() {
  // Fetch all courses and their related data from the database
  const courses = await prisma.course.findMany({
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true, // If you want to show additional trainers
      registrations: true,
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight text-center">
          Courses
        </h1>
        {/* Courses Card Container */}
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {/* Render each course as a card */}
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all relative"
                >
                  <div className="flex items-center justify-between mb-1">
                    <Link
                      href={`/course/${course.id}`}
                      className="text-xl font-bold text-blue-700 hover:underline block transition-colors"
                    >
                      {course.program?.name}
                    </Link>
                    <Link
                      href={`/course/${course.id}/edit`}
                      className="ml-2 p-2 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                      aria-label={`Edit ${course.program?.name ?? 'Course'}`}
                      title="Edit Course"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                  </div>
                  <p className="text-indigo-600 text-sm mb-1 font-medium">
                    {course.program?.area?.name || 'N/A'}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <span className="font-semibold">Start Date:</span>{' '}
                    {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                  </p>
                  {/* Trainer, Additional Trainers, and Registrations in one row */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      Trainer: {course.mainTrainer?.name || 'N/A'}
                    </span>
                    {course.trainers && course.trainers.length > 0 && (
                      <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        Additional: {course.trainers.map(t => t.name).join(', ')}
                      </span>
                    )}
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      Registrations: {course.registrations.length}
                    </span>
                  </div>
                </div>
              ))}
              {/* Show message if no courses */}
              {courses.length === 0 && (
                <div className="text-gray-500 text-center py-12">No courses found.</div>
              )}
            </div>
            {/* Action Bar */}
            <div className="mt-8 flex justify-center">
              {/* Add New Course Button */}
              <Link
                href="/course/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Course
              </Link>
              {/* Back to Home Button */}
              <Link
                href="/"
                className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}