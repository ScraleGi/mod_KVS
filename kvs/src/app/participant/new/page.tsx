import { PrismaClient } from '../../../../generated/prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function NewParticipantPage() {
  // Fetch all available courses for the select dropdown
  const courses = await prisma.course.findMany({
    where: { deletedAt: null },
    include: { program: true }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
        <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Add New Participant</h1>
        <form
          action={async (formData) => {
            'use server'
            const code = formData.get('code') as string
            const name = formData.get('name') as string
            const surname = formData.get('surname') as string
            const salutation = formData.get('salutation') as string
            const title = formData.get('title') as string | null
            const email = formData.get('email') as string
            const phoneNumber = formData.get('phoneNumber') as string
            const birthday = formData.get('birthday') as string
            const postalCode = formData.get('postalCode') as string
            const city = formData.get('city') as string
            const street = formData.get('street') as string
            const country = formData.get('country') as string
            const courseId = formData.get('courseId') as string

            const participant = await prisma.participant.create({
              data: {
                code,
                name,
                surname,
                salutation,
                title: title || null,
                email,
                phoneNumber,
                birthday: new Date(birthday),
                postalCode,
                city,
                street,
                country,
              }
            })

            await prisma.courseRegistration.create({
              data: {
                courseId,
                participantId: participant.id,
              }
            })

            redirect(`/participant/${participant.id}`)
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Code
              <input
                name="code"
                required
                className="mt-1 border rounded px-2 py-1"
                autoFocus
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Salutation
              <input
                name="salutation"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Title
              <input
                name="title"
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Name
              <input
                name="name"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Surname
              <input
                name="surname"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Phone Number
              <input
                name="phoneNumber"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Birthday
              <input
                name="birthday"
                type="date"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Postal Code
              <input
                name="postalCode"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              City
              <input
                name="city"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Street
              <input
                name="street"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700">
              Country
              <input
                name="country"
                required
                className="mt-1 border rounded px-2 py-1"
              />
            </label>
            <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
              Course
              <select
                name="courseId"
                required
                className="mt-1 border rounded px-2 py-1"
                defaultValue=""
              >
                <option value="" disabled>-- Select a course --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.program?.name ?? 'Course'} ({new Date(course.startDate).toLocaleDateString('de-DE')})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Link
              href="/participant"
              className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 text-xs font-medium transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
            >
              Create Participant
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}