import { PrismaClient } from '../../generated/prisma'
import { CourseTable, CourseRow } from '../components/overviewTable/table'

// If you want to keep the Dashboard component, you can import it here
import Dashboard from '@/components/navigation/Dashboard'

// This is a Server Component (remove 'use client' since Prisma queries must run on the server)
export default async function Home() {
  const prisma = new PrismaClient()

  // Fetch courses with related data
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

  // Transform data for the table
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

  return (
    <div className="p-8">
      {/* Optionally keep the Dashboard at the top */}
      <Dashboard />
      <h1 className="text-3xl font-bold mb-6">Courses Overview</h1>
      <CourseTable data={tableData} />
    </div>
  )
}