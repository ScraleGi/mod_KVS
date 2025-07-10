//---------------------------------------------------
// IMPORTS AND DEPENDENCIES
//---------------------------------------------------
import { db } from '@/lib/db'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { sanitize } from '@/lib/sanitize'

//---------------------------------------------------
// SERVER ACTIONS
//---------------------------------------------------
async function createParticipant(formData: FormData) {
  'use server'
  try {
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

    const participant = await db.participant.create({
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

    // Only create course registration if a course was selected
    if (courseId) {
      await db.courseRegistration.create({
        data: {
          courseId,
          participantId: participant.id,
        }
      })
    }

    redirect(`/participant/${participant.id}`)
  } catch (error) {
    console.error('Failed to create participant:', error)
    throw error
  }
}

//---------------------------------------------------
// MAIN COMPONENT
//---------------------------------------------------
export default async function NewParticipantPage() {
  try {
    //---------------------------------------------------
    // DATA FETCHING
    //---------------------------------------------------
    // Fetch all available courses for the select dropdown
    const coursesData = await db.course.findMany({
      where: { deletedAt: null },
      include: { program: true },
      orderBy: { startDate: 'desc' }
    })
    
    // Sanitize data to handle any special types
    const courses = sanitize(coursesData)


      //---------------------------------------------------
    // RENDER UI
    //---------------------------------------------------
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-2 py-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-neutral-100 p-8">
          <h1 className="text-2xl font-bold mb-6 text-neutral-900 text-center">Teilnehmer hinzufügen</h1>
          <form
            action={createParticipant}
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
                Anrede
                <input
                  name="salutation"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Titel
                <input
                  name="title"
                  className="mt-1 border rounded px-2 py-1"
                  placeholder="Optional"
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
                Nachname
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
                Tel.
                <input
                  name="phoneNumber"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Geburtstag
                <input
                  name="birthday"
                  type="date"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                PLZ
                <input
                  name="postalCode"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Ort
                <input
                  name="city"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Straße
                <input
                  name="street"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700">
                Land
                <input
                  name="country"
                  required
                  className="mt-1 border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-neutral-700 sm:col-span-2">
                Kurs (Optional)
                <select
                  name="courseId"
                  className="mt-1 border rounded px-2 py-1"
                  defaultValue=""
                >
                  <option value="">-- Kurs Auswahl --</option>
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
                Abbrechen
              </Link>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-medium transition"
              >
                Teilnehmer hinzufügen
              </button>
            </div>
          </form>
      </div>
    </div>
    )
  } catch (error) {
    // ERROR STATE
    console.error('Error loading course data:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full px-4 bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">
              Beim Laden der Kursdaten ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
            </p>
        </div>
      </div>
    )
  }
}