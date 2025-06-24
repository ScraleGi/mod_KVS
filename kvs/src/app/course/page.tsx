import { PrismaClient } from '../../../generated/prisma'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function Page() {
  const courses = await prisma.course.findMany({
    include: {
      program: { include: { area: true } },
      trainer: true,
      registrations: true,
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight text-center">
          Courses
        </h1>
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {courses.map(course => (
                <div
                  key={course.id}
                  className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-700 mb-1">{course.program?.name}</h2>
                        <p className="text-indigo-600 text-sm mb-1 font-medium">
                        {course.program?.area?.name || 'N/A'}
                      </p>
                      <p className="text-gray-500 text-sm">
                        <span className="font-semibold">Start Date:</span>{' '}
                        {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Trainer: {course.trainer?.name || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-gray-700">
                      <strong>Registrations:</strong> {course.registrations.length}
                    </span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-gray-500 text-center py-12">No courses found.</div>
              )}
            </div>
            {/* Action bar */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/course/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Course
              </Link>
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