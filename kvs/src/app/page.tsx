import { PrismaClient } from '../../generated/prisma'
import { CourseTable, columns, CourseRow } from '../components/overviewTable/table'
import Dashboard from '@/components/navigation/Dashboard'

export default async function Home() {
  const prisma = new PrismaClient()

  // Fetch courses with related data
  const courses = await prisma.course.findMany({
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true,
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
    trainer: course.mainTrainer?.name ?? 'N/A',
    additionalTrainers: course.trainers?.map(t => t.name).join(', ') ?? '',
    registrations: course.registrations.length,
    participants: course.registrations.map(reg => ({
      id: reg.participant?.id ?? reg.id,
      name: reg.participant?.name ?? 'N/A',
      email: reg.participant?.email ?? '', // <-- Add this line
      status: reg.status ?? 'N/A',
      invoice: reg.invoices.length
        ? reg.invoices.map(inv => `#${inv.id}: $${inv.amount}`).join(", ")
        : "No invoice",
    })),
  }))

  return (
    <div className="p-8">
      <Dashboard />
      <h1 className="text-3xl font-bold mb-6">Courses Overview</h1>
      <CourseTable data={tableData} columns={columns} />
    </div>
  )
}