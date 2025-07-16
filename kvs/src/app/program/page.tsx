//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ArrowLeft } from 'lucide-react'
import { CourseTable, programColumns } from '@/components/overviewTable/table'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { SanitizedProgram } from '@/types/query-models';
import ProgramToaster from './[id]/ProgramToaster';

//---------------------------------------------------
// DATA FETCHING
//---------------------------------------------------
async function getProgramsWithArea() {
  try {
    const programsData = await db.program.findMany({
      where: { deletedAt: null }, // Only non-deleted programs
      include: {
        area: true,
        course: {
          where: { deletedAt: null },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    if (!programsData || programsData.length === 0) {
      return []
    }

    // Sanitize the data to handle Decimal types
const programs = sanitize<typeof programsData, SanitizedProgram[]>(programsData);

return programs.map((program) => ({
  id: program.id,
  program: program.name,
  area: program.area ? program.area.name : 'No Area',
  courses: program.course?.length || 0,
  teachingUnits: program.teachingUnits,
  // Now TypeScript knows price is a string
  price: program.price ? parseFloat(program.price) : null,
}));
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    return []
  }
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function ProgramsPage({
  searchParams,
}: {
  searchParams?: Promise<{ open?: string; q?: string; area?: string }>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  try {
    const tableData = await getProgramsWithArea()

    if (
      tableData.length === 0 &&
      !resolvedSearchParams?.q &&
      !resolvedSearchParams?.area &&
      !resolvedSearchParams?.open
    ) {
      redirect('/program/new')
    }

    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen bg-neutral-50 py-10 px-4">
        <ProgramToaster />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Programme</h1>
          <div className="flex gap-2">
            <Link
              href="/program/new"
              className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Programm hinzufügen"
              aria-label="Programm hinzufügen"
            >
              <Plus className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="p-2 rounded-md bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition"
              title="Startseite"
              aria-label="Startseite"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Link
                href="/program/deleted"
                className="p-2 rounded-md bg-red-100 text-gray-700 hover:bg-red-200 transition"
                title="Programme löschen"
                aria-label="Programme löschen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 256 256" fill="currentColor">
                    <path d="M96,208a8,8,0,0,1-8,8H40a24,24,0,0,1-20.77-36l34.29-59.25L39.47,124.5A8,8,0,1,1,35.33,109l32.77-8.77a8,8,0,0,1,9.8,5.66l8.79,32.77A8,8,0,0,1,81,148.5a8.37,8.37,0,0,1-2.08.27,8,8,0,0,1-7.72-5.93l-3.8-14.15L33.11,188A8,8,0,0,0,40,200H88A8,8,0,0,1,96,208Zm140.73-28-23.14-40a8,8,0,0,0-13.84,8l23.14,40A8,8,0,0,1,216,200H147.31l10.34-10.34a8,8,0,0,0-11.31-11.32l-24,24a8,8,0,0,0,0,11.32l24,24a8,8,0,0,0,11.31-11.32L147.31,216H216a24,24,0,0,0,20.77-36ZM128,32a7.85,7.85,0,0,1,6.92,4l34.29,59.25-14.08-3.78A8,8,0,0,0,151,106.92l32.78,8.79a8.23,8.23,0,0,0,2.07.27,8,8,0,0,0,7.72-5.93l8.79-32.79a8,8,0,1,0-15.45-4.14l-3.8,14.17L148.77,28a24,24,0,0,0-41.54,0L84.07,68a8,8,0,0,0,13.85,8l23.16-40A7.85,7.85,0,0,1,128,32Z"/>
                </svg>
            </Link>
          </div>
        </div>
        
        {/* Display appropriate message if no programs exist */}
        {tableData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-neutral-600 mb-4">Keine Programme gefunden.</p>
            <Link
              href="/program/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Programm erstellen
            </Link>
          </div>
        ) : (
          /* Programs Table Style List */
          <CourseTable data={tableData} columns={programColumns} />
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to load programs page:', error)
    
    //---------------------------------------------------
    // ERROR STATE
    //---------------------------------------------------
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4 bg-white rounded-xl shadow-md border border-neutral-100 p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-neutral-700 mb-6">
             Beim Laden der Programme ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.
          </p>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            &larr; Startseite
          </Link>
        </div>
      </div>
    )
  }
}