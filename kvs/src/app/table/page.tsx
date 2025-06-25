// -------------------- Imports --------------------
import { PrismaClient } from '../../../generated/prisma'
import { CourseTable, CourseRow } from './table'

// -------------------- Prisma Client Setup --------------------
const prisma = new PrismaClient()

// -------------------- Page Component --------------------
/**
 * OverviewPage fetches course data from the database,
 * transforms it into the shape expected by CourseTable,
 * and renders the table.
 */
export default async function OverviewPage() {
  // Fetch all courses with related program, area, trainer, registrations, participants, and invoices
  const courses = await prisma.course.findMany({
    include: {
      program: { include: { area: true } },
      trainer: true,
      registrations: {
        include: {
          participant: true,
          invoices: true,
        },
      },
    },
  })

  // Transform raw data into CourseRow[] for the table
  const tableData: CourseRow[] = courses.map(course => ({
    id: course.id,
    course: course.program?.name ?? 'N/A',
    area: course.program?.area?.name ?? 'N/A',
    startDate: course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A',
    trainer: course.trainer?.name ?? 'N/A',
    registrations: course.registrations.length,
    participants: course.registrations.map(reg => ({
      id: reg.participant?.id ?? reg.id,
      name: reg.participant?.name ?? 'N/A',
      status: reg.status ?? 'N/A',
      invoice: reg.invoices.length
        ? reg.invoices.map(inv => `#${inv.id}: $${inv.amount}`).join(", ")
        : "No invoice",
    })),
  }))

  // Render the page with the CourseTable
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Courses Overview</h1>
      <CourseTable data={tableData} />
    </div>
  )
}