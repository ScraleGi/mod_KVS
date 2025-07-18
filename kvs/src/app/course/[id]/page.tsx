import React from 'react'
import Link from 'next/link'
import CourseToaster from './CourseToaster'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatFullName, formatDateGerman } from '@/lib/utils'
import { CourseTable, courseParticipantsColumns, CourseParticipantRow } from '@/components/overviewTable/table'
import type { CourseWithDetailedRelations } from '@/types/query-models'
import { getAuthorizing } from '@/lib/getAuthorizing'
import { redirect } from 'next/navigation'

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

type CourseWithParticipants = Omit<CourseWithDetailedRelations, 'registrations'> & {
  registrations: RegistrationWithAmounts[]
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
      program: { include: { area: true } },
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
        isCancelled: true, // <-- Add this!
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

  const course = sanitize<typeof courseData, CourseWithParticipants>(courseData)

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <CourseToaster />
      <div className="max-w-[1800px] mx-auto">
        <nav className='mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2'>
          <Link href="/" className="hover:underline text-gray-700">
            Kursübersicht
          </Link>
          <span>&gt;</span>
          <span className='text-gray-700 font-semibold'>
            {course.program?.name ?? 'Kurs'}
          </span>
        </nav>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 flex justify-center items-center relative pt-5">
            <h1 className="text-3xl font-bold text-gray-900">{course.program?.name ?? 'Course'}</h1>
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
                  <dd>{formatDateGerman(course.startDate)}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Ende</dt>
                  <dd>{formatDateGerman(course.endDate)}</dd>
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
                  <dt className="font-semibold text-gray-700">Ort</dt>  {/* Logik fehlt noch*/}
                  <dd>
                    <span className="text-gray-400">—</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <CourseTable data={participantRows} columns={courseParticipantsColumns} courseId={course.id} />
      </div>
    </div>
  )
}