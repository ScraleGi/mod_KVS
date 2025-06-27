import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

// Server action to restore an area and its courses
async function restoreArea(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.area.update({
    where: { id },
    data: { deletedAt: null }
  })
  await prisma.program.updateMany({
    where: { areaId: id },
    data: { deletedAt: null }
  })
  redirect('/area/deleted')
}

export default async function DeletedAreasPage() {
  const deletedAreas = await prisma.area.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    include: {
      programs: {
        where: { deletedAt: { not: null } },
        select: { id: true, name: true }
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow border border-gray-100 px-8 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">Deleted Areas</h1>
          {deletedAreas.length === 0 ? (
            <p className="text-gray-500 text-sm">No deleted areas found.</p>
          ) : (
            <ul className="space-y-4">
              {deletedAreas.map(area => (
                <li
                  key={area.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="font-semibold text-gray-800">{area.name}</span>
                    {area.programs.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Courses: {area.programs.map(p => p.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <form action={restoreArea} className="mt-3 sm:mt-0">
                    <input type="hidden" name="id" value={area.id} />
                    <button
                      type="submit"
                      className="cursor-pointer px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Restore
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
            Back to Areas
          </Link>
        </div>
      </div>
    </div>
  )
}