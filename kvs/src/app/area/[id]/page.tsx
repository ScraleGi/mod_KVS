import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Info, GraduationCap, Pencil } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AreaDetailPage({ params }: { params: { id: string } }) {
  const { id } = await  params;
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
    <div className="min-h-screen bg-[#f8fafd] py-14 px-4">
      {/* Breadcrumb jetzt außerhalb des Card-Containers */}
      <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
        <Link href="/area" className="hover:underline text-gray-700">Back to Areas</Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-semibold">{area.name}</span>
      </nav>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-8 relative">
        {/* Edit-Link oben rechts IM Container */}
        <Link
          href={`/area/${area.id}/edit`}
          className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition"
          title="Edit Area"
        >
          <Pencil className="w-5 h-5 cursor-pointer" />
        </Link>

        {/* Überschrift zentriert */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{area.name}</h1>

        {/* Optional: Image Placeholder */}
        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center mb-8">
          <span className="text-gray-400">[Image Placeholder]</span>
        </div>

        {/* Beschreibung */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            Area Description
          </h2>
          <div className="text-gray-700 text-base ml-7">
            {area.description || <span className="text-gray-400">No description.</span>}
          </div>
        </div>

        {/* Programme-Liste */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            Programs
          </h2>
          <ul className="space-y-3 ml-2">
            {area.programs.length === 0 ? (
              <li className="text-gray-400 italic ml-5 list-none">No programs in this area.</li>
            ) : (
              area.programs.map(program => (
                <li key={program.id} className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition">
                  <div>
                    <Link
                      href={`/program/${program.id}`}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      {program.name}
                    </Link>
                    <div className="text-sm text-gray-500">
                      {program.description || 'No description.'}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Back-Button jetzt innerhalb der Card */}
        <div className="mt-10 flex justify-end">
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
  )
}
