import React from 'react'
import Link from 'next/link'
import { updateDiscount } from '../../sharedServerActions/actions'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDateGerman, formatFullName } from '@/lib/utils'
import DiscountClientLogic from './discountClientLogic'
import { getAuthorizing } from '@/lib/getAuthorizing'

export default async function DiscountNewPage({ params }: { params: Promise<{ id: string }> }) {
  // Check user authorization
    const roles = await getAuthorizing({
      privilige: ['ADMIN','PROGRAMMMANAGER'],
    })
  
    if (roles.length === 0) {
      redirect('/403')
    }
  const { id } = await params

  // Fetch course registration, course, program, and trainer info
  const registration = await db.courseRegistration.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          program: { include: { area: true } },
          mainTrainer: true,
        }
      }
    }
  })
  const data = sanitize(registration)

  if (!data?.course) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href={`/courseregistration/${id}`} className="text-blue-500 hover:underline mb-6 block">
          &larr; Kursregistrierung
        </Link>
        <div className="text-red-600 text-lg font-semibold">Kurs nicht gefunden.</div>
      </div>
    )
  }

  const { course } = data

  async function createDiscount(formData: FormData) {
    "use server"
    const amount = formData.get('amount') as string
    const remark = formData.get('remark') as string
    await updateDiscount(id, amount, remark)
    redirect(`/courseregistration/${id}?discountCreated=1`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[800px] mx-auto">
        {/* Navigation Link */}
       <nav className="mb-6 text-sm text-gray-500 flex items-center gap-2 pl-2">
          <Link href="/participant" className="hover:underline text-gray-700">
            Teilnehmerübersicht
          </Link>
          <span>&gt;</span>
          <Link href={`/courseregistration/${id}`} className="hover:underline text-gray-700">
            {course?.program?.name ?? 'Kurs'}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-700 font-semibold">
            Rabatt hinzufügen
          </span>
        </nav>
        {/* Centered Heading */}
        <div className="mb-8 flex justify-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Rabatt hinzufügen
          </h1>
        </div>

        {/* Integrated Course Info Card + Discount Form */}
        <div className="bg-white shadow rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Main Info */}
            <div>
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Programm</dt>
                  <dd>{course.program?.name ?? <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Preis</dt>
                  <dd>{course.program?.price ? `€${course.program.price}` : <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Unterrichtseinheiten</dt>
                  <dd>{course.program?.teachingUnits ?? <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Programm-Code</dt>
                  <dd>{course.program?.code ?? <span className="text-gray-400">N/A</span>}</dd>
                </div>
              </dl>
            </div>
            {/* Right: Dates and Trainer */}
            <div>
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Start</dt>
                  <dd>{formatDateGerman(course.startDate)}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="font-semibold text-gray-700">Ende</dt>
                  <dd>{formatDateGerman(course.endDate)}</dd>
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
                  <dt className="font-semibold text-gray-700">Kurs-Code</dt>
                  <dd>{course.code ?? <span className="text-gray-400">N/A</span>}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Discount Form - integrated, no separation */}
          <DiscountClientLogic
            onSubmit={createDiscount}
            programPrice={Number(course.program?.price ?? 0)}
          />
        </div>
      </div>
    </div>
  )
}