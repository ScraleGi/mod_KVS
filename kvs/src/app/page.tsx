import { CourseTable, home, CourseRow } from '../components/overviewTable/table'
import Dashboard from '@/components/navigation/Dashboard'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { Course } from '@/types/models'
import { formatFullName} from '@/lib/utils'
import Link from "next/link";
import { getAuthorizing } from '@/lib/getAuthorizing'

export default async function Home() {
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

  // Check user authorization
    await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'TRAINER', 'RECHNUNGSWESEN', 'MARKETING'],
    })

  return (
    <div className="p-8">
      <Dashboard />
      <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold mb-6">Kursübersicht</h1>
      <div className="flex gap-2">
        <Link
            href="/course/new"
            className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            title="Add New Area"
            aria-label="Add New Area"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </Link>
        <Link
            href="/course/deleted"
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
      <CourseTable data={tableData} columns={home} />
    </div>
  )
}