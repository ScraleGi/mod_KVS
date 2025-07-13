import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatFullName, formatDateGerman } from '@/lib/utils'
import { CourseTable, courseParticipantsColumns, CourseParticipantRow } from '@/components/overviewTable/table'
import type { CourseWithDetailedRelations } from '@/types/query-models'

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
  invoices: { id: string; invoiceNumber: string; dueDate: Date | null }[]
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
        invoices: true,
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
      <div className="max-w-[1800px] mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-blue-500 hover:underline text-sm">
            &larr; Startseite
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{course.program?.name ?? 'Course'}</h1>
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
        <CourseTable data={participantRows} columns={courseParticipantsColumns} />
      </div>
    </div>
  )
}