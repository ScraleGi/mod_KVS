import dynamic from "next/dynamic"
import { PrismaClient } from '../../../../../generated/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EditCourseForm from '@/components/course/EditCourseForm'

const prisma = new PrismaClient()

interface EditCoursePageProps {
  params: {
    id: string
  }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  // Server action zum Aktualisieren des Kurses
  const changeCourse = async (formData: FormData) => {
    'use server'
    const id = formData.get('id') as string
    const startDate = formData.get('startDate') as string
    const mainTrainerId = formData.get('mainTrainerId') as string
    const trainerIds = formData.getAll('trainerIds') as string[]

    // MainTrainer aus den AdditionalTrainers entfernen
    const filteredTrainerIds = trainerIds.filter(tid => tid !== mainTrainerId)

    await prisma.course.update({
      where: { id },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        mainTrainer: { connect: { id: mainTrainerId } },
        trainers: {
          set: filteredTrainerIds.map(id => ({ id })),
        },
      },
    })
    redirect('/course')
  }

  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      program: true,
      mainTrainer: true,
      trainers: true,
    },
  })

  // Alle Trainer laden
  const trainers = await prisma.trainer.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          <div className="px-8 py-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 tracking-tight">
              Edit Course
            </h1>
            <EditCourseForm
              id={id}
              course={course}
              trainers={trainers}
              onSubmit={changeCourse}
            />
            <Link
              href="/course"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center mt-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}