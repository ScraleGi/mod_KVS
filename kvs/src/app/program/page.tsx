import { PrismaClient } from '../../../generated/prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getProgramsWithArea() {
  return prisma.program.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      area: { select: { name: true } },
      course: true,
    }
  })
}

export default async function ProgramsPage({ searchParams }: { searchParams?: { open?: string } }) {
  const programs = await getProgramsWithArea()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Programs</h1>
          <div className="flex gap-2">
            <Link
              href="/program/new"
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Add New Program"
              aria-label="Add New Program"
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
              href="/program/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Deleted Programs"
              aria-label="Deleted Programs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        {/* Programs Table Style List */}
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="divide-y divide-gray-100">
            <div className="hidden md:grid grid-cols-[2.2fr_2.5fr_1fr_1fr_1.5fr_1fr_0.7fr] gap-3 px-4 py-3 text-[11px] font-semibold text-gray-100 uppercase tracking-wider bg-gray-600 rounded-t-sm w-full border-b border-gray-200">
              <div>Program</div>
              <div>Area</div>
              <div className="text-right">Courses</div>
              <div className="text-right">Teaching Units</div>
              <div className="text-right">Price</div>
              <div className="text-right">Actions</div>
            </div>
            {programs.length === 0 && (
              <div className="px-4 py-12 text-center text-gray-400 text-sm">No programs found.</div>
            )}
            {programs.map(program => (
              <div
                key={program.id}
                className="grid grid-cols-1 md:grid-cols-[2.2fr_2.5fr_1fr_1fr_1.5fr_1fr_0.7fr] gap-3 px-4 py-4 items-center hover:bg-gray-50 transition group w-full text-[13px]"
              >
                {/* Program Name */}
                <div className="font-medium text-blue-700 truncate max-w-[180px]">
                  <Link
                    href={`/program/${program.id}`}
                    className="hover:underline"
                  >
                    {program.name}
                  </Link>
                </div>
                {/* Area */}
                <div className="text-gray-700 truncate max-w-[220px]">
                  {program.area?.name || 'N/A'}
                </div>
                {/* Courses */}
                <div className="text-gray-700 whitespace-nowrap text-right">
                  {program.course ? program.course.length : 0}
                </div>
                {/* Teaching Units */}
                <div className="text-gray-700 whitespace-nowrap text-right">
                  {program.teachingUnits ?? 'N/A'}
                </div>
                {/* Price */}
                <div className="text-gray-700 whitespace-nowrap text-right">
                  {program.price != null ? `€${program.price.toFixed(2)}` : 'N/A'}
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/program/${program.id}/edit`}
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