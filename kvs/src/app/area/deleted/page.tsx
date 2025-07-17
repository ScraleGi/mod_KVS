import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Area } from '@/types/models'
import ClientToasterWrapper from './ClientToasterWrapper'
import { getAuthorizing } from '@/lib/getAuthorizing';

interface DeletedAreaWithPrograms extends Omit<Area, 'programs'> {
  programs: {
    id: string;
    name: string;
  }[];
}

// Server action to restore an area and its courses
async function restoreArea(formData: FormData) {
  'use server'
  try {
    const id = formData.get('id') as string

    if (!id) {
      throw new Error('Area ID is required')
    }

    // Restore the area by setting deletedAt to null
    await db.area.update({
      where: { id },
      data: { deletedAt: null }
    })

    // Restore all programs associated with this area
    await db.program.updateMany({
      where: { areaId: id },
      data: { deletedAt: null }
    })
  } catch (error) {
    console.error('Failed to restore area:', error)
    throw error
  }

  redirect('/area?restored=1')
}

export default async function DeletedAreasPage() {
  // Check user authorization
 const roles = await getAuthorizing({
    privilige: ['ADMIN'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
  // Fetch all soft-deleted areas with their associated programs
  const deletedAreas = await db.area.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    include: {
      programs: {
        where: { deletedAt: { not: null } },
        select: { id: true, name: true }
      }
    }
  })

  // Sanitize data to handle any Decimal values
  const sanitizedAreas = sanitize<typeof deletedAreas, DeletedAreaWithPrograms[]>(deletedAreas)

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <ClientToasterWrapper />
      <div className="w-full max-w-2xl">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/area" className="hover:underline text-gray-700">Bereiche</Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">gelöschte Bereiche</span>
        </nav>
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Gelöschte Bereiche</h1>
          {sanitizedAreas.length === 0 ? (
            <p className="text-gray-500 text-sm">Keine gelöschten Bereiche gefunden.</p>
          ) : (
            <ul className="space-y-4">
              {sanitizedAreas.map(area => (
                <li
                  key={area.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="font-semibold text-gray-800">{area.name}</span>
                    {area.programs.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Kurse: {area.programs.map(p => p.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <form action={restoreArea} className="mt-3 sm:mt-0">
                    <input type="hidden" name="id" value={area.id} />
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Wiederherstellen
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/area"
            className="mt-8 inline-flex items-center text-xs font-medium text-gray-500 hover:text-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Bereiche
          </Link>
        </div>
      </div>
    </div>
  )
}