import { CourseTable, areaColumns, AreaRow } from '@/components/overviewTable/table'
import Link from 'next/link'
import { db } from '@/lib/db'
import { Area } from '@/types/models'
import { sanitize } from '@/lib/sanitize'
import { getAuthorizing } from '@/lib/getAuthorizing'
import TableTopButton from '@/components/navigation/TableTopButton'
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

  // Check user authorization
    const roles = await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
    })
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

  if (roles.some(role => role.role === 'MARKETING')) {
        return (<div className="min-h-screen bg-gray-50 py-6 px-4">
            {/* Header */}
            <AreaToaster />
            <TableTopButton
                title="Bereiche"
                button1=""
                button2="/"
                button3=""
                auth={true}
            />
            {/* Areas Table */}
            <CourseTable
                data={tableData}
                columns={areaColumns}
            />

        </div>
    )
  }
    
    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
          <AreaToaster />
            {/* Header */}
            <TableTopButton
                title="Bereiche"
                button1="/area/new"
                button2="/"
                button3="/area/deleted"
            />
            {/* Areas Table */}
            <CourseTable
                data={tableData}
                columns={areaColumns}
            />
        </div>
    )
}