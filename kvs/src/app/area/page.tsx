import { CourseTable, areaColumns, AreaRow } from '@/components/overviewTable/table'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Area } from '@/types/models'
import { sanitize } from '@/lib/sanitize'
import AreaToaster from './[id]/AreaToaster'

// Define types for our program data structure
interface ProgramWithCoursesAndRegistrations {
  id: string
  name: string
  course: {
    id: string
    registrations: { id: string }[]
  }[]
}

// Define the type for the processed area data
interface ProcessedArea {
  id: string
  name: string
  programs: { id: string; name: string }[]
  courseCount: number
  participantCount: number
}

async function getAreasWithPrograms(): Promise<ProcessedArea[]> {
  // Fetch areas, their programs, and for each program, fetch courses and registrations
  const areas = await db.area.findMany({
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

  // Sanitize the data to handle any Decimal values
  const sanitizedAreas = sanitize<typeof areas, Area[]>(areas)

  // For each area, calculate total courses and total participants
  return sanitizedAreas.map(area => {
    const programs = area.programs as unknown as ProgramWithCoursesAndRegistrations[]
    
    const courseCount = programs?.reduce(
      (count, program) => count + (program.course ? program.course.length : 0), 
      0
    ) || 0
    
    const participantCount = programs?.reduce(
      (count, program) => {
        return count + (program.course 
          ? program.course.reduce((cCount, course) => cCount + (course.registrations?.length || 0), 0) 
          : 0)
      }, 
      0
    ) || 0

    return {
      id: area.id,
      name: area.name,
      programs: programs?.map(program => ({
        id: program.id,
        name: program.name
      })) || [],
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
                <h1 className="text-3xl font-bold mb-6">Keine Bereiche gefunden.</h1>
                <p className="text-gray-600">Derzeit sind keine Bereiche verfügbar.</p>
            </div>
        )
    }
    
    const tableData: AreaRow[] = areas.map(area => ({
        id: area.id,
        area: area.name,
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
          <AreaToaster />
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bereiche</h1>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                            <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
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