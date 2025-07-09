import { PrismaClient } from '../../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

interface EditCoursePageProps {
  params: {
    id: string
  }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params

  const [course, trainers] = await Promise.all([
    prisma.course.findUnique({
      where: { id },
      include: {
        program: true,
        mainTrainer: true,
        trainers: true,
      },
    }),
    prisma.trainer.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  const changeCourse = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string 
    const mainTrainerId = formData.get('mainTrainerId') as string
    const trainerIds = formData.getAll('trainerIds') as string[]
    const filteredTrainerIds = trainerIds.filter(tid => tid !== mainTrainerId)

    await prisma.course.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        mainTrainer: { connect: { id: mainTrainerId } },
        trainers: {
          set: filteredTrainerIds.map(id => ({ id })),
        },
      },
    })
    redirect('/course')
  }

  // Soft Delete Handler
  async function deleteCourse(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
    redirect('/course')
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">Course not found.</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow border border-gray-100">
          <div className="px-6 py-8">
            <h1 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">
              Edit Course
            </h1>
            <form action={changeCourse} className="space-y-6">
              <input type="hidden" name="id" value={id} />
              {/* Program (readonly) */}
              <div className="space-y-1">
                <label htmlFor="program" className="block text-xs font-medium text-gray-600">
                  Program
                </label>
                <input
                  id="program"
                  name="program"
                  type="text"
                  value={course?.program?.name || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              {/* Start Date */}
              <div className="space-y-1">
                <label htmlFor="startDate" className="block text-xs font-medium text-gray-600">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={course?.startDate?.toISOString().slice(0, 10)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              {/* End Date */}
              <div className="space-y-1">
                <label htmlFor="endDate" className="block text-xs font-medium text-gray-600">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="End date"
                  defaultValue={course?.endDate ? course.endDate.toISOString().substring(0, 10) : ''}
                />
              </div>
              {/* Main Trainer */}
              <div className="space-y-1">
                <label htmlFor="mainTrainerId" className="block text-xs font-medium text-gray-600">
                  Main Trainer
                </label>
                <select
                  id="mainTrainerId"
                  name="mainTrainerId"
                  defaultValue={course?.mainTrainer?.id || ''}
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="" disabled>Select main trainer</option>
                  {trainers.map(trainer => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name} {trainer.surname}
                    </option>
                  ))}
                </select>
              </div>
              {/* Additional Trainers */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-600">
                  Additional Trainers
                </label>
                <div className="flex flex-wrap gap-2" id="trainer-checkboxes">
                  {trainers
                    .filter(trainer => trainer.id !== course.mainTrainer?.id)
                    .map(trainer => (
                      <label key={trainer.id} className="flex items-center space-x-2 trainer-checkbox-label" data-trainer-id={trainer.id}>
                        <input
                          type="checkbox"
                          name="trainerIds"
                          value={trainer.id}
                          defaultChecked={course?.trainers.some((t: any) => t.id === trainer.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 trainer-checkbox"
                        />
                        <span className="text-xs">{trainer.name} {trainer.surname}</span>
                      </label>
                    ))}
                </div>
              </div>
              {/* Actions */}
              <div className="pt-2 mt-6 flex justify-between items-center w-full">
                <button
                  type="submit"
                  className="inline-flex items-center cursor-pointer px-5 py-2 border border-transparent text-xs font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
                <Link
                  href="/course"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Courses
                </Link>
              </div>
            </form>
          </div>
        </div>
        {/* Soft Delete Link außerhalb der Box, rechtsbündig */}
        <form action={deleteCourse} className="mt-4 flex justify-end w-full">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center cursor-pointer text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition bg-transparent border-none p-0 font-normal pr-12"
            style={{ boxShadow: 'none' }}
            title="Soft Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c1.657 0 3.22.402 4.575 1.125M21.542 12c-1.274 4.057-5.065 7-9.542 7-1.657 0-3.22-.402-4.575-1.125M9.88 9.88l4.24 4.24" />
            </svg>
            Delete
          </button>
        </form>
      </div>
    </div>
  )
}