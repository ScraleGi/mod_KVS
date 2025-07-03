import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function AreaDetailPage({ params }: { params: { id: string } }) {
const { id } = await params;
// here await added 
  const area = await prisma.area.findUnique({
    where: { id, deletedAt: null },
    include: {
      programs: {
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, description: true }
      }
    }
  });

  if (!area) return notFound();

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
               className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
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