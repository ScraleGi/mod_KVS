import React from 'react'
import Link from 'next/link'
import CourseToaster from './CourseToaster'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatFullName } from '@/lib/utils'
import { CourseTable, courseParticipantsColumns, CourseParticipantRow } from '@/components/overviewTable/table'
import type { CourseWithDetailedRelations } from '@/types/query-models'
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from 'next/navigation'
import { FaInfoCircle, FaUsers, FaCalendarAlt } from 'react-icons/fa'

// --- Add imports for course tables ---
import { getCourseHolidays, getCourseSpecialDays, getCourseRythms } from '../../actions/courseDaysActions'
import { CourseTablesClient } from '../../../components/coursedays/CourseTablesClient'
import generateCourseDates from '@/app/actions/generateCourseDates'

// Extend the type locally to include email, phoneNumber, discountAmount, subsidyAmount
type ParticipantWithContact = {
  name: string
  surname: string
  email: string
  phoneNumber: string
}

type RegistrationWithAmounts = {
  id: string
  participant: ParticipantWithContact | null
  invoices: { 
    id: string
    invoiceNumber: string
    dueDate: Date | null
    isCancelled?: boolean 
  }[]
  generatedDocuments: { id: string; file: string; role: string; createdAt: Date }[]
  discountAmount?: string | number | null
  subsidyAmount?: string | number | null
  discountRemark?: string | null   
  subsidyRemark?: string | null     
}

type ProgramWithAreaAndUnits = {
  id: string
  name: string
  area: { name: string } | null
  teachingUnits?: number | null
}

type CourseWithParticipants = Omit<CourseWithDetailedRelations, 'registrations'> & {
  registrations: RegistrationWithAmounts[]
  program: ProgramWithAreaAndUnits
}

// --- Helper for date formatting ---
function formatDateISO(date: Date | string | null | undefined) {
  if (!date) return ''
  if (typeof date === 'string') return date
  return date.toISOString()
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN'],
  })
  if (roles.length === 0) {
    redirect('/403')
  }
  const { id } = await params

  const courseData = await db.course.findUnique({
    where: { id },
    include: {
      program: { 
        select: { 
          id: true,
          name: true, 
          area: { select: { name: true } }, 
          teachingUnits: true 
        }
      },
      mainTrainer: true,
      trainers: true,
      registrations: {
        where: { 
          deletedAt: null,
          participant: { deletedAt: null }
        },
        select: {
          id: true,
          participant: {
            select: {
              name: true,
              surname: true,
              email: true,
              phoneNumber: true,
            }
          },
          invoices: {
            select: {
              id: true,
              invoiceNumber: true,
              dueDate: true,
              isCancelled: true,
            }
          },
          generatedDocuments: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' }
          },
          discountAmount: true,
          subsidyAmount: true,
          discountRemark: true,
          subsidyRemark: true,
        }
      },
    },
  })

    // Add the null check here!
  if (!courseData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Startseite
        </Link>
        <div className="text-red-600 text-lg font-semibold">Kurs nicht gefunden.</div>
      </div>
    )
  }

  const course = sanitize<typeof courseData, CourseWithParticipants>(courseData)

  const courseDaysRaw = await db.courseDays.findMany({
    where: { courseId: course.id, deletedAt: null },
    orderBy: { startTime: 'asc' },
  })

  const courseDays = courseDaysRaw.map(day => ({
    id: day.id,
    startTime: formatDateISO(day.startTime),
    endTime: formatDateISO(day.endTime),
    pauseDuration: formatDateISO(day.pauseDuration),
    title: day.title,
    isCourseDay: day.isCourseDay
  }))

  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/" className="text-blue-500 hover:underline mb-6 block">
          &larr; Startseite
        </Link>
        <div className="text-red-600 text-lg font-semibold">Kurse nicht gefunden.</div>
      </div>
    )
  }

  // Prepare participantRows for the table, now fully type-safe
  const participantRows: CourseParticipantRow[] = course.registrations.map(reg => ({
    id: reg.id,
    participant: reg.participant
      ? {
          name: reg.participant.name ?? "",
          surname: reg.participant.surname ?? "",
          email: reg.participant.email ?? "",
          phoneNumber: reg.participant.phoneNumber ?? "",
        }
      : { name: "", surname: "", email: "", phoneNumber: "" },
    invoices: reg.invoices.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      dueDate: inv.dueDate,
      isCancelled: inv.isCancelled
    })),
    generatedDocuments: reg.generatedDocuments.map(doc => ({
      id: doc.id,
      file: doc.file,
      role: doc.role,
      createdAt: doc.createdAt,
    })),
    discountAmount: reg.discountAmount ?? null,
    subsidyAmount: reg.subsidyAmount ?? null,
    discountRemark: reg.discountRemark ?? null,   
    subsidyRemark: reg.subsidyRemark ?? null,    
  }))

  // --- Fetch course tables data ---
  const [holidaysRaw, specialDaysRaw, rythmsRaw] = await Promise.all([
    getCourseHolidays(course.id),
    getCourseSpecialDays(course.id),
    getCourseRythms(course.id)
  ])

  const holidays = holidaysRaw.map(h => ({
    ...h,
    date: formatDateISO(h.date),
    createdAt: formatDateISO(h.createdAt),
    deletedAt: h.deletedAt ? formatDateISO(h.deletedAt) : null,
  }))
  const specialDays = specialDaysRaw.map(d => ({
    ...d,
    title: d.title ?? '',
    startTime: formatDateISO(d.startTime),
    endTime: formatDateISO(d.endTime),
    pauseDuration: formatDateISO(d.pauseDuration),
    createdAt: formatDateISO(d.createdAt),
    deletedAt: d.deletedAt ? formatDateISO(d.deletedAt) : null,
  }))
  const rythms = rythmsRaw.map(r => ({
    ...r,
    startTime: formatDateISO(r.startTime),
    endTime: formatDateISO(r.endTime),
    pauseDuration: formatDateISO(r.pauseDuration),
    createdAt: formatDateISO(r.createdAt),
    deletedAt: r.deletedAt ? formatDateISO(r.deletedAt) : null,
  }))

  const globalHolidaysRaw = await db.holiday.findMany({
    where: { deletedAt: null },
    select: { title: true }
  })
  const globalHolidayTitles = globalHolidaysRaw.map(h => h.title)

  // --- Navigation: Kursübersicht > Programm > Kurs Code ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <CourseToaster />
      <div className="max-w-[1800px] mx-auto">
        <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/" className="hover:underline text-gray-700">
            Kursübersicht
          </Link>
          <span>&gt;</span>
          <Link
            href={`/program/${course.program?.id ?? ''}`}
            className="hover:underline text-gray-700"
          >
            {course.program?.name ?? 'Programm'}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-semibold">
            {course.code ?? 'Kurs'}
          </span>
        </nav>

        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 flex items-center relative pt-5">
            <h1 className="text-3xl font-bold text-gray-900 text-left">{course.program?.name ?? 'Course'}</h1>
            <Link
              href={`/course/${course.id}/edit`}
              className="absolute right-0 text-gray-400 hover:text-blue-600 transition ml-4"
              title="Kurs bearbeiten"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link>
          </div>
          <div />
        </div>

        {/* Organized Course Info Card */}
        <div className="bg-white shadow rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left border-b-2 border-blue-100 pb-2 flex items-center gap-2">
            <FaInfoCircle className="w-6 h-6 text-blue-400" />
            Kursdetails
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Main Info */}
            <div>
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Code</dt>
                  <dd>{course.code ?? <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Bereich</dt>
                  <dd>{course.program?.area?.name ?? <span className="text-gray-400">Unbekannt</span>}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Start</dt>
                  <dd>{course.startDate ? new Date(course.startDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Ende</dt>
                  <dd>{course.endDate ? new Date(course.endDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</dd>
                </div>
              </dl>
            </div>
            {/* Right: Trainer Info */}
            <div>
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Anmeldungen</dt>
                  <dd>{course.registrations.length}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Trainer</dt>
                  <dd>
                    {course.mainTrainer
                      ? formatFullName(course.mainTrainer)
                      : <span className="text-gray-400">N/A</span>}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Co-Trainer</dt>
                  <dd>
                    {course.trainers && course.trainers.length > 0
                      ? course.trainers.map(t => formatFullName(t)).join(', ')
                      : <span className="text-gray-400">—</span>}
                  </dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Einheiten</dt>
                  <dd>
                    {course.program?.teachingUnits != null
                      ? course.program.teachingUnits
                      : <span className="text-gray-400">—</span>}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <section>
          <div className="bg-white shadow rounded-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left border-b-2 border-blue-100 pb-2 flex items-center gap-2">
              <FaUsers className="w-6 h-6 text-blue-400" />
              Teilnehmer-Details
            </h2>
            <CourseTable data={participantRows} columns={courseParticipantsColumns} courseId={course.id} />
          </div>
        </section>

        {/* --- Course Dates Tables Section --- */}
        <section>
          <div className="bg-white shadow rounded-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left border-b-2 border-blue-100 pb-2 flex items-center gap-2">
              <FaCalendarAlt className="w-6 h-6 text-blue-400" />
              Kurstermine Verwalten
            </h2>
            <CourseTablesClient
              holidays={holidays}
              specialDays={specialDays}
              rythms={rythms}
              courseDays={courseDays}
              courseId={course.id}
              globalHolidayTitles={globalHolidayTitles}
            />
          </div>
          <form action={generateCourseDates} className="mt-6 flex flex-col gap-2 items-center">
            <input
              type="hidden"
              name="courseId"
              value={course.id}
            />
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
            >
              Kurstage generieren
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}