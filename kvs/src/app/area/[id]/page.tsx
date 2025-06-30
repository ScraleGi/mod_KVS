import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function AreaDetailPage({ params }: { params: { id: string } }) {
  const area = await prisma.area.findUnique({
    where: { id: params.id, deletedAt: null },
    include: {
      programs: {
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, description: true }
      }
    }
  })

  if (!area) return notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-8 py-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
              {area.name}
            </h1>
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center mb-2">
              <span className="text-gray-400">[Image Placeholder]</span>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <div className="text-gray-700 text-sm mb-4">
                {area.description || <span className="text-gray-400">No description.</span>}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Programs</h2>
              {area.programs.length === 0 ? (
                <div className="text-gray-500 text-sm">No programs in this area.</div>
              ) : (
                <ul className="space-y-2">
                  {area.programs.map(program => (
                    <li key={program.id} className="bg-gray-50 rounded px-4 py-3 border border-gray-100">
                      <Link
                        href={`/program/${program.id}`}
                        className="text-blue-700 font-medium hover:underline text-sm"
                      >
                        {program.name}
                      </Link>
                      <div className="text-gray-600 text-xs mt-1">
                        {program.description || 'No description.'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8 flex justify-between">
              <Link
                href="/area"
                className="inline-flex items-center px-4 py-2 rounded text-xs bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Areas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}