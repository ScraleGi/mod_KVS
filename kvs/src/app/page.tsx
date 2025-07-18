import { CourseTable, home, CourseRow } from '../components/overviewTable/table'
import Dashboard from '@/components/navigation/Dashboard'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Course } from '@/types/models'
import { formatFullName } from '@/lib/utils'
import Link from "next/link";
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from 'next/navigation'
import TableTopButton from '@/components/navigation/TableTopButton'

export default async function Home() {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN', 'MARKETING'],
  })

  if (roles.length === 0) {
    redirect('/403')
  }
  // Fetch courses with related data
  const courses = await db.course.findMany({
    where: { deletedAt: null }, // Only show active courses
    include: {
      program: { include: { area: true } },
      mainTrainer: true,
      trainers: true,
      registrations: {
        where: {
          deletedAt: null, // Only include active registrations
          participant: {
            deletedAt: null // Also filter out registrations with soft-deleted participants
          }
        },
        include: {
          participant: true,
          invoices: true,
        },
      },
    },
  })

  // Sanitize data to handle Decimal values
  const sanitizedCourses = sanitize(courses) as unknown as Course[]

  // Transform data for the table
  const tableData: CourseRow[] = sanitizedCourses.map(course => ({
    id: course.id,
    course: course.program?.name ?? 'N/A',
    area: course.program?.area?.name ?? 'N/A',
    startDate: course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A',
    trainer: course.mainTrainer
      ? formatFullName(course.mainTrainer)
      : 'N/A',
    additionalTrainers: course.trainers?.map(t => t.name).join(', ') ?? '',
    registrations: course.registrations?.length || 0,
    participants: course.registrations?.map(reg => ({
      id: reg.participant?.id ?? reg.id,
      name: reg.participant?.name ?? 'N/A',
      surname: reg.participant?.surname ?? '',
      email: reg.participant?.email ?? '',
      invoice: reg.invoices?.length
        ? reg.invoices.map(inv => `#${inv.id}: €${inv.amount}`).join(", ")
        : "No invoice",
    })) || [],
  }))

  if (roles.some(role => role.role === 'MARKETING')) {
    return (
      <div className="p-8">
        <Dashboard />
        <TableTopButton
          title="Kursübersicht"
          button1=""
          button3=""
          auth={true}
        />
        <CourseTable data={tableData} columns={home} />
      </div>
    )
  }

  return (
    <div className="p-8">
      <Dashboard />
      <TableTopButton
        title="Kursübersicht"
        button1="/course/new"
        button2="/"
        button3="/course/deleted"
      />
      <CourseTable data={tableData} columns={home} />
    </div>
  )
}