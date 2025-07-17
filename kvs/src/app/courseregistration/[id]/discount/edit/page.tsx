import React from 'react'
import Link from 'next/link'
import { updateDiscount } from '../../sharedServerActions/actions'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDateGerman, formatFullName } from '@/lib/utils'
import DiscountClientEditLogic from './discountClientEditLogic'
import { getAuthorizing } from '@/lib/getAuthorizing'

export default async function DiscountEditPage({ params }: { params: Promise<{ id: string }> }) {
  // Check user authorization
    const roles = await getAuthorizing({
      privilige: ['ADMIN', 'PROGRAMMMANAGER', 'RECHNUNGSWESEN'],
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

  const { course, discountAmount, discountRemark } = data

  async function editDiscount(formData: FormData) {
    "use server"
    const amount = formData.get('amount') as string
    const remark = formData.get('remark') as string
    await updateDiscount(id, amount, remark)
    redirect(`/courseregistration/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[800px] mx-auto">
        {/* Navigation Link */}
        <div className="mb-2">
          <Link href={`/courseregistration/${id}`} className="text-blue-500 hover:underline text-sm">
            &larr; Kursregistrierung
          </Link>
        </div>
        {/* Centered Heading */}
        <div className="mb-8 flex justify-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Rabatt bearbeiten
          </h1>
        </div>

        {/* Integrated Course Info Card + Discount Edit Form */}
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

          {/* Discount Edit Form - integrated, no separation */}
          <DiscountClientEditLogic
            onSubmit={editDiscount}
            programPrice={Number(course.program?.price ?? 0)}
            initialEuro={discountAmount ? String(discountAmount) : ''}
            initialRemark={discountRemark ?? ''}
            registrationId={id}
          />
        </div>
      </div>
    </div>
  )
}