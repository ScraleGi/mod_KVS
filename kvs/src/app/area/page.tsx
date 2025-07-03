import { PrismaClient } from '../../../generated/prisma/client'
import { CourseTable, areaColumns, AreaRow } from '@/components/overviewTable/table'
import Link from 'next/link'

const prisma = new PrismaClient()

async function getAreasWithPrograms() {
  // Fetch areas, their programs, and for each program, fetch courses and registrations
  const areas = await prisma.area.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      programs: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          course: {
            select: {
              id: true,
              registrations: { select: { id: true } }
            }
          }
        }
      }
    }
  })

  // For each area, calculate total courses and total participants
  return areas.map(area => {
    const courseCount = area.programs.reduce((count, program) => count + (program.course ? program.course.length : 0), 0)
    const participantCount = area.programs.reduce((count, program) => {
      return count + (program.course ? program.course.reduce((cCount, course) => cCount + course.registrations.length, 0) : 0)
    }, 0)

    return {
      id: area.id,
      name: area.name,
      programs: area.programs.map(program => ({
        id: program.id,
        name: program.name
      })),
      courseCount,
      participantCount
    }
  })
}

export default async function AreasPage() {

    const areas = await getAreasWithPrograms()
    if (!areas || areas.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">No Areas Found</h1>
                <p className="text-gray-600">There are currently no areas available.</p>
            </div>
        )
    }
    const tableData: AreaRow[] = areas.map(area => ({
        id: area.id,
        area: area.name, // <- dieses Feld ergänzen
        name: area.name,
        programs: area.programs.map(program => ({
            id: program.id,
            name: program.name
        })),
        courseCount: area.courseCount,
        participantCount: area.participantCount
    }))
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
        {/* Header */}
      <div className="flex items-center justify-between mb-8">
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Areas</h1>
           <div className="flex gap-2">
             <Link
               href="/area/new"
               className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
               title="Add New Area"
               aria-label="Add New Area"
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
              href="/area/deleted"
              className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
              title="Deleted Areas"
              aria-label="Deleted Areas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
        {/* Areas Table */}
        <CourseTable
          data={tableData}
          columns={areaColumns}
        />
    </div>
  )
}