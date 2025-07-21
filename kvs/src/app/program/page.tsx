//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { CourseTable, programColumns } from '@/components/overviewTable/table'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { SanitizedProgram } from '@/types/query-models';
import { getAuthorizing } from '@/lib/getAuthorizing';
import ProgramToaster from './[id]/ProgramToaster';
import TableTopButton from '@/components/navigation/TableTopButton'

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
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN', 'MARKETING'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
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

    // Check user authorization
    await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
    })

    //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen bg-neutral-50 py-10 px-4">
        <ProgramToaster />
        {/* Header */}
        <TableTopButton
          title="Programme"
          button1='/program/new'
          button2='/'
          button3='/program/deleted'>
        </TableTopButton>

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