import { PrismaClient } from '../../../../generated/prisma/client'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function NewParticipantPage() {
  // Fetch all available courses for the select dropdown
  const courses = await prisma.course.findMany({
    where: { deletedAt: null },
    include: { program: true }
  })

  async function createParticipant(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const courseId = formData.get('courseId') as string

    // Create participant
    const participant = await prisma.participant.create({
      data: { name, email, phoneNumber }
    })

    // Register participant to course if selected
    if (courseId) {
      await prisma.courseRegistration.create({
        data: {
          courseId,
          participantId: participant.id,
          status: 'Registered'
        }
      })
    }

    redirect(`/participant/${participant.id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white shadow rounded-md p-8 w-full max-w-md border border-neutral-200">
        <h1 className="text-xl font-bold mb-6 text-blue-700">Add New Participant</h1>
        <form action={createParticipant} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              required
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              required
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course (optional)</label>
            <select
              name="courseId"
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              defaultValue=""
            >
              <option value="">-- Select a course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.program?.name ?? 'Course'} ({new Date(course.startDate).toLocaleDateString('de-DE')})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
          >
            Create Participant
          </button>
        </form>
      </div>
    </div>
  )
}