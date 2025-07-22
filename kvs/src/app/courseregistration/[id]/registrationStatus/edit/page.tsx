import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { sanitize } from '@/lib/sanitize'
import { formatDateGerman, formatFullName } from '@/lib/utils'
import { getAuthorizing } from '@/lib/getAuthorizing'

export default async function RegistrationStatusEditPage({ params }: { params: Promise<{ id: string }> }) {
  // Check user authorization
  const roles = await getAuthorizing({
    privilige: ['ADMIN', 'PROGRAMMMANAGER'],
  })

  if (roles.length === 0) {
    redirect('/403')
  }
  const { id } = await params

  // Fetch course registration, course, and participant info
  const registration = await db.courseRegistration.findUnique({
    where: { id },
    include: {
      course: {
        include: {
          program: true,
        }
      },
      participant: true,
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

  const { course, registeredAt, unregisteredAt, infoSessionAt, interestedAt, participant } = data

  async function editStatus(formData: FormData) {
    "use server"
    const registeredAt = formData.get('registeredAt') as string
    const unregisteredAt = formData.get('unregisteredAt') as string
    const infoSessionAt = formData.get('infoSessionAt') as string
    const interestedAt = formData.get('interestedAt') as string

    await db.courseRegistration.update({
      where: { id },
      data: {
        registeredAt: registeredAt ? new Date(registeredAt) : null,
        unregisteredAt: unregisteredAt ? new Date(unregisteredAt) : null,
        infoSessionAt: infoSessionAt ? new Date(infoSessionAt) : null,
        interestedAt: interestedAt ? new Date(interestedAt) : null,
      }
    })
    redirect(`/courseregistration/${id}?statusEdited=1`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        {/* Navigation Link */}
        <div className="mb-2">
          <Link href={`/courseregistration/${id}`} className="text-blue-500 hover:underline text-sm">
            &larr; Kursregistrierung
          </Link>
        </div>
        {/* Centered Heading */}
        <div className="mb-4 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Registrierungsstatus bearbeiten
          </h1>
          {participant && (
            <div className="mt-2 text-base text-gray-700 font-medium text-center">
              Teilnehmer: {formatFullName(participant)}
            </div>
          )}
        </div>

        {/* Integrated Course Info Card + Status Edit Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-2 flex justify-between">
                <dt className="font-semibold text-gray-700">Programm</dt>
                <dd>{course.program?.name ?? <span className="text-gray-400">N/A</span>}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="font-semibold text-gray-700">Kurs-Code</dt>
                <dd>{course.code ?? <span className="text-gray-400">N/A</span>}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="font-semibold text-gray-700">Start</dt>
                <dd>{formatDateGerman(course.startDate)}</dd>
              </div>
              <div className="py-2 flex justify-between">
                <dt className="font-semibold text-gray-700">Ende</dt>
                <dd>{formatDateGerman(course.endDate)}</dd>
              </div>
            </dl>
          </div>

          {/* Status Edit Form */}
          <form action={editStatus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Registriert am</label>
              <input
                type="date"
                name="registeredAt"
                defaultValue={registeredAt ? new Date(registeredAt).toISOString().slice(0, 10) : ''}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Abgemeldet am</label>
              <input
                type="date"
                name="unregisteredAt"
                defaultValue={unregisteredAt ? new Date(unregisteredAt).toISOString().slice(0, 10) : ''}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Infoabend besucht am</label>
              <input
                type="date"
                name="infoSessionAt"
                defaultValue={infoSessionAt ? new Date(infoSessionAt).toISOString().slice(0, 10) : ''}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Kurs Vorgemerkt am</label>
              <input
                type="date"
                name="interestedAt"
                defaultValue={interestedAt ? new Date(interestedAt).toISOString().slice(0, 10) : ''}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="flex justify-between mt-6">
              <Link href={`/courseregistration/${id}`} className="px-4 py-2 bg-neutral-200 rounded">Abbrechen</Link>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Speichern</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}