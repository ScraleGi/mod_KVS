import Link from 'next/link'
import AreaToaster from './AreaToaster'
import { notFound } from 'next/navigation'
import { Info, GraduationCap } from 'lucide-react'
import { db } from '@/lib/db'
import { Area } from '@/types/models'
import { sanitize } from '@/lib/sanitize'
import { getAuthorizing } from '@/lib/getAuthorizing'
import EditPencil from '@/components/navigation/EditPencil'
import { redirect } from 'next/navigation';

// Define interface for the area with programs that match the query select
interface AreaWithPrograms extends Omit<Area, 'programs'> {
  programs: {
    id: string
    name: string
    description: string | null
  }[]
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
  const { id } = await params;

  const area = await db.area.findUnique({
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

  // Sanitize data to handle any Decimal values
  const sanitizedArea = sanitize<typeof area, AreaWithPrograms>(area);

  if (roles.some(role => role.role === 'MARKETING' || role.role === 'RECHNUNGSWESEN' || role.role === 'TRAINER')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafd] py-14 px-4">
        {/* Breadcrumb navigation */}
        <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/area" className="hover:underline text-gray-700">Bereiche</Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">{sanitizedArea.name}</span>
        </nav>
        <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-8 relative">
          {/* Edit button */}
          <EditPencil
            goTo={``}
            auth={true}
          />

          {/* Area title */}
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{sanitizedArea.name}</h1>

          {/* Image placeholder */}
          <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center mb-8">
            <span className="text-gray-400">[Image Placeholder]</span>
          </div>

          {/* Area description */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" />
              Bereichsbeschreibung
            </h2>
            <div className="text-gray-700 text-base ml-7">

              {sanitizedArea.description || <span className="text-gray-400">Keine Beschreibung.</span>}
            </div>
          </div>

          {/* Programs list */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              Programm
            </h2>
            <ul className="space-y-3 ml-2">

              {sanitizedArea.programs.length === 0 ? (
                <li className="text-gray-400 italic ml-5 list-none">Keine Programme in diesem Bereich.</li>
              ) : (
                sanitizedArea.programs.map(program => (
                  <li key={program.id} className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition">
                    <div>
                      <Link
                        href={`/program/${program.id}`}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        {program.name}
                      </Link>
                      <div className="text-sm text-gray-500">
                        {program.description || 'Keine Beschreibung.'}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafd] py-14 px-4">
      <AreaToaster />
      {/* Breadcrumb navigation */}
      <nav className="max-w-xl mx-auto mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
        <Link href="/area" className="hover:underline text-gray-700">Bereiche</Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-semibold">{sanitizedArea.name}</span>
      </nav>
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg px-6 py-8 relative">
        {/* Edit button */}
        <EditPencil
          goTo={`/area/${sanitizedArea.id}/edit`}
        />

        {/* Area title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 drop-shadow-sm">{sanitizedArea.name}</h1>

        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center mb-8">
          <span className="text-gray-400">[Image Placeholder]</span>
        </div>

        {/* Area description */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-2 text-gray-600 flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            Bereichsbeschreibung
          </h2>
          <div className="text-gray-700 text-base ml-7">

            {sanitizedArea.description || <span className="text-gray-400">Keine Beschreibung.</span>}
          </div>
        </div>

        {/* Programs list */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-600 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gray-400" />
            Programm
          </h2>
          <ul className="space-y-3 ml-2">

            {sanitizedArea.programs.length === 0 ? (
              <li className="text-gray-400 italic ml-5 list-none">Keine Programme in diesem Bereich.</li>
            ) : (
              sanitizedArea.programs.map(program => (
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
      </div>
    </div>
  )
}