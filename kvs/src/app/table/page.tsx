import { PrismaClient } from '../../../generated/prisma'
import { CourseTable, CourseRow } from './table'


const prisma = new PrismaClient()

export default async function OverviewPage() {
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
      <h1 className="text-3xl font-bold mb-6">Courses Overview</h1>
      <CourseTable data={tableData} />
    </div>
  )
}