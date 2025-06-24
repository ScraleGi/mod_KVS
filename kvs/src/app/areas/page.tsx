import { PrismaClient } from '../../../generated/prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Initialize Prisma client for database operations
const prisma = new PrismaClient()

// Fetch all areas and their courses from the database
async function getAreasWithCourses() {
  return prisma.area.findMany({
    orderBy: { createdAt: 'desc' }, // Order areas by creation date (newest first)
    include: {
      courses: {
        where: { deletedAt: null }, // Only not-deleted courses
        orderBy: { createdAt: 'desc' }, // Order courses by creation date (newest first)
        select: { id: true, name: true } // Only select course id and name
      }
    }
  })
}

// Server action to delete an area and all its courses
async function deleteArea(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  // Delete all courses in the area first to avoid foreign key constraint errors
  await prisma.course.deleteMany({ where: { areaId: id } })
  // Delete the area itself
  await prisma.area.delete({ where: { id } })
  // Redirect back to the areas list after deletion
  redirect('/areas')
}

// Main page component for listing all areas
export default async function AreasPage({ searchParams }: { searchParams?: { open?: string } }) {
  // Fetch areas and their courses
  const areas = await getAreasWithCourses()

  // Await searchParams (Next.js 15+ requirement) and get the 'open' param if present
  // 'open' will be the id of the area to expand, or undefined if none is open
  const open = searchParams ? (await searchParams).open : undefined

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight text-center">
          Areas
        </h1>
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8">
            {/* List of all areas */}
            <ul className="space-y-3">
              {areas.map(area => {
                // Determine if this area card should be expanded
                const isOpen = open === area.id
                // Set the href for toggling the open state using query params
                const href = isOpen ? '/areas' : `/areas?open=${area.id}`
                return (
                  <li key={area.id} className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-x-1">
                    <div className="flex items-center justify-between p-4">
                      {/* Area name and chevron (clickable to expand/collapse details) */}
                      <Link
                        href={href}
                        scroll={false}
                        className="flex items-center flex-1 cursor-pointer select-none"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-gray-700 text-lg">{area.name}</span>
                        <span className="ml-2">
                          {/* Chevron icon, rotates if open */}
                          <svg
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </Link>
                      {/* Edit and Delete buttons, always visible and horizontal */}
                      <div className="flex items-center space-x-2 ml-4">
                        {/* Edit button */}
                        <Link
                          href={`/areas/${area.id}/edit`}
                          className="p-2 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                          aria-label={`Edit ${area.name}`}
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
                        {/* Delete button */}
                        <form action={deleteArea}>
                          <input type="hidden" name="id" value={area.id} />
                          <button
                            type="submit"
                            className="cursor-pointer p-2 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                            aria-label={`Delete ${area.name}`}
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                    {/* Expanded area details, shown only if this card is open */}
                    {isOpen && (
                      <div className="px-4 pb-4">
                        {/* List of courses for this area */}
                        {area.courses.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {area.courses.map(course => (
                              <li key={course.id}>
                                {/* Each course name is a link to its detail page */}
                                <Link
                                  href={`/courses/${course.id}`}
                                  className="text-blue-700 hover:underline"
                                >
                                  {course.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500 text-sm">No courses in this area.</div>
                        )}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
            {/* Add new area and back to home buttons */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/areas/new"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Area
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